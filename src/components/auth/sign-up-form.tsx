"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signUpWithPassword } from "@/actions/auth";
import { LegalAcceptanceFields } from "@/components/legal/legal-acceptance-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROVINCES } from "@/lib/marketing/site";

type ActionState = { error?: string; confirmEmail?: boolean } | null;

export function SignUpForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const [province, setProvince] = useState("");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await signUpWithPassword(formData)) ?? null,
    null,
  );

  if (state?.confirmEmail) {
    return <p className="text-sm text-muted-foreground">{t("confirmEmailSent")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t("password")}</Label>
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

        {province && (
          <LegalAcceptanceFields province={province} idPrefix="signup" compact />
        )}

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending || !province}>
          {t("signUp")}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link
          href={next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in"}
          className="font-medium text-foreground underline"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
