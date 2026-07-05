"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpPartnerWithPassword } from "@/actions/pro/partner";
import { LegalAcceptanceFields } from "@/components/legal/legal-acceptance-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROVINCES } from "@/lib/marketing/site";
import { useState } from "react";

type ActionState = { error?: string; confirmEmail?: boolean } | null;

export function PartnerSignUpForm({
  token,
  email,
  province: defaultProvince,
}: {
  token: string;
  email: string;
  province?: string;
}) {
  const [province, setProvince] = useState(defaultProvince ?? "");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await signUpPartnerWithPassword(formData)) ?? null,
    null,
  );

  if (state?.confirmEmail) {
    return (
      <p className="text-sm text-muted-foreground">
        Check your email to confirm your account, then return to activate your partner dashboard.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={email} readOnly required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="province">Province / territory</Label>
        <select
          id="province"
          name="province"
          required
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="min-h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Select…</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      {province && <LegalAcceptanceFields province={province} idPrefix="partner-signup" compact />}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending || !province}>
        {pending ? "Creating account…" : "Create partner account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have a Copara account with this email?{" "}
        <Link
          href={`/pro/activate?token=${encodeURIComponent(token)}&sign-in=1`}
          className="font-medium underline"
        >
          Sign in instead
        </Link>
      </p>
    </form>
  );
}
