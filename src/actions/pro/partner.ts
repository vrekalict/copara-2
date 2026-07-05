"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { brandEmailFrom } from "@/lib/brand";
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
  approvalEmailSentCount: number;
  approvalEmailLastSentAt: string | null;
  approvalTokenExpiresAt: string | null;
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
      "id, email, first_name, last_name, location, practice, message, status, created_at, reviewed_at, approval_email_sent_count, approval_email_last_sent_at, approval_token_expires_at",
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
    approvalEmailSentCount: (row.approval_email_sent_count as number | null) ?? 0,
    approvalEmailLastSentAt: (row.approval_email_last_sent_at as string | null) ?? null,
    approvalTokenExpiresAt: (row.approval_token_expires_at as string | null) ?? null,
  }));
}

async function sendPartnerApprovalEmail(
  service: ReturnType<typeof createServiceClient>,
  applicationId: string,
  input: {
    email: string;
    firstName: string;
    token: string;
  },
): Promise<{ ok: true; sendCount: number } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const activateUrl = `${SITE.url.replace(/\/$/, "")}/pro/activate?token=${encodeURIComponent(input.token)}`;

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: brandEmailFrom("hello"),
      to: input.email,
      subject: "Your Copara partner access is approved",
      text: [
        `Hi ${input.firstName},`,
        "",
        "Your Copara professional partner application has been approved.",
        "",
        `Create your partner account: ${activateUrl}`,
        "",
        "You will set a password for the email address on your application. This link expires in 14 days.",
        "",
        "If you already have a Copara account with that email, open the link and choose Sign in instead.",
        "",
        `Questions? ${SITE.supportEmail}`,
      ].join("\n"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed.";
    console.error("[partner] approval email failed:", message);
    return { ok: false, error: message };
  }

  const { data: current } = await service
    .from("professional_partner_applications")
    .select("approval_email_sent_count")
    .eq("id", applicationId)
    .maybeSingle();

  const sendCount = ((current?.approval_email_sent_count as number | null) ?? 0) + 1;
  const now = new Date().toISOString();

  await service
    .from("professional_partner_applications")
    .update({
      approval_email_sent_count: sendCount,
      approval_email_last_sent_at: now,
    })
    .eq("id", applicationId);

  return { ok: true, sendCount };
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

  const emailResult = await sendPartnerApprovalEmail(service, applicationId, {
    email: application.email as string,
    firstName: application.first_name as string,
    token,
  });

  if (!emailResult.ok) {
    return {
      success: true,
      emailSent: false,
      emailError: emailResult.error,
    };
  }

  return { success: true, emailSent: true, sendCount: emailResult.sendCount };
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

export async function resendPartnerApprovalEmail(applicationId: string) {
  await requireAdminUser();
  const service = createServiceClient();

  const { data: application } = await service
    .from("professional_partner_applications")
    .select(
      "id, email, first_name, status, approval_token, approval_token_expires_at, approval_email_sent_count",
    )
    .eq("id", applicationId)
    .maybeSingle();

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.status !== "approved") {
    return { error: "Only approved applications can receive activation emails." };
  }

  let token = application.approval_token as string | null;
  const expiresAt = application.approval_token_expires_at as string | null;
  const tokenExpired = !expiresAt || new Date(expiresAt).getTime() < Date.now();

  if (!token || tokenExpired) {
    token = randomBytes(32).toString("hex");
    const newExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const { error: updateError } = await service
      .from("professional_partner_applications")
      .update({
        approval_token: token,
        approval_token_expires_at: newExpiresAt,
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("[admin] resend token refresh failed:", updateError.message);
      return { error: "Could not refresh activation link." };
    }
  }

  const emailResult = await sendPartnerApprovalEmail(service, applicationId, {
    email: application.email as string,
    firstName: application.first_name as string,
    token,
  });

  if (!emailResult.ok) {
    return { error: emailResult.error };
  }

  return { success: true, sendCount: emailResult.sendCount };
}

export async function deletePartnerApplication(applicationId: string) {
  await requireAdminUser();
  const service = createServiceClient();

  const { data: application } = await service
    .from("professional_partner_applications")
    .select("id, status, user_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.status === "activated" || application.user_id) {
    return { error: "Activated partner accounts cannot be deleted from this list." };
  }

  const { error } = await service
    .from("professional_partner_applications")
    .delete()
    .eq("id", applicationId);

  if (error) {
    console.error("[admin] delete application failed:", error.message);
    return { error: "Could not delete application." };
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

  if (!data) return null;

  if (data.status === "activated") {
    return {
      expired: false as const,
      alreadyActivated: true as const,
      applicationId: data.id as string,
      email: data.email as string,
      firstName: data.first_name as string,
      lastName: data.last_name as string,
    };
  }

  if (data.status !== "approved") return null;

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

  if ("alreadyActivated" in activation && activation.alreadyActivated) {
    redirect("/pro/dashboard");
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

  if (data.user?.identities?.length === 0) {
    return {
      error: "An account with this email already exists. Use Sign in instead below.",
    };
  }

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
