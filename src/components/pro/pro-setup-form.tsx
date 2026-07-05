"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createProCase } from "@/actions/pro";
import { ProPortalCard } from "@/components/pro/pro-portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string } | null;

export function ProSetupForm() {
  const t = useTranslations("pro");
  const [state, action, pending] = useActionState<State, FormData>(
    async (_prev, formData) => createProCase(formData),
    null,
  );

  return (
    <ProPortalCard>
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="caseName">{t("caseName")}</Label>
          <Input
            id="caseName"
            name="caseName"
            required
            placeholder={t("caseNamePlaceholder")}
            className="min-h-11"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="parent1Email">{t("parent1Email")}</Label>
            <Input
              id="parent1Email"
              name="parent1Email"
              type="email"
              required
              autoComplete="email"
              className="min-h-11"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="parent2Email">{t("parent2Email")}</Label>
            <Input
              id="parent2Email"
              name="parent2Email"
              type="email"
              required
              autoComplete="email"
              className="min-h-11"
            />
          </div>
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full bg-[var(--marketing-navy)] hover:bg-[var(--marketing-navy-soft)] sm:w-auto sm:px-8"
        >
          {pending ? t("creating") : t("createCase")}
        </Button>
      </form>
    </ProPortalCard>
  );
}
