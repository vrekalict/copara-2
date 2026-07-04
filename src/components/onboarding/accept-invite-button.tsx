"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { acceptInvite } from "@/actions/invites";
import { Button } from "@/components/ui/button";

type ActionState = { error?: string } | null;

export function AcceptInviteButton({ inviteId }: { inviteId: string }) {
  const t = useTranslations("join");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async () => (await acceptInvite(inviteId)) ?? null,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {t("accept")}
      </Button>
    </form>
  );
}
