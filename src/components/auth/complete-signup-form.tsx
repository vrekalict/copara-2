"use client";

import { useActionState, useState } from "react";
import { completeSignupLegal } from "@/actions/auth/complete-signup";
import { LegalAcceptanceFields } from "@/components/legal/legal-acceptance-fields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PROVINCES } from "@/lib/marketing/site";

type ActionState = { error?: string } | null;

export function CompleteSignupForm({
  next,
  plan,
  ref,
}: {
  next?: string;
  plan?: string;
  ref?: string;
}) {
  const [province, setProvince] = useState("");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await completeSignupLegal(formData)) ?? null,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {plan && <input type="hidden" name="plan" value={plan} />}
      {ref && <input type="hidden" name="ref" value={ref} />}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="province">Province / territory</Label>
        <select
          id="province"
          name="province"
          required
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="min-h-11 rounded-lg border border-input bg-card px-3 text-sm shadow-sm"
        >
          <option value="">Select…</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {province && (
        <LegalAcceptanceFields province={province} idPrefix="complete-signup" compact />
      )}

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending || !province} className="min-h-11 w-full">
        {pending ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
