import type { SupabaseClient } from "@supabase/supabase-js";
import { ACTIVE_SUBSCRIPTION_STATUSES, isFamilyPlan, type PlanKey } from "@/lib/stripe/config";

export type SubscriptionSummary = {
  id: string;
  planKey: PlanKey;
  status: string;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isOwner: boolean;
};

export type AppAccess = {
  hasAccess: boolean;
  reason: "own_subscription" | "family_circle" | "none";
  subscription: SubscriptionSummary | null;
};

function isActiveStatus(status: string) {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionSummary | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("id, plan_key, status, trial_end, current_period_end, cancel_at_period_end, user_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || !isActiveStatus(data.status as string)) return null;

  return {
    id: data.id as string,
    planKey: data.plan_key as PlanKey,
    status: data.status as string,
    trialEnd: (data.trial_end as string | null) ?? null,
    currentPeriodEnd: (data.current_period_end as string | null) ?? null,
    cancelAtPeriodEnd: Boolean(data.cancel_at_period_end),
    isOwner: true,
  };
}

export async function getFamilyCircleSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionSummary | null> {
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const circleIds = (memberships ?? []).map((m) => m.circle_id as string);
  if (circleIds.length === 0) return null;

  const { data: subs } = await supabase
    .from("subscriptions")
    .select(
      "id, plan_key, status, trial_end, current_period_end, cancel_at_period_end, user_id, circle_id",
    )
    .in("circle_id", circleIds)
    .in("plan_key", ["family_monthly", "family_yearly"])
    .order("created_at", { ascending: false });

  const active = (subs ?? []).find((row) => isActiveStatus(row.status as string));
  if (!active) return null;

  return {
    id: active.id as string,
    planKey: active.plan_key as PlanKey,
    status: active.status as string,
    trialEnd: (active.trial_end as string | null) ?? null,
    currentPeriodEnd: (active.current_period_end as string | null) ?? null,
    cancelAtPeriodEnd: Boolean(active.cancel_at_period_end),
    isOwner: active.user_id === userId,
  };
}

export async function getAppAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<AppAccess> {
  const own = await getUserSubscription(supabase, userId);
  if (own) {
    return { hasAccess: true, reason: "own_subscription", subscription: own };
  }

  const family = await getFamilyCircleSubscription(supabase, userId);
  if (family) {
    return { hasAccess: true, reason: "family_circle", subscription: family };
  }

  return { hasAccess: false, reason: "none", subscription: null };
}

export async function userNeedsCheckout(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const access = await getAppAccess(supabase, userId);
  return !access.hasAccess;
}

export function subscriptionCoversCircle(planKey: PlanKey, circleId: string | null) {
  return isFamilyPlan(planKey) && Boolean(circleId);
}
