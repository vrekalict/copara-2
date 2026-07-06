"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { BRAND, brandEmailFrom } from "@/lib/brand";
import {
  buildReferralUrl,
  findProfessionalByReferralRef,
  getPartnerDashboardProfile,
  getProfessionalReferrals,
  getReferralSlugForUser,
  recordProfessionalReferral,
  referralStats,
  checkReferralSlugAvailability,
  updatePartnerPracticeProfile,
  updatePartnerReferralSlug,
} from "@/lib/pro/referrals";
import { PRO_REFERRAL_BONUS } from "@/lib/pro/config";
import { SITE } from "@/lib/marketing/site";

export async function getProReferralDashboard(userId: string, signInEmail?: string | null) {
  const supabase = await createClient();
  const profile = await getPartnerDashboardProfile(supabase, userId, signInEmail);
  const slug = await getReferralSlugForUser(supabase, userId);
  const referrals = await getProfessionalReferrals(supabase, userId);
  const stats = referralStats(referrals);

  return {
    practiceName: profile.practiceName,
    payoutEmail: profile.payoutEmail,
    payoutEmailSuggested: profile.payoutEmailSuggested,
    referralSlug: slug,
    referralCode: slug,
    referralUrl: buildReferralUrl(SITE.url, slug),
    bonusPercent: PRO_REFERRAL_BONUS.firstInvoicePercent,
    currency: PRO_REFERRAL_BONUS.currency,
    stats,
    referrals,
  };
}

export async function checkPartnerReferralSlug(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { available: false, error: "Sign in required." };

  return checkReferralSlugAvailability(supabase, slug, user.id);
}

export async function savePartnerProfile(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const practiceName = String(formData.get("practiceName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const payoutEmail = String(formData.get("payoutEmail") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required." };

  const result = await updatePartnerPracticeProfile(supabase, user.id, {
    practiceName,
    slug,
    payoutEmail,
  });
  if ("error" in result && result.error) return { error: result.error };
  revalidatePath("/pro/dashboard");
  return { success: true };
}

export async function savePartnerReferralSlug(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const slug = String(formData.get("slug") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required." };

  const result = await updatePartnerReferralSlug(supabase, user.id, slug);
  if ("error" in result && result.error) return { error: result.error };
  revalidatePath("/pro/dashboard");
  return { success: true };
}

export async function captureReferralLead(input: {
  referralCode: string;
  email: string;
  name?: string;
  source?: string;
}) {
  const supabase = createServiceClient();
  const professional = await findProfessionalByReferralRef(supabase, input.referralCode);
  if (!professional) return { error: "Invalid referral code." };

  return recordProfessionalReferral(supabase, {
    professionalId: professional.id,
    referralCode: professional.referralSlug,
    referredEmail: input.email,
    referredName: input.name,
    source: input.source ?? "referral_link",
    initialStatus: input.source === "signup" ? "signed_up" : "pending",
  });
}

export async function submitProPartnerApplication(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const practice = String(formData.get("practice") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!email || !firstName || !lastName || !location || !practice) {
    return { error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const service = createServiceClient();
  const { data: existingPending } = await service
    .from("professional_partner_applications")
    .select("id")
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (existingPending) {
    return {
      error: "We already have a pending application for this email. We will be in touch soon.",
    };
  }

  const { error } = await service.from("professional_partner_applications").insert({
    email,
    first_name: firstName,
    last_name: lastName,
    location,
    practice,
    message: message || null,
  });

  if (error) {
    console.error("[pro-partner] application failed:", error.message);
    return { error: "Could not submit your request. Please try again." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: brandEmailFrom("hello"),
        to: BRAND.emails.hello,
        subject: `Pro partner application: ${firstName} ${lastName}`,
        text: [
          `Name: ${firstName} ${lastName}`,
          `Email: ${email}`,
          `Location: ${location}`,
          `Practice: ${practice}`,
          message ? `Message: ${message}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (err) {
      console.warn("[pro-partner] notify failed:", err);
    }
  }

  return { success: true };
}