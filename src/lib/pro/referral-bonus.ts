import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { calculateReferralBonusCad } from "@/lib/pro/partner";

async function getUserIdForStripeCustomer(
  supabase: SupabaseClient,
  customerId: string,
): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return (profile?.id as string | undefined) ?? null;
}

async function getParentCircleIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("role", "parent");

  return (data ?? []).map((row) => row.circle_id as string);
}

async function resolveHouseholdKey(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const circleIds = await getParentCircleIds(supabase, userId);
  if (circleIds.length > 0) {
    return `circle:${circleIds.sort()[0]}`;
  }
  return `user:${userId}`;
}

async function householdBonusAlreadyClaimed(
  supabase: SupabaseClient,
  professionalId: string,
  payingUserId: string,
  householdKey: string,
): Promise<boolean> {
  const { data: existingByKey } = await supabase
    .from("professional_referrals")
    .select("id")
    .eq("professional_id", professionalId)
    .eq("household_key", householdKey)
    .in("bonus_status", ["eligible", "paid"])
    .limit(1);

  if (existingByKey?.length) return true;

  const circleIds = await getParentCircleIds(supabase, payingUserId);
  if (circleIds.length === 0) return false;

  for (const circleId of circleIds) {
    const { data: members } = await supabase
      .from("circle_members")
      .select("user_id")
      .eq("circle_id", circleId)
      .eq("status", "active")
      .eq("role", "parent")
      .neq("user_id", payingUserId);

    const memberIds = (members ?? [])
      .map((m) => m.user_id as string | null)
      .filter(Boolean) as string[];

    if (memberIds.length === 0) continue;

    const { data: memberClaims } = await supabase
      .from("professional_referrals")
      .select("id")
      .eq("professional_id", professionalId)
      .in("referred_user_id", memberIds)
      .in("bonus_status", ["eligible", "paid"])
      .limit(1);

    if (memberClaims?.length) return true;
  }

  return false;
}

async function findReferralForPayer(
  supabase: SupabaseClient,
  userId: string,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: byUser } = await supabase
    .from("professional_referrals")
    .select("id, professional_id, status, bonus_status, referred_email")
    .eq("referred_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byUser) return byUser;

  const { data: byEmail } = await supabase
    .from("professional_referrals")
    .select("id, professional_id, status, bonus_status, referred_email")
    .eq("referred_email", normalizedEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return byEmail;
}

export async function processReferralFirstInvoice(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice,
) {
  if (!invoice.amount_paid || invoice.amount_paid <= 0) return;

  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const userId = await getUserIdForStripeCustomer(supabase, customerId);
  if (!userId) return;

  const customerEmail =
    invoice.customer_email ??
    (typeof invoice.customer === "object" && invoice.customer && "email" in invoice.customer
      ? (invoice.customer.email as string | null)
      : null);

  if (!customerEmail) return;

  const referral = await findReferralForPayer(supabase, userId, customerEmail);
  if (!referral) return;

  if (referral.bonus_status === "eligible" || referral.bonus_status === "paid") {
    return;
  }

  const householdKey = await resolveHouseholdKey(supabase, userId);
  const alreadyClaimed = await householdBonusAlreadyClaimed(
    supabase,
    referral.professional_id as string,
    userId,
    householdKey,
  );

  const now = new Date().toISOString();

  if (alreadyClaimed) {
    await supabase
      .from("professional_referrals")
      .update({
        referred_user_id: userId,
        household_key: householdKey,
        status: "subscribed",
        subscribed_at: now,
        bonus_status: "ineligible",
        bonus_ineligible_reason: "Household bonus already claimed for this family.",
      })
      .eq("id", referral.id as string);
    return;
  }

  const bonusAmountCad = calculateReferralBonusCad(invoice.amount_paid);

  await supabase
    .from("professional_referrals")
    .update({
      referred_user_id: userId,
      household_key: householdKey,
      first_invoice_cents: invoice.amount_paid,
      bonus_amount_cad: bonusAmountCad,
      status: "subscribed",
      subscribed_at: now,
      bonus_status: "eligible",
      bonus_ineligible_reason: null,
    })
    .eq("id", referral.id as string);
}

export async function linkReferralToUser(
  supabase: SupabaseClient,
  email: string,
  userId: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  await supabase
    .from("professional_referrals")
    .update({
      referred_user_id: userId,
      status: "signed_up",
      signed_up_at: now,
    })
    .eq("referred_email", normalizedEmail)
    .in("status", ["pending"])
    .is("referred_user_id", null);
}
