"use client";

import { useTransition } from "react";
import { createCheckoutSession } from "@/actions/stripe/checkout";
import { Button } from "@/components/ui/button";

export function SubscribeCheckout({
  planKey,
  referralCode,
}: {
  planKey: string;
  referralCode?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="min-h-11 w-full"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await createCheckoutSession(planKey, referralCode);
        });
      }}
    >
      {pending ? "Redirecting to checkout…" : "Continue to secure checkout"}
    </Button>
  );
}
