"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signInWithPassword, signInWithMagicLink } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string; sent?: boolean } | null;

export function SignInForm() {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"password" | "magic-link">("password");

  const [passwordState, passwordAction, passwordPending] = useActionState<
    ActionState,
    FormData
  >(async (_prev, formData) => (await signInWithPassword(formData)) ?? null, null);

  const [magicLinkState, magicLinkAction, magicLinkPending] = useActionState<
    ActionState,
    FormData
  >(async (_prev, formData) => (await signInWithMagicLink(formData)) ?? null, null);

  if (mode === "magic-link") {
    return (
      <div className="flex flex-col gap-4">
        {magicLinkState?.sent ? (
          <p className="text-sm text-muted-foreground">{t("magicLinkSent")}</p>
        ) : (
          <form action={magicLinkAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            {magicLinkState?.error && (
              <p className="text-sm text-destructive">{magicLinkState.error}</p>
            )}
            <Button type="submit" disabled={magicLinkPending}>
              {t("magicLinkSend")}
            </Button>
          </form>
        )}
        <Button variant="ghost" size="sm" onClick={() => setMode("password")}>
          {t("signInWithPassword")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={passwordAction} className="flex flex-col gap-4">
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
            autoComplete="current-password"
          />
        </div>
        {passwordState?.error && (
          <p className="text-sm text-destructive">{passwordState.error}</p>
        )}
        <Button type="submit" disabled={passwordPending}>
          {t("signIn")}
        </Button>
      </form>
      <Button variant="ghost" size="sm" onClick={() => setMode("magic-link")}>
        {t("magicLinkSend")}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline">
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
