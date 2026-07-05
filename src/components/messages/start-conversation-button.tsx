"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createThread } from "@/actions/messages";
import { Button } from "@/components/ui/button";

type ActionState = { error?: string } | null;

export function StartConversationButton({ circleId }: { circleId: string }) {
  const t = useTranslations("messages");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await createThread(formData)) ?? null,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="circleId" value={circleId} />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {t("start")}
      </Button>
    </form>
  );
}
