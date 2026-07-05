"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export function HashBadge({
  index,
  hash,
}: {
  index: number;
  hash: string;
}) {
  const t = useTranslations("messages");

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
      title={hash}
    >
      <ShieldCheck className="size-3" aria-hidden />
      {t("hashVerified", { number: index + 1 })}
    </span>
  );
}
