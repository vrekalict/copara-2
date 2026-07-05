"use client";

import { useTranslations } from "next-intl";

export function TypingIndicator({
  typingUserIds,
  participantNames,
}: {
  typingUserIds: string[];
  participantNames: Record<string, string>;
}) {
  const t = useTranslations("messages");

  if (typingUserIds.length === 0) return null;

  const label =
    typingUserIds.length === 1
      ? (() => {
          const name = participantNames[typingUserIds[0]!];
          return name ? t("typing", { name }) : t("typingGeneric");
        })()
      : t("typingMultiple", { count: typingUserIds.length });

  return (
    <p
      className="px-4 pb-1 text-xs text-muted-foreground italic"
      role="status"
      aria-live="polite"
    >
      {label}
    </p>
  );
}
