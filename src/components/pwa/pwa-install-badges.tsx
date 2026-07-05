"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";
import {
  type BeforeInstallPromptEvent,
  isAndroid,
  isIosSafari,
  isStandalone,
} from "@/lib/pwa/platform";
import { cn } from "@/lib/utils";

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.6 9.5l1.4-2.4a.6.6 0 00-1-.6l-1.5 2.6a7.2 7.2 0 00-4.9-1.9 7.2 7.2 0 00-4.9 1.9L5.1 6.5a.6.6 0 00-1 .6L5.5 9.5A6.8 6.8 0 002 15.1v1.8a1.5 1.5 0 001.5 1.5h1.1v-5.9a1.8 1.8 0 013.6 0v5.9h4.6v-5.9a1.8 1.8 0 013.6 0v5.9h1.1A1.5 1.5 0 0022 16.9v-1.8a6.8 6.8 0 00-3.5-5.6zM8.2 6.3a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zm7.6 0a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M16.7 12.7c0-2.2 1.8-3.3 1.9-3.4-1-.1-2-.6-2.6-1.4-.6-.8-1-1.9-.8-3 1-.1 2 .6 2.5 1.5.5.9.4 2.1-.1 3.1-.8 1.4-2.2 2.4-3.5 2.3-.1-1 .4-2 .9-2.6.5-.6 1.4-1.2 1.6-1.5zm-1.5 8.8c-1.1 0-2.1-.7-2.9-.7-.8 0-1.9.6-3 .6-1.5 0-2.9-1.4-4-3.1-2.2-3.4-1.9-8.5.5-11.3 1.2-1.3 2.8-2.1 4.4-2.1 1 0 2.3.7 3 .7.7 0 2-.8 3.3-.7 1.1 0 2.2.6 3 1.6-2.6 1.5-2.2 5.5.4 6.8-.5 1.3-1.2 2.6-2.1 3.7-.8 1-1.7 2.1-2.9 2.1z" />
    </svg>
  );
}

function InstallBadge({
  platform,
  onClick,
  disabled,
}: {
  platform: "android" | "ios";
  onClick: () => void;
  disabled?: boolean;
}) {
  const isAndroidBadge = platform === "android";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isAndroidBadge ? "Install Copara on Android" : "Install Copara on iPhone"}
      className={cn(
        "inline-flex min-h-11 min-w-[10.5rem] items-center gap-2.5 rounded-lg border border-white/15 bg-black px-3.5 py-2 text-left text-white transition-colors",
        "hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {isAndroidBadge ? (
        <AndroidIcon className="size-7 shrink-0" />
      ) : (
        <AppleIcon className="size-7 shrink-0" />
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/75">
          {isAndroidBadge ? "Install on" : "Install on"}
        </span>
        <span className="text-sm font-semibold">
          {isAndroidBadge ? "Android" : "iPhone"}
        </span>
      </span>
    </button>
  );
}

function InstallHelpDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-help-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-background p-5 text-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="pwa-install-help-title" className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function PwaInstallBadges({ className }: { className?: string }) {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [help, setHelp] = useState<"ios" | "android" | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    function onAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
      void trackEvent("pwa_installed");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const installAndroid = useCallback(async () => {
    void trackEvent("pwa_badge_click", { platform: "android" });

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        void trackEvent("pwa_prompt_accepted", { source: "marketing_badge" });
      }
      setDeferredPrompt(null);
      return;
    }

    setHelp("android");
  }, [deferredPrompt]);

  const installIos = useCallback(() => {
    void trackEvent("pwa_badge_click", { platform: "ios" });
    setHelp("ios");
  }, []);

  if (installed) {
    return (
      <p className={cn("text-sm text-white/65", className)}>
        Copara is installed on this device.
      </p>
    );
  }

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        <p className="text-sm text-white/65">
          Available on the web, iOS, and Android — no app store required.
        </p>
        <div className="flex flex-wrap gap-3">
          <InstallBadge platform="android" onClick={installAndroid} />
          <InstallBadge platform="ios" onClick={installIos} />
        </div>
      </div>

      {help === "ios" && (
        <InstallHelpDialog title={t("installTitle")} onClose={() => setHelp(null)}>
          <p className="text-muted-foreground">{t("installSubtitle")}</p>
          <ol className="mt-4 space-y-3">
            <li className="flex items-start gap-3 text-foreground">
              <Share className="mt-0.5 size-5 shrink-0 text-[var(--marketing-teal)]" aria-hidden />
              <span className="font-medium">{t("iosStep1")}</span>
            </li>
            <li className="flex items-start gap-3 text-foreground">
              <Download className="mt-0.5 size-5 shrink-0 text-[var(--marketing-teal)]" aria-hidden />
              <span className="font-medium">{t("iosStep2")}</span>
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            {isIosSafari()
              ? "Follow the steps above in Safari."
              : "Open copara.ca in Safari on your iPhone or iPad to install."}
          </p>
        </InstallHelpDialog>
      )}

      {help === "android" && (
        <InstallHelpDialog title={t("installTitle")} onClose={() => setHelp(null)}>
          <p className="text-muted-foreground">{t("installSubtitle")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground">
            {isAndroid() ? (
              <>
                <li>Open this site in Chrome.</li>
                <li>Tap the menu, then Install app or Add to Home screen.</li>
                <li>
                  If no prompt appears yet, sign in and use the app once — Chrome will offer
                  install after that.
                </li>
              </>
            ) : (
              <>
                <li>Open copara.ca in Chrome on your Android phone.</li>
                <li>Tap Install app when Chrome offers it, or use the menu → Install app.</li>
              </>
            )}
          </ul>
        </InstallHelpDialog>
      )}
    </>
  );
}
