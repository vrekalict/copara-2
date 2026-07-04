"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createCircle } from "@/actions/circles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string } | null;

export function CircleForm() {
  const t = useTranslations("onboarding");
  const common = useTranslations("common");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await createCircle(formData)) ?? null,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t("circleNameLabel")}</Label>
        <Input id="name" name="name" required placeholder={t("circleNamePlaceholder")} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {common("continue")}
      </Button>
    </form>
  );
}
