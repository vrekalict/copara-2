"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { addChild } from "@/actions/children";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string; success?: boolean } | null;

export function ChildrenForm({ circleId }: { circleId: string }) {
  const t = useTranslations("onboarding");
  const formRef = useRef<HTMLFormElement>(null);
  const [addedNames, setAddedNames] = useState<string[]>([]);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = await addChild(formData);
      if (result?.success) {
        setAddedNames((names) => [...names, String(formData.get("firstName"))]);
        formRef.current?.reset();
      }
      return result ?? null;
    },
    null,
  );

  return (
    <div className="flex flex-col gap-4">
      {addedNames.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {addedNames.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="circleId" value={circleId} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">{t("firstName")}</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dob">{t("dob")}</Label>
          <Input id="dob" name="dob" type="date" />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" variant="outline" disabled={pending}>
          {t("addChild")}
        </Button>
      </form>
    </div>
  );
}
