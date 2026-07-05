"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PRICING } from "@/lib/marketing/site";
import type { PlanKey } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

function subscribeHref(planKey: PlanKey, ref?: string) {
  const params = new URLSearchParams({ plan: planKey });
  if (ref) params.set("ref", ref);
  return `/subscribe?${params.toString()}`;
}

export function SubscribePlanPicker({ referralCode }: { referralCode?: string }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const parentPlan: PlanKey = billing === "monthly" ? "parent_monthly" : "parent_yearly";
  const familyPlan: PlanKey = billing === "monthly" ? "family_monthly" : "family_yearly";

  const plans = [
    {
      key: parentPlan,
      name: billing === "monthly" ? "Parent Monthly" : "Parent Yearly",
      price: billing === "monthly" ? PRICING.parentMonthly.amount : PRICING.parentYearly.amount,
      period: billing === "monthly" ? "month" : "year",
      description:
        billing === "monthly"
          ? "For one parent account"
          : `$${PRICING.parentYearly.monthlyEquivalent}/month billed yearly`,
      highlight: false,
    },
    {
      key: familyPlan,
      name: "Family Circle",
      price: billing === "monthly" ? PRICING.familyMonthly.amount : PRICING.familyYearly.amount,
      period: billing === "monthly" ? "month" : "year",
      description:
        billing === "monthly"
          ? "Both parents, one subscription"
          : `$${PRICING.familyYearly.monthlyEquivalent}/month billed yearly`,
      highlight: true,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <div
        className="inline-flex w-full rounded-lg border border-[var(--marketing-border)] bg-muted/30 p-1"
        role="group"
        aria-label="Billing period"
      >
        {(["monthly", "yearly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "min-h-10 flex-1 rounded-md px-3 text-sm font-medium capitalize transition-colors",
              billing === option
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={billing === option}
            onClick={() => setBilling(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {plans.map((plan) => (
          <li key={plan.key}>
            <Link
              href={subscribeHref(plan.key, referralCode)}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40",
                plan.highlight
                  ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10"
                  : "border-[var(--marketing-border)] bg-card",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--marketing-slate)]">{plan.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-xl font-bold text-[var(--marketing-slate)]">${plan.price}</span>
                  <span className="block text-xs text-muted-foreground">CAD / {plan.period}</span>
                </p>
              </div>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-3.5 text-primary" aria-hidden />
                14-day free trial · cancel anytime
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
