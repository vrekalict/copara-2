"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, Share, Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { snoozeInstallPrompt } from "@/actions/settings";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIosSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
}

import { subscribeToPushNotifications } from "@/lib/push/subscribe-client";

export function InstallPrompt({
  engaged,
  snoozedUntil,
}: {
  engaged: boolean;
  snoozedUntil: string | null;
}) {
  const t = useTranslations("pwa");
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    if (isStandalone() || !engaged) return;

    if (snoozedUntil && new Date(snoozedUntil) > new Date()) return;

    if (isIosSafari()) {
      setIosMode(true);
      setVisible(true);
      void trackEvent("pwa_prompt_shown", { platform: "ios" });
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
      void trackEvent("pwa_prompt_shown", { platform: "chromium" });
    }

    function onInstalled() {
      void trackEvent("pwa_installed");
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [engaged, snoozedUntil]);

  const dismiss = useCallback(async () => {
    void trackEvent("pwa_prompt_dismissed");
    await snoozeInstallPrompt();
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        void trackEvent("pwa_prompt_accepted");
      } else {
        void trackEvent("pwa_prompt_dismissed");
        await snoozeInstallPrompt();
      }
      setDeferredPrompt(null);
      setVisible(false);
    }
  }, [deferredPrompt]);

  const enableNotifications = useCallback(async () => {
    await subscribeToPushNotifications();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 mx-auto max-w-lg px-4 pb-safe">
      <div className="rounded-xl border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{t("installTitle")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("installSubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground p-1"
            aria-label={t("dismiss")}
          >
            <X className="size-4" />
          </button>
        </div>

        {iosMode ? (
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <p className="flex items-center gap-2">
              <Share className="size-4" /> {t("iosStep1")}
            </p>
            <p className="flex items-center gap-2">
              <Download className="size-4" /> {t("iosStep2")}
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={enableNotifications}>
              {t("enableNotifications")}
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={install}>
              {t("install")}
            </Button>
            <Button size="sm" variant="outline" onClick={enableNotifications}>
              {t("enableNotifications")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
