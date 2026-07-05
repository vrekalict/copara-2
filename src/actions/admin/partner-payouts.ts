"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  adminReferralPayoutSummaryAll,
  listAdminReferralPayouts,
  type AdminReferralPayoutFilter,
} from "@/lib/admin/partner-payouts";
import { isAdminEmail } from "@/lib/pro/partner";
import { getStaffBasePath, staffPath } from "@/lib/admin/staff-path";
import { redirect } from "next/navigation";

async function requireAdminActor() {
  if (!getStaffBasePath()) {
    redirect("/");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect(`/sign-in?next=${encodeURIComponent(staffPath("/partners/payouts"))}`);
  }

  return { user, service: createServiceClient() };
}

export async function getAdminPartnerPayouts(filter: AdminReferralPayoutFilter = "owed") {
  const { service } = await requireAdminActor();
  const [payouts, summary] = await Promise.all([
    listAdminReferralPayouts(service, filter),
    adminReferralPayoutSummaryAll(service),
  ]);

  return { payouts, summary };
}

function revalidatePayoutPages() {
  revalidatePath("/admin/partners/payouts");
  revalidatePath("/admin/partners");
}

export async function markPartnerReferralPaid(
  referralId: string,
  notes?: string,
): Promise<{ error?: string; success?: boolean }> {
  const { user, service } = await requireAdminActor();

  const { data: referral } = await service
    .from("professional_referrals")
    .select("id, bonus_status, bonus_amount_cad")
    .eq("id", referralId)
    .maybeSingle();

  if (!referral) {
    return { error: "Referral not found." };
  }

  if (referral.bonus_status !== "eligible") {
    return { error: "Only eligible bonuses can be marked paid." };
  }

  const trimmedNotes = notes?.trim();
  const now = new Date().toISOString();

  const { error } = await service
    .from("professional_referrals")
    .update({
      bonus_status: "paid",
      bonus_paid_at: now,
      bonus_paid_by: user.id,
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    })
    .eq("id", referralId);

  if (error) {
    console.error("[admin] mark referral paid failed:", error.message);
    return { error: "Could not mark payout as paid." };
  }

  revalidatePayoutPages();
  return { success: true };
}

export async function revertPartnerReferralToEligible(
  referralId: string,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminActor();
  const service = createServiceClient();

  const { data: referral } = await service
    .from("professional_referrals")
    .select("id, bonus_status")
    .eq("id", referralId)
    .maybeSingle();

  if (!referral) {
    return { error: "Referral not found." };
  }

  if (referral.bonus_status !== "paid") {
    return { error: "Only paid bonuses can be reverted to eligible." };
  }

  const { error } = await service
    .from("professional_referrals")
    .update({
      bonus_status: "eligible",
      bonus_paid_at: null,
      bonus_paid_by: null,
    })
    .eq("id", referralId);

  if (error) {
    console.error("[admin] revert referral payout failed:", error.message);
    return { error: "Could not revert payout status." };
  }

  revalidatePayoutPages();
  return { success: true };
}

export async function updatePartnerReferralPayoutNotes(
  referralId: string,
  notes: string,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminActor();
  const service = createServiceClient();

  const { error } = await service
    .from("professional_referrals")
    .update({ notes: notes.trim() || null })
    .eq("id", referralId);

  if (error) {
    console.error("[admin] update referral notes failed:", error.message);
    return { error: "Could not save notes." };
  }

  revalidatePayoutPages();
  return { success: true };
}

export async function updatePartnerReferralBonusAmount(
  referralId: string,
  amountCad: number,
): Promise<{ error?: string; success?: boolean }> {
  await requireAdminActor();
  const service = createServiceClient();

  if (!Number.isFinite(amountCad) || amountCad < 0) {
    return { error: "Enter a valid amount." };
  }

  const { data: referral } = await service
    .from("professional_referrals")
    .select("id, bonus_status")
    .eq("id", referralId)
    .maybeSingle();

  if (!referral) {
    return { error: "Referral not found." };
  }

  if (!["eligible", "paid", "pending"].includes(referral.bonus_status as string)) {
    return { error: "Bonus amount cannot be edited for this referral." };
  }

  const { error } = await service
    .from("professional_referrals")
    .update({ bonus_amount_cad: Math.round(amountCad * 100) / 100 })
    .eq("id", referralId);

  if (error) {
    console.error("[admin] update bonus amount failed:", error.message);
    return { error: "Could not update bonus amount." };
  }

  revalidatePayoutPages();
  return { success: true };
}
