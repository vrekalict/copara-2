"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/actions/locale";
import type { Locale } from "@/i18n/request";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === "en" ? "fr" : "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => setLocale(otherLocale))}
    >
      {otherLocale === "fr" ? "Français" : "English"}
    </Button>
  );
}
