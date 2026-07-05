"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { BRAND, brandEmailFrom } from "@/lib/brand";
import { SITE } from "@/lib/marketing/site";
import { isAdminEmail } from "@/lib/pro/partner";
import { getStaffBasePath, staffPath } from "@/lib/admin/staff-path";
import { getReferralCodeForUser } from "@/lib/pro/referrals";

export type PartnerApplication = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  practice: string;
  message: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
};

async function requireAdminUser() {
  if (!getStaffBasePath()) {
    redirect("/");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect(`/sign-in?next=${encodeURIComponent(staffPath("/partners"))}`);
  }

  return { supabase, user };
}

export async function listPartnerApplications(): Promise<PartnerApplication[]> {
  await requireAdminUser();
  const service = createServiceClient();

  const { data, error } = await service
    .from("professional_partner_applications")
    .select(
      "id, email, first_name, last_name, location, practice, message, status, created_at, reviewed_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin] list applications failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    location: row.location as string,
    practice: row.practice as string,
    message: (row.message as string | null) ?? null,
    status: row.status as string,
    createdAt: row.created_at as string,
    reviewedAt: (row.reviewed_at as string | null) ?? null,
  }));
}

async function sendPartnerApprovalEmail(input: {
  email: string;
  firstName: string;
  token: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[partner] RESEND_API_KEY not set; skipping approval email.");
    return;
  }

  const origin = (await headers()).get("origin") ?? SITE.url;
  const activateUrl = `${origin.replace(/\/$/, "")}/pro/activate?token=${encodeURIComponent(input.token)}`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: brandEmailFrom("hello"),
    to: input.email,
    subject: "Your Copara partner access is approved",
    text: [
      `Hi ${input.firstName},`,
      "",
      "Your Copara professional partner application has been approved.",
      "",
      `Activate your partner dashboard: ${activateUrl}`,
      "",
      "This link expires in 14 days. If you already have a Copara account, sign in with the email you used on your application.",
      "",
      `Questions? ${SITE.supportEmail}`,
    ].join("\n"),
  });
}

export async function approvePartnerApplication(applicationId: string) {
  const { user } = await requireAdminUser();
  const service = createServiceClient();

  const { data: application } = await service
    .from("professional_partner_applications")
    .select("id, email, first_name, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.status !== "pending") {
    return { error: "Application is not pending." };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { error } = await service
    .from("professional_partner_applications")
    .update({
      status: "approved",
      approval_token: token,
      approval_token_expires_at: expiresAt,
      reviewed_at: now,
      reviewed_by: user.id,
    })
    .eq("id", applicationId);

  if (error) {
    console.error("[admin] approve failed:", error.message);
    return { error: "Could not approve application." };
  }

  try {
    await sendPartnerApprovalEmail({
      email: application.email as string,
      firstName: application.first_name as string,
      token,
    });
  } catch (err) {
    console.warn("[admin] approval email failed:", err);
  }

  return { success: true };
}

export async function rejectPartnerApplication(
  applicationId: string,
  reason?: string,
) {
  const { user } = await requireAdminUser();
  const service = createServiceClient();

  const { error } = await service
    .from("professional_partner_applications")
    .update({
      status: "rejected",
      rejection_reason: reason?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      approval_token: null,
      approval_token_expires_at: null,
    })
    .eq("id", applicationId)
    .eq("status", "pending");

  if (error) {
    console.error("[admin] reject failed:", error.message);
    return { error: "Could not reject application." };
  }

  return { success: true };
}

export async function getPartnerActivation(token: string) {
  if (!token.trim()) return null;

  const service = createServiceClient();
  const { data } = await service
    .from("professional_partner_applications")
    .select(
      "id, email, first_name, last_name, status, approval_token_expires_at, user_id",
    )
    .eq("approval_token", token.trim())
    .maybeSingle();

  if (!data || data.status !== "approved") return null;

  if (
    data.approval_token_expires_at &&
    new Date(data.approval_token_expires_at as string).getTime() < Date.now()
  ) {
    return { expired: true as const, email: data.email as string };
  }

  return {
    expired: false as const,
    applicationId: data.id as string,
    email: data.email as string,
    firstName: data.first_name as string,
    lastName: data.last_name as string,
    alreadyActivated: Boolean(data.user_id),
  };
}

export async function activatePartnerAccount(token: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Sign in to activate your partner account." };
  }

  const activation = await getPartnerActivation(token);
  if (!activation || ("expired" in activation && activation.expired)) {
    return { error: "This activation link is invalid or expired." };
  }

  if (user.email.trim().toLowerCase() !== activation.email.trim().toLowerCase()) {
    return {
      error: `Sign in with ${activation.email} — the email on your approved application.`,
    };
  }

  const service = createServiceClient();
  const now = new Date().toISOString();

  const { error: profileError } = await service
    .from("profiles")
    .update({
      partner_approved_at: now,
      partner_application_id: activation.applicationId,
      role_default: "professional",
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("[partner] activate profile failed:", profileError.message);
    return { error: "Could not activate partner access." };
  }

  await service
    .from("professional_partner_applications")
    .update({
      status: "activated",
      user_id: user.id,
      approval_token: null,
      approval_token_expires_at: null,
    })
    .eq("id", activation.applicationId);

  try {
    await getReferralCodeForUser(service, user.id);
  } catch (err) {
    console.warn("[partner] referral code generation failed:", err);
  }

  redirect("/pro/dashboard");
}

export async function signUpPartnerWithPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const province = String(formData.get("province") ?? "").trim();
  const acceptedLegal = formData.get("acceptedLegal") === "true";
  const confirmedFrenchAccess = formData.get("confirmedFrenchAccess") === "true";

  const activation = await getPartnerActivation(token);
  if (!activation || ("expired" in activation && activation.expired)) {
    return { error: "Invalid or expired activation link." };
  }

  if (email !== activation.email.trim().toLowerCase()) {
    return { error: "Email must match your approved application." };
  }

  if (!province) return { error: "Please select your province or territory." };
  if (!acceptedLegal) return { error: "You must agree to the Terms and Privacy Policy." };
  if (province.toLowerCase() === "quebec" && !confirmedFrenchAccess) {
    return {
      error:
        "Quebec users must confirm access to the French legal documents before continuing in English.",
    };
  }

  const origin = (await headers()).get("origin");
  const next = `/pro/activate?token=${encodeURIComponent(token)}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });

  if (error) return { error: error.message };

  const { recordLegalAcceptance } = await import("@/actions/legal/acceptance");
  await recordLegalAcceptance({
    email,
    province,
    confirmedFrenchAccess,
    acceptedTerms: acceptedLegal,
    acceptedPrivacy: acceptedLegal,
    userId: data.user?.id ?? null,
  });

  if (!data.session) {
    return { confirmEmail: true };
  }

  return activatePartnerAccount(token);
}
