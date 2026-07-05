"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { recordLegalAcceptance } from "@/actions/legal/acceptance";
import { captureReferralLead } from "@/actions/pro/referrals";
import { parseLegalFromForm, validateLegalForm } from "@/lib/auth/legal-form";
import { authCallbackUrl, resolveAuthRedirect, safeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

function nextPath(formData: FormData) {
  const value = String(formData.get("next") ?? "");
  return safeRedirectPath(value, "/onboarding/circle");
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const plan = String(formData.get("plan") ?? "").trim();
  const ref = String(formData.get("ref") ?? "").trim();
  const explicitNext = String(formData.get("next") ?? "").trim();
  const origin = (await headers()).get("origin");
  const legal = parseLegalFromForm(formData);

  const validationError = validateLegalForm(legal);
  if (validationError) {
    return { error: validationError };
  }

  const next = resolveAuthRedirect({
    next: explicitNext.startsWith("/join/") ? explicitNext : explicitNext || null,
    plan: plan || null,
    ref: ref || null,
    fallback: explicitNext ? nextPath(formData) : "/pricing",
  });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: authCallbackUrl(origin ?? "", next) },
  });

  if (error) {
    return { error: error.message };
  }

  await recordLegalAcceptance({
    email,
    province: legal.province,
    confirmedFrenchAccess: legal.confirmedFrenchAccess,
    acceptedTerms: legal.acceptedTerms,
    acceptedPrivacy: legal.acceptedPrivacy,
    userId: data.user?.id ?? null,
  }).then((result) => {
    if (result.error) {
      console.error("[auth] legal acceptance failed after signup:", result.error);
    }
  });

  if (ref) {
    await captureReferralLead({
      referralCode: ref,
      email,
      source: "signup",
    }).then((result) => {
      if (result.error) {
        console.warn("[auth] referral capture failed:", result.error);
      }
    });
  }

  if (data.user?.id) {
    const { linkReferralToUser } = await import("@/lib/pro/referral-bonus");
    const { createServiceClient } = await import("@/lib/supabase/service");
    await linkReferralToUser(createServiceClient(), email, data.user.id);
  }

  if (!data.session) {
    return { confirmEmail: true };
  }

  redirect(next);
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = nextPath(formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next);
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const next = nextPath(formData);
  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authCallbackUrl(origin ?? "", next) },
  });

  if (error) {
    return { error: error.message };
  }

  return { sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signOutTo(formData: FormData) {
  const next = safeRedirectPath(String(formData.get("next") ?? ""), "/sign-in");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(next);
}
