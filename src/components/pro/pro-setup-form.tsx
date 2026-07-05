"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createProCase } from "@/actions/pro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

type State = { error?: string } | null;

export function ProSetupForm() {
  const t = useTranslations("pro");
  const [state, action, pending] = useActionState<State, FormData>(
    async (_prev, formData) => createProCase(formData),
    null,
  );

  return (
    <Card className="flex flex-col gap-4 p-4">
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="caseName">{t("caseName")}</Label>
          <Input id="caseName" name="caseName" required placeholder={t("caseNamePlaceholder")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parent1Email">{t("parent1Email")}</Label>
          <Input id="parent1Email" name="parent1Email" type="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parent2Email">{t("parent2Email")}</Label>
          <Input id="parent2Email" name="parent2Email" type="email" required />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? t("creating") : t("createCase")}
        </Button>
      </form>
    </Card>
  );
}
