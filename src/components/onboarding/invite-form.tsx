"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { inviteCoParent } from "@/actions/circles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string } | null;

export function InviteForm({ circleId }: { circleId: string }) {
  const t = useTranslations("onboarding");
  const auth = useTranslations("auth");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await inviteCoParent(formData)) ?? null,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="circleId" value={circleId} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{auth("email")}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {t("inviteSend")}
      </Button>
      <Link
        href={`/onboarding/children?circle=${circleId}`}
        className="text-center text-sm text-muted-foreground underline"
      >
        {t("skip")}
      </Link>
    </form>
  );
}
