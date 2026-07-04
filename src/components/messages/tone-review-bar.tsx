"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ToneLevel, ToneReviewResult } from "@/lib/ai/tone-review";
import { Button } from "@/components/ui/button";

const DEBOUNCE_MS = 1500;

const toneStyles: Record<ToneLevel, string> = {
  hostile: "text-destructive",
  tense: "text-amber-600 dark:text-amber-400",
  neutral: "text-muted-foreground",
  constructive: "text-emerald-600 dark:text-emerald-400",
};

export function ToneReviewBar({
  draft,
  threadId,
  locale,
  onApplyRewrite,
}: {
  draft: string;
  threadId: string;
  locale: string;
  onApplyRewrite: (rewrite: string, accepted: boolean) => void;
}) {
  const t = useTranslations("messages.toneReview");
  const [result, setResult] = useState<ToneReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastDraftRef = useRef("");

  useEffect(() => {
    const trimmed = draft.trim();
    if (trimmed.length < 3) {
      const resetTimer = window.setTimeout(() => {
        setResult(null);
        setError(null);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const timer = window.setTimeout(async () => {
      if (trimmed === lastDraftRef.current) return;
      lastDraftRef.current = trimmed;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/tone-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft: trimmed, thread_id: threadId, locale }),
        });
        const data = await res.json();
        if (!res.ok) {
          setResult(null);
          setError(data.error ?? t("error"));
          return;
        }
        setResult(data as ToneReviewResult);
      } catch {
        setResult(null);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [draft, threadId, locale, t]);

  if (draft.trim().length < 3) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-border bg-muted/40 px-4 py-2 text-sm">
      {loading && <p className="text-muted-foreground">{t("analyzing")}</p>}
      {error && !loading && <p className="text-muted-foreground">{error}</p>}
      {result && !loading && (
        <>
          <p>
            {t("toneLabel")}{" "}
            <span className={`font-medium capitalize ${toneStyles[result.tone]}`}>
              {t(`tone.${result.tone}`)}
            </span>
          </p>
          {result.flags.length > 0 && (
            <ul className="list-inside list-disc text-muted-foreground">
              {result.flags.map((flag) => (
                <li key={`${flag.phrase}-${flag.reason}`}>
                  <span className="font-medium text-foreground">{flag.phrase}</span>
                  {" — "}
                  {flag.reason}
                </li>
              ))}
            </ul>
          )}
          {result.rewrites.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">{t("suggestions")}</p>
              {result.rewrites.map((rewrite) => (
                <Button
                  key={rewrite}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal text-left"
                  onClick={() => {
                    onApplyRewrite(rewrite, true);
                    void fetch("/api/ai/rewrite-choice", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        thread_id: threadId,
                        draft: draft.trim(),
                        rewrite,
                        accepted: true,
                      }),
                    });
                  }}
                >
                  {rewrite}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
