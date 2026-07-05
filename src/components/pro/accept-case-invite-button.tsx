"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { acceptCaseInvite } from "@/actions/case-invite";
import { Button } from "@/components/ui/button";

export function AcceptCaseInviteButton({ circleId }: { circleId: string }) {
  const t = useTranslations("pro");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <Button
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await acceptCaseInvite(circleId);
            if (result?.error) setError(result.error);
          });
        }}
      >
        {pending ? t("accepting") : t("acceptCase")}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
