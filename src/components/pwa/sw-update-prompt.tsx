"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSerwist } from "@serwist/turbopack/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SwUpdatePrompt() {
  const t = useTranslations("pwa");
  const { serwist } = useSerwist();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!serwist) return;

    const onWaiting = () => setVisible(true);

    serwist.addEventListener("waiting", onWaiting);

    return () => {
      serwist.removeEventListener("waiting", onWaiting);
    };
  }, [serwist]);

  const refresh = useCallback(() => {
    if (!serwist) return;

    const onControlling = () => {
      serwist.removeEventListener("controlling", onControlling);
      window.location.reload();
    };

    serwist.addEventListener("controlling", onControlling);
    void serwist.messageSkipWaiting();
  }, [serwist]);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b bg-background px-4 py-3 shadow-md pb-safe">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <p className="text-sm font-medium">{t("updateTitle")}</p>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={refresh}>
            {t("updateRefresh")}
          </Button>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground p-1"
            aria-label={t("updateDismiss")}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
