"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkPartnerReferralSlug, savePartnerReferralSlug } from "@/actions/pro/referrals";
import { slugifyReferralSource } from "@/lib/pro/referral-slug";
import { SITE } from "@/lib/marketing/site";
import { ProPortalCard } from "@/components/pro/pro-portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SaveState = { error?: string; success?: boolean } | null;

export function ProReferralSlugEditor({
  currentSlug,
  labels,
}: {
  currentSlug: string;
  labels: {
    title: string;
    description: string;
    slugLabel: string;
    slugHint: string;
    previewLabel: string;
    save: string;
    saving: string;
    saved: string;
    available: string;
    unavailable: string;
    checking: string;
  };
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(currentSlug);
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "unavailable">(
    "idle",
  );
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [pendingCheck, startCheck] = useTransition();
  const [saveState, saveAction, saving] = useActionState<SaveState, FormData>(
    savePartnerReferralSlug,
    null,
  );

  const normalized = slugifyReferralSource(slug);
  const previewBase = SITE.url.replace(/\/$/, "");
  const previewUrl = normalized ? `${previewBase}/r/${normalized}` : `${previewBase}/r/…`;

  useEffect(() => {
    setSlug(currentSlug);
  }, [currentSlug]);

  useEffect(() => {
    if (saveState?.success) {
      router.refresh();
    }
  }, [saveState?.success, router]);

  useEffect(() => {
    if (!normalized || normalized === currentSlug) {
      setAvailability("idle");
      setAvailabilityMessage(null);
      return;
    }

    setAvailability("checking");
    const timer = window.setTimeout(() => {
      startCheck(async () => {
        const result = await checkPartnerReferralSlug(normalized);
        if (result.available) {
          setAvailability("available");
          setAvailabilityMessage(labels.available);
        } else {
          setAvailability("unavailable");
          setAvailabilityMessage(result.error ?? labels.unavailable);
        }
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [normalized, currentSlug, labels.available, labels.unavailable]);

  return (
    <ProPortalCard>
      <p className="text-sm font-semibold text-[var(--marketing-slate)]">{labels.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{labels.description}</p>

      <form action={saveAction} className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="referral-slug">{labels.slugLabel}</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/40 px-3">
              <span className="shrink-0 text-sm text-muted-foreground">/r/</span>
              <Input
                id="referral-slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <Button
              type="submit"
              disabled={
                saving ||
                pendingCheck ||
                !normalized ||
                normalized === currentSlug ||
                availability === "unavailable"
              }
              className="min-h-11 shrink-0"
            >
              {saving ? labels.saving : saveState?.success ? labels.saved : labels.save}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{labels.slugHint}</p>
          {availability === "checking" || pendingCheck ? (
            <p className="text-xs text-muted-foreground">{labels.checking}</p>
          ) : availabilityMessage ? (
            <p
              className={
                availability === "available"
                  ? "text-xs text-emerald-700"
                  : availability === "unavailable"
                    ? "text-xs text-destructive"
                    : "text-xs text-muted-foreground"
              }
            >
              {availabilityMessage}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-medium text-[var(--marketing-slate)]">{labels.previewLabel}</p>
          <code className="mt-1 block break-all text-xs text-muted-foreground">{previewUrl}</code>
        </div>

        {saveState?.error && <p className="text-sm text-destructive">{saveState.error}</p>}
      </form>
    </ProPortalCard>
  );
}
