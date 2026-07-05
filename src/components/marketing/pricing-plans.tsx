"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PRICING } from "@/lib/marketing/site";
import type { PlanKey } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

function planHref(planKey: PlanKey) {
  return `/sign-up?plan=${planKey}`;
}

function PriceCard({
  name,
  price,
  period,
  description,
  features,
  highlight,
  cta,
  ctaHref,
}: {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-2 p-7",
        highlight
          ? "border-primary bg-background shadow-[0_12px_40px_-16px_oklch(0.546_0.245_262_/_0.35)] ring-2 ring-primary/15"
          : "border-[var(--marketing-border)] bg-background",
      )}
    >
      {highlight && (
        <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Best value
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-heading">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-5xl font-bold tracking-tight text-slate-heading">${price}</span>
        <span className="text-sm font-medium text-muted-foreground">CAD / {period}</span>
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={cn(
          buttonVariants({ variant: highlight ? "default" : "outline" }),
          "mt-8 min-h-11 w-full justify-center",
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

export function PricingPlans({ compact = false }: { compact?: boolean }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const parentPlan: PlanKey = billing === "monthly" ? "parent_monthly" : "parent_yearly";
  const familyPlan: PlanKey = billing === "monthly" ? "family_monthly" : "family_yearly";

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div
          className="inline-flex rounded-lg border border-[var(--marketing-border)] bg-background p-1"
          role="group"
          aria-label="Billing period"
        >
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              className={cn(
                "min-h-11 rounded-md px-5 text-sm font-medium capitalize transition-colors",
                billing === b
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={billing === b}
              onClick={() => setBilling(b)}
            >
              {b}
            </button>
          ))}
        </div>
        {billing === "yearly" && (
          <span className="text-sm text-primary">Save with yearly billing</span>
        )}
      </div>

      <div
        className={cn(
          "grid gap-6",
          compact ? "md:grid-cols-3" : "lg:grid-cols-3",
        )}
      >
        <PriceCard
          name={billing === "monthly" ? "Parent Monthly" : "Parent Yearly"}
          price={
            billing === "monthly"
              ? PRICING.parentMonthly.amount
              : PRICING.parentYearly.amount
          }
          period={billing === "monthly" ? "month" : "year"}
          description={
            billing === "monthly"
              ? "For one parent account · month-to-month"
              : `For one parent · works out to $${PRICING.parentYearly.monthlyEquivalent}/month`
          }
          features={[
            "14-day free trial",
            "Messaging with Steady Send",
            "Shared calendar & check-ins",
            "Expenses & reimbursements",
            "Info Vault & exports included",
            "English + French",
          ]}
          cta="Start free trial"
          ctaHref={planHref(parentPlan)}
        />
        <PriceCard
          name="Family Circle"
          price={
            billing === "monthly"
              ? PRICING.familyMonthly.amount
              : PRICING.familyYearly.amount
          }
          period={billing === "monthly" ? "month" : "year"}
          description={
            billing === "monthly"
              ? "Both parents, one subscription"
              : `Both parents · works out to $${PRICING.familyYearly.monthlyEquivalent}/month total`
          }
          features={[
            "14-day free trial",
            "Covers both parents in one circle",
            "All parent features included",
            "One shared subscription",
            "No per-export fees",
            "PWA on iOS, Android, and web",
          ]}
          highlight
          cta="Start free trial"
          ctaHref={planHref(familyPlan)}
        />
        <PriceCard
          name="Professional"
          price={0}
          period="partner program"
          description="For mediators, family lawyers, and parenting coordinators"
          features={[
            "Read-only circle access where permitted",
            "Dispute summaries with citations",
            "Organized record exports",
            "Referral bonuses for client signups",
            "Free partner dashboard",
          ]}
          cta="Apply as a partner"
          ctaHref="/professionals#apply"
        />
      </div>

      {!compact && (
        <ul className="mt-10 flex flex-col gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
          <li>14-day free trial on all paid plans</li>
          <li>Priced below many established co-parenting tools</li>
          <li>No app-store install required</li>
          <li>No per-export fees</li>
        </ul>
      )}
    </div>
  );
}
