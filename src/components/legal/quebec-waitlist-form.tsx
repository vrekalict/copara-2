"use client";

import { useActionState } from "react";
import { submitQuebecWaitlist } from "@/actions/legal/acceptance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuebecWaitlistForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, action, pending] = useActionState(submitQuebecWaitlist, null);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="font-semibold">You&apos;re on the list.</p>
        <p className="mt-2 text-sm leading-relaxed">
          We&apos;ll email you when Quebec paid access opens and French legal
          documents are published.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="province" value="Quebec" />
      <div className="flex flex-col gap-2">
        <Label htmlFor="quebec-waitlist-email">Email</Label>
        <Input
          id="quebec-waitlist-email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          autoComplete="email"
          className="min-h-11"
          placeholder="you@example.com"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="min-h-11 w-full sm:w-auto">
        {pending ? "Joining…" : "Join Quebec waitlist"}
      </Button>
    </form>
  );
}
