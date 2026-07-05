import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isApprovedPartner } from "@/lib/pro/partner";

export type ReferralStatus = "pending" | "signed_up" | "subscribed" | "ineligible";
export type BonusStatus = "pending" | "eligible" | "paid" | "ineligible";

export type ProfessionalReferral = {
  id: string;
  referredEmail: string;
  referredName: string | null;
  status: ReferralStatus;
  bonusAmountCad: number | null;
  bonusStatus: BonusStatus;
  bonusIneligibleReason: string | null;
  source: string;
  createdAt: string;
  signedUpAt: string | null;
  subscribedAt: string | null;
};

function normalizeCode(code: string) {
  return code.trim().toLowerCase();
}

function generateReferralCode() {
  return randomBytes(4).toString("hex");
}

export async function getReferralCodeForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, partner_approved_at")
    .eq("id", userId)
    .maybeSingle();

  if (!isApprovedPartner(profile)) {
    throw new Error("Partner access is not approved.");
  }

  if (profile?.referral_code) {
    return profile.referral_code as string;
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateReferralCode();
    const { error } = await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId);

    if (!error) return code;
  }

  const { data: refreshed } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  if (refreshed?.referral_code) {
    return refreshed.referral_code as string;
  }

  throw new Error("Could not generate referral code.");
}

export async function findProfessionalByReferralCode(
  supabase: SupabaseClient,
  code: string,
): Promise<{ id: string; referralCode: string } | null> {
  const normalized = normalizeCode(code);
  const { data } = await supabase
    .from("profiles")
    .select("id, referral_code, partner_approved_at")
    .eq("referral_code", normalized)
    .maybeSingle();

  if (!data?.referral_code || !data.partner_approved_at) return null;
  return { id: data.id as string, referralCode: data.referral_code as string };
}

export async function recordProfessionalReferral(
  supabase: SupabaseClient,
  input: {
    professionalId: string;
    referralCode: string;
    referredEmail: string;
    referredName?: string;
    source?: string;
    initialStatus?: ReferralStatus;
  },
) {
  const email = input.referredEmail.trim().toLowerCase();
  if (!email) return { error: "Email required." };

  const { data: existing } = await supabase
    .from("professional_referrals")
    .select("id, status")
    .eq("professional_id", input.professionalId)
    .eq("referred_email", email)
    .maybeSingle();

  if (existing) {
    if (input.initialStatus === "signed_up" && existing.status === "pending") {
      await supabase
        .from("professional_referrals")
        .update({ status: "signed_up", signed_up_at: new Date().toISOString() })
        .eq("id", existing.id as string);
    }
    return { success: true, id: existing.id as string, duplicate: true };
  }

  const status = input.initialStatus ?? "pending";
  const now = status === "signed_up" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("professional_referrals")
    .insert({
      professional_id: input.professionalId,
      referral_code: normalizeCode(input.referralCode),
      referred_email: email,
      referred_name: input.referredName?.trim() || null,
      source: input.source ?? "referral_link",
      status,
      signed_up_at: now,
      bonus_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[referrals] insert failed:", error.message);
    return { error: "Could not record referral." };
  }

  return { success: true, id: data.id as string };
}

export async function getProfessionalReferrals(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfessionalReferral[]> {
  const { data, error } = await supabase
    .from("professional_referrals")
    .select(
      "id, referred_email, referred_name, status, bonus_amount_cad, bonus_status, bonus_ineligible_reason, source, created_at, signed_up_at, subscribed_at",
    )
    .eq("professional_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[referrals] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    referredEmail: row.referred_email as string,
    referredName: (row.referred_name as string | null) ?? null,
    status: row.status as ReferralStatus,
    bonusAmountCad: row.bonus_amount_cad != null ? Number(row.bonus_amount_cad) : null,
    bonusStatus: row.bonus_status as BonusStatus,
    bonusIneligibleReason: (row.bonus_ineligible_reason as string | null) ?? null,
    source: row.source as string,
    createdAt: row.created_at as string,
    signedUpAt: (row.signed_up_at as string | null) ?? null,
    subscribedAt: (row.subscribed_at as string | null) ?? null,
  }));
}

export function referralStats(referrals: ProfessionalReferral[]) {
  const pending = referrals.filter((r) => r.status === "pending").length;
  const signedUp = referrals.filter((r) => r.status === "signed_up").length;
  const subscribed = referrals.filter((r) => r.status === "subscribed").length;
  const bonusEligible = referrals.filter((r) => r.bonusStatus === "eligible").length;
  const bonusPaid = referrals.filter((r) => r.bonusStatus === "paid").length;
  const potentialBonus = referrals
    .filter((r) => r.bonusStatus === "eligible")
    .reduce((sum, r) => sum + (r.bonusAmountCad ?? 0), 0);

  return { pending, signedUp, subscribed, bonusEligible, bonusPaid, potentialBonus, total: referrals.length };
}

export function buildReferralUrl(siteUrl: string, code: string) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/sign-up?ref=${encodeURIComponent(code)}`;
}
