import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isFamilyPlan, planKeyFromPriceId, type PlanKey } from "@/lib/stripe/config";

type SubscriptionRow = {
  user_id: string;
  circle_id: string | null;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan_key: PlanKey;
  status: string;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

function toIso(seconds: number | null | undefined) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

export function subscriptionRowFromStripe(
  subscription: Stripe.Subscription,
  userId: string,
  circleId: string | null,
): SubscriptionRow {
  const price = subscription.items.data[0]?.price;
  const priceId = price?.id ?? "";
  const planKey =
    planKeyFromPriceId(priceId) ??
    ((subscription.metadata?.planKey as PlanKey | undefined) ?? "parent_monthly");

  return {
    user_id: userId,
    circle_id: circleId,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    plan_key: planKey,
    status: subscription.status,
    trial_end: toIso(subscription.trial_end),
    current_period_end: toIso(subscription.items.data[0]?.current_period_end),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };
}

export async function upsertSubscription(
  supabase: SupabaseClient,
  row: SubscriptionRow,
) {
  const { error } = await supabase.from("subscriptions").upsert(row, {
    onConflict: "stripe_subscription_id",
  });

  if (error) {
    console.error("[stripe] upsert subscription failed:", error.message);
    throw error;
  }
}

export async function ensureStripeCustomerOnProfile(
  supabase: SupabaseClient,
  userId: string,
  customerId: string,
) {
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId)
    .is("stripe_customer_id", null);
}

export async function attachFamilySubscriptionToCircle(
  supabase: SupabaseClient,
  userId: string,
  circleId: string,
) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id, plan_key, circle_id")
    .eq("user_id", userId)
    .in("plan_key", ["family_monthly", "family_yearly"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub || sub.circle_id) return;
  if (!isFamilyPlan(sub.plan_key as PlanKey)) return;

  await supabase
    .from("subscriptions")
    .update({ circle_id: circleId, updated_at: new Date().toISOString() })
    .eq("id", sub.id as string);
}
