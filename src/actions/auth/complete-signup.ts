"use server";

import { redirect } from "next/navigation";
import { recordLegalAcceptance } from "@/actions/legal/acceptance";
import { captureReferralLead } from "@/actions/pro/referrals";
import { parseLegalFromForm, validateLegalForm } from "@/lib/auth/legal-form";
import { resolveAuthRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function completeSignupLegal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/complete-signup");
  }

  const legal = parseLegalFromForm(formData);
  const validationError = validateLegalForm(legal);
  if (validationError) {
    return { error: validationError };
  }

  const result = await recordLegalAcceptance({
    email: user.email ?? undefined,
    province: legal.province,
    confirmedFrenchAccess: legal.confirmedFrenchAccess,
    acceptedTerms: legal.acceptedTerms,
    acceptedPrivacy: legal.acceptedPrivacy,
    userId: user.id,
  });

  if (result.error) {
    return { error: result.error };
  }

  const ref = String(formData.get("ref") ?? "").trim();
  if (ref && user.email) {
    await captureReferralLead({
      referralCode: ref,
      email: user.email,
      source: "signup",
    }).then((leadResult) => {
      if (leadResult.error) {
        console.warn("[complete-signup] referral capture failed:", leadResult.error);
      }
    });

    const { linkReferralToUser } = await import("@/lib/pro/referral-bonus");
    await linkReferralToUser(createServiceClient(), user.email, user.id);
  }

  const next = resolveAuthRedirect({
    next: String(formData.get("next") ?? ""),
    plan: String(formData.get("plan") ?? ""),
    ref,
    fallback: "/app",
  });

  redirect(next);
}
