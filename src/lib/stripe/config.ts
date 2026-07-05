export const STRIPE_TRIAL_DAYS = Number(process.env.STRIPE_TRIAL_DAYS ?? "14");

export const PLAN_KEYS = [
  "parent_monthly",
  "parent_yearly",
  "family_monthly",
  "family_yearly",
] as const;

export type PlanKey = (typeof PLAN_KEYS)[number];

export const PLAN_LABELS: Record<PlanKey, string> = {
  parent_monthly: "Parent Monthly",
  parent_yearly: "Parent Yearly",
  family_monthly: "Family Circle Monthly",
  family_yearly: "Family Circle Yearly",
};

export function isFamilyPlan(planKey: PlanKey) {
  return planKey === "family_monthly" || planKey === "family_yearly";
}

export function isPlanKey(value: string): value is PlanKey {
  return (PLAN_KEYS as readonly string[]).includes(value);
}

export function getStripePriceId(planKey: PlanKey): string | null {
  const map: Record<PlanKey, string | undefined> = {
    parent_monthly: process.env.STRIPE_PRICE_PARENT_MONTHLY,
    parent_yearly: process.env.STRIPE_PRICE_PARENT_YEARLY,
    family_monthly: process.env.STRIPE_PRICE_FAMILY_MONTHLY,
    family_yearly: process.env.STRIPE_PRICE_FAMILY_YEARLY,
  };
  return map[planKey] ?? null;
}

export function planKeyFromPriceId(priceId: string): PlanKey | null {
  for (const key of PLAN_KEYS) {
    if (getStripePriceId(key) === priceId) return key;
  }
  return null;
}

export const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "trialing",
  "active",
  "past_due",
]);
