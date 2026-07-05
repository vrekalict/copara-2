"use server";

import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { BRAND, brandEmailFrom } from "@/lib/brand";
import {
  buildReferralUrl,
  findProfessionalByReferralCode,
  getProfessionalReferrals,
  getReferralCodeForUser,
  recordProfessionalReferral,
  referralStats,
} from "@/lib/pro/referrals";
import { PRO_REFERRAL_BONUS } from "@/lib/pro/config";
import { SITE } from "@/lib/marketing/site";

export async function getProReferralDashboard(userId: string) {
  const supabase = await createClient();
  const code = await getReferralCodeForUser(supabase, userId);
  const referrals = await getProfessionalReferrals(supabase, userId);
  const stats = referralStats(referrals);

  return {
    referralCode: code,
    referralUrl: buildReferralUrl(SITE.url, code),
    bonusPercent: PRO_REFERRAL_BONUS.firstInvoicePercent,
    currency: PRO_REFERRAL_BONUS.currency,
    stats,
    referrals,
  };
}

export async function captureReferralLead(input: {
  referralCode: string;
  email: string;
  name?: string;
  source?: string;
}) {
  const supabase = createServiceClient();
  const professional = await findProfessionalByReferralCode(supabase, input.referralCode);
  if (!professional) return { error: "Invalid referral code." };

  return recordProfessionalReferral(supabase, {
    professionalId: professional.id,
    referralCode: professional.referralCode,
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