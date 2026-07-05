import type { SupabaseClient } from "@supabase/supabase-js";
import type { BonusStatus } from "@/lib/pro/referrals";

export type AdminReferralPayoutFilter = "owed" | "paid" | "ineligible" | "pending" | "all";

export type AdminReferralPayout = {
  id: string;
  professionalId: string;
  partnerPracticeName: string | null;
  partnerReferralSlug: string | null;
  referredEmail: string;
  referredName: string | null;
  referralStatus: string;
  bonusStatus: BonusStatus;
  bonusAmountCad: number | null;
  bonusIneligibleReason: string | null;
  notes: string | null;
  firstInvoiceCents: number | null;
  createdAt: string;
  signedUpAt: string | null;
  subscribedAt: string | null;
  bonusPaidAt: string | null;
};

type ReferralRow = {
  id: string;
  professional_id: string;
  referred_email: string;
  referred_name: string | null;
  status: string;
  bonus_status: string;
  bonus_amount_cad: number | null;
  bonus_ineligible_reason: string | null;
  notes: string | null;
  first_invoice_cents: number | null;
  created_at: string;
  signed_up_at: string | null;
  subscribed_at: string | null;
  bonus_paid_at: string | null;
  profiles:
    | {
        practice_name: string | null;
        referral_slug: string | null;
      }
    | {
        practice_name: string | null;
        referral_slug: string | null;
      }[]
    | null;
};

function mapRow(row: ReferralRow): AdminReferralPayout {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id as string,
    professionalId: row.professional_id as string,
    partnerPracticeName: (profile?.practice_name as string | null) ?? null,
    partnerReferralSlug: (profile?.referral_slug as string | null) ?? null,
    referredEmail: row.referred_email as string,
    referredName: (row.referred_name as string | null) ?? null,
    referralStatus: row.status as string,
    bonusStatus: row.bonus_status as BonusStatus,
    bonusAmountCad: row.bonus_amount_cad != null ? Number(row.bonus_amount_cad) : null,
    bonusIneligibleReason: (row.bonus_ineligible_reason as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    firstInvoiceCents: row.first_invoice_cents != null ? Number(row.first_invoice_cents) : null,
    createdAt: row.created_at as string,
    signedUpAt: (row.signed_up_at as string | null) ?? null,
    subscribedAt: (row.subscribed_at as string | null) ?? null,
    bonusPaidAt: (row.bonus_paid_at as string | null) ?? null,
  };
}

export async function listAdminReferralPayouts(
  supabase: SupabaseClient,
  filter: AdminReferralPayoutFilter = "owed",
): Promise<AdminReferralPayout[]> {
  let query = supabase
    .from("professional_referrals")
    .select(
      `
      id,
      professional_id,
      referred_email,
      referred_name,
      status,
      bonus_status,
      bonus_amount_cad,
      bonus_ineligible_reason,
      notes,
      first_invoice_cents,
      created_at,
      signed_up_at,
      subscribed_at,
      bonus_paid_at,
      profiles (
        practice_name,
        referral_slug
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (filter === "owed") {
    query = query.eq("bonus_status", "eligible");
  } else if (filter === "paid") {
    query = query.eq("bonus_status", "paid");
  } else if (filter === "ineligible") {
    query = query.eq("bonus_status", "ineligible");
  } else if (filter === "pending") {
    query = query.in("bonus_status", ["pending"]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin] list referral payouts failed:", error.message);
    return [];
  }

  return (data as ReferralRow[]).map(mapRow);
}

export function adminReferralPayoutSummary(payouts: AdminReferralPayout[]) {
  const owed = payouts.filter((p) => p.bonusStatus === "eligible");
  const paid = payouts.filter((p) => p.bonusStatus === "paid");
  const owedTotal = owed.reduce((sum, p) => sum + (p.bonusAmountCad ?? 0), 0);
  const paidTotal = paid.reduce((sum, p) => sum + (p.bonusAmountCad ?? 0), 0);

  return {
    owedCount: owed.length,
    owedTotalCad: owedTotal,
    paidCount: paid.length,
    paidTotalCad: paidTotal,
  };
}

export async function adminReferralPayoutSummaryAll(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("professional_referrals")
    .select("bonus_status, bonus_amount_cad");

  if (error) {
    console.error("[admin] payout summary failed:", error.message);
    return { owedCount: 0, owedTotalCad: 0, paidCount: 0, paidTotalCad: 0 };
  }

  const rows = data ?? [];
  const owed = rows.filter((r) => r.bonus_status === "eligible");
  const paid = rows.filter((r) => r.bonus_status === "paid");

  return {
    owedCount: owed.length,
    owedTotalCad: owed.reduce((sum, r) => sum + Number(r.bonus_amount_cad ?? 0), 0),
    paidCount: paid.length,
    paidTotalCad: paid.reduce((sum, r) => sum + Number(r.bonus_amount_cad ?? 0), 0),
  };
}
