"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  checkPartnerReferralSlug,
  savePartnerProfile,
} from "@/actions/pro/referrals";
import { slugifyReferralSource } from "@/lib/pro/referral-slug";
import { SITE } from "@/lib/marketing/site";
import { ProPortalCard } from "@/components/pro/pro-portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SaveState = { error?: string; success?: boolean } | null;

function slugMatchesCompany(slug: string, company: string) {
  const normalizedSlug = slugifyReferralSource(slug);
  const normalizedCompany = slugifyReferralSource(company);
  return Boolean(normalizedSlug && normalizedSlug === normalizedCompany);
}

export function ProPartnerProfileCard({
  practiceName: initialPracticeName,
  payoutEmail: initialPayoutEmail,
  payoutEmailSuggested,
  referralSlug: initialSlug,
  referralUrl: initialReferralUrl,
  labels,
}: {
  practiceName: string;
  payoutEmail: string;
  payoutEmailSuggested: string;
  referralSlug: string;
  referralUrl: string;
  labels: {
    title: string;
    description: string;
    companyLabel: string;
    companyPlaceholder: string;
    companyHint: string;
    payoutEmailLabel: string;
    payoutEmailPlaceholder: string;
    payoutEmailHint: string;
    slugLabel: string;
    slugHint: string;
    previewLabel: string;
    save: string;
    saving: string;
    saved: string;
    copyLink: string;
    copied: string;
    available: string;
    unavailable: string;
    checking: string;
  };
}) {
  const router = useRouter();
  const [company, setCompany] = useState(initialPracticeName);
  const [payoutEmail, setPayoutEmail] = useState(
    initialPayoutEmail || payoutEmailSuggested || "",
  );
  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(
    Boolean(initialSlug) && !slugMatchesCompany(initialSlug, initialPracticeName),
  );
  const [copied, setCopied] = useState(false);
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "unavailable">(
    "idle",
  );
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [pendingCheck, startCheck] = useTransition();
  const [saveState, saveAction, saving] = useActionState<SaveState, FormData>(
    savePartnerProfile,
    null,
  );
  const initialSlugRef = useRef(initialSlug);

  const normalizedSlug = slugifyReferralSource(slug);
  const previewBase = SITE.url.replace(/\/$/, "");
  const previewUrl = normalizedSlug
    ? `${previewBase}/r/${encodeURIComponent(normalizedSlug)}`
    : initialReferralUrl;

  useEffect(() => {
    setCompany(initialPracticeName);
    setPayoutEmail(initialPayoutEmail || payoutEmailSuggested || "");
    setSlug(initialSlug);
    initialSlugRef.current = initialSlug;
    setSlugTouched(Boolean(initialSlug) && !slugMatchesCompany(initialSlug, initialPracticeName));
  }, [initialPracticeName, initialPayoutEmail, payoutEmailSuggested, initialSlug]);

  useEffect(() => {
    if (saveState?.success) {
      router.refresh();
    }
  }, [saveState?.success, router]);

  useEffect(() => {
    if (slugTouched) return;
    const suggested = slugifyReferralSource(company);
    if (suggested) setSlug(suggested);
  }, [company, slugTouched]);

  useEffect(() => {
    if (!normalizedSlug || normalizedSlug === initialSlugRef.current) {
      setAvailability("idle");
      setAvailabilityMessage(null);
      return;
    }

    setAvailability("checking");
    const timer = window.setTimeout(() => {
      startCheck(async () => {
        const result = await checkPartnerReferralSlug(normalizedSlug);
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
  }, [normalizedSlug, labels.available, labels.unavailable]);

  const companyChanged = company.trim() !== initialPracticeName.trim();
  const payoutEmailChanged =
    payoutEmail.trim().toLowerCase() !==
    (initialPayoutEmail || payoutEmailSuggested || "").trim().toLowerCase();
  const slugChanged = normalizedSlug !== initialSlugRef.current;
  const canSave =
    company.trim().length > 0 &&
    payoutEmail.trim().length > 0 &&
    Boolean(normalizedSlug) &&
    (companyChanged || payoutEmailChanged || slugChanged) &&
    availability !== "unavailable";

  async function copyLink() {
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ProPortalCard>
      <p className="text-sm font-semibold text-[var(--marketing-slate)]">{labels.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{labels.description}</p>

      <form action={saveAction} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-company">{labels.companyLabel}</Label>
          <Input
            id="partner-company"
            name="practiceName"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={labels.companyPlaceholder}
            autoComplete="organization"
            required
          />
          <p className="text-xs text-muted-foreground">{labels.companyHint}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner-payout-email">{labels.payoutEmailLabel}</Label>
          <Input
            id="partner-payout-email"
            name="payoutEmail"
            type="email"
            value={payoutEmail}
            onChange={(e) => setPayoutEmail(e.target.value)}
            placeholder={labels.payoutEmailPlaceholder}
            autoComplete="email"
            required
          />
          <p className="text-xs text-muted-foreground">{labels.payoutEmailHint}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="referral-slug">{labels.slugLabel}</Label>
          <div className="flex min-w-0 items-center rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/40 px-3">
            <span className="shrink-0 text-sm text-muted-foreground">/r/</span>
            <Input
              id="referral-slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              autoComplete="off"
              spellCheck={false}
            />
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
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="flex-1 break-all rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/50 px-3 py-2.5 text-xs">
              {previewUrl}
            </code>
            <Button
              type="button"
              variant="outline"
              onClick={copyLink}
              className="min-h-10 shrink-0"
              disabled={!normalizedSlug}
            >
              {copied ? labels.copied : labels.copyLink}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || pendingCheck || !canSave} className="min-h-11">
            {saving ? labels.saving : saveState?.success ? labels.saved : labels.save}
          </Button>
        </div>

        {saveState?.error && <p className="text-sm text-destructive">{saveState.error}</p>}
      </form>
    </ProPortalCard>
  );
}
