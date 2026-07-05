import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service";
import { PRO_REFERRAL_BONUS } from "@/lib/pro/config";

export function isApprovedPartner(profile: {
  partner_approved_at?: string | null;
} | null): boolean {
  return Boolean(profile?.partner_approved_at);
}

export async function getPartnerProfile(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("id, partner_approved_at, partner_application_id, referral_code, display_name")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

export async function requireApprovedPartner(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<{ ok: true } | { ok: false; reason: "sign_in" | "not_approved" | "pending" }> {
  const profile = await getPartnerProfile(supabase, userId);
  if (!profile) return { ok: false, reason: "not_approved" };
  if (!isApprovedPartner(profile)) {
    if (email) {
      const service = createServiceClient();
      const { data: app } = await service
        .from("professional_partner_applications")
        .select("status")
        .eq("email", email.trim().toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (app?.status === "pending") return { ok: false, reason: "pending" };
    }
    return { ok: false, reason: "not_approved" };
  }
  return { ok: true };
}

export function getAdminEmails(): string[] {
  const raw = process.env.COPARA_ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

export function calculateReferralBonusCad(invoiceAmountCents: number): number {
  const bonusCents = Math.round(
    invoiceAmountCents * (PRO_REFERRAL_BONUS.firstInvoicePercent / 100),
  );
  return Math.round(bonusCents) / 100;
}
