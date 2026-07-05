"use client";

import { useTransition } from "react";
import Link from "next/link";
import { createBillingPortalSession } from "@/actions/stripe/checkout";
import type { AppAccess } from "@/lib/stripe/access";
import { PLAN_LABELS } from "@/lib/stripe/config";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BillingPanel({ access }: { access: AppAccess }) {
  const [pending, startTransition] = useTransition();

  if (!access.hasAccess || !access.subscription) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          You do not have an active subscription on this account.
        </p>
        <Link href="/pricing" className={cn(buttonVariants(), "mt-4 min-h-11 inline-flex")}>
          Choose a plan
        </Link>
      </Card>
    );
  }

  const sub = access.subscription;
  const statusLabel =
    sub.status === "trialing"
      ? "Free trial"
      : sub.status === "active"
        ? "Active"
        : sub.status;

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">Current plan</p>
        <p className="text-lg font-semibold">{PLAN_LABELS[sub.planKey]}</p>
      </div>
      <div className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium capitalize">{statusLabel}</span>
        </div>
        {sub.status === "trialing" && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Trial ends</span>
            <span>{formatDate(sub.trialEnd)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            {sub.cancelAtPeriodEnd ? "Access until" : "Renews on"}
          </span>
          <span>{formatDate(sub.currentPeriodEnd)}</span>
        </div>
        {access.reason === "family_circle" && !sub.isOwner && (
          <p className="rounded-lg bg-muted/60 p-3 text-muted-foreground">
            Your access is included through your circle&apos;s Family Circle subscription.
          </p>
        )}
      </div>
      {sub.isOwner && (
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await createBillingPortalSession();
            });
          }}
        >
          {pending ? "Opening portal…" : "Manage subscription"}
        </Button>
      )}
    </Card>
  );
}
