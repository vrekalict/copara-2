"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { ExportKind } from "@/lib/exports/types";
import type { DisputeSummaryResult } from "@/lib/ai/summarize";
import { DisputeSummaryPanel } from "@/components/exports/dispute-summary-panel";

type ThreadOption = { id: string; title: string | null };
type ExportHistoryItem = {
  id: string;
  kind: string;
  chain_digest: string;
  created_at: string;
};

const EXPORT_KINDS: ExportKind[] = [
  "messages",
  "expenses",
  "schedule",
  "change_requests",
];

export function ExportWizard({
  circleId,
  threads,
  locale,
  initialHistory,
}: {
  circleId: string;
  threads: ThreadOption[];
  locale: string;
  initialHistory: ExportHistoryItem[];
}) {
  const t = useTranslations("exports");
  const [kind, setKind] = useState<ExportKind>("messages");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedThreads, setSelectedThreads] = useState<string[]>(
    threads.length === 1 ? [threads[0]!.id] : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState(initialHistory);
  const [lastExport, setLastExport] = useState<{
    verify_url: string;
    download_url: string | null;
  } | null>(null);

  const [summaryTopic, setSummaryTopic] = useState("");
  const [summary, setSummary] = useState<DisputeSummaryResult | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  function toggleThread(id: string) {
    setSelectedThreads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleExport() {
    setLoading(true);
    setError(null);
    setLastExport(null);

    try {
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: circleId,
          kind,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          thread_ids: kind === "messages" ? selectedThreads : undefined,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Export failed.");

      setLastExport({
        verify_url: body.verify_url,
        download_url: body.download_url,
      });
      setHistory((prev) => [
        {
          id: body.id,
          kind,
          chain_digest: body.chain_digest,
          created_at: body.created_at,
        },
        ...prev,
      ]);
      void trackEvent("export_created", { kind });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSummarize() {
    if (selectedThreads.length === 0) {
      setError(t("selectThread"));
      return;
    }

    setSummaryLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circle_id: circleId,
          thread_ids: selectedThreads,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          topic_filter: summaryTopic || undefined,
          locale,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Summary failed.");

      setSummary(body as DisputeSummaryResult);
      void trackEvent("summary_generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summary failed.");
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="kind">{t("exportType")}</Label>
          <select
            id="kind"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value as ExportKind)}
          >
            {EXPORT_KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`kind.${k}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateFrom">{t("dateFrom")}</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateTo">{t("dateTo")}</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {kind === "messages" && threads.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>{t("threads")}</Label>
            {threads.map((thread) => (
              <label key={thread.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedThreads.includes(thread.id)}
                  onChange={() => toggleThread(thread.id)}
                />
                {thread.title ?? t("untitledThread")}
              </label>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleExport} disabled={loading}>
          {loading ? t("generating") : t("generate")}
        </Button>

        {lastExport && (
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={lastExport.verify_url}
              className="text-primary underline"
              target="_blank"
              rel="noreferrer"
            >
              {t("verifyLink")}
            </a>
            {lastExport.download_url && (
              <a
                href={lastExport.download_url}
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                {t("downloadPdf")}
              </a>
            )}
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <div>
          <h2 className="font-medium">{t("summaryTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("summarySubtitle")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="topic">{t("topicFilter")}</Label>
          <Input
            id="topic"
            placeholder={t("topicPlaceholder")}
            value={summaryTopic}
            onChange={(e) => setSummaryTopic(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleSummarize}
          disabled={summaryLoading}
        >
          {summaryLoading ? t("summarizing") : t("summarize")}
        </Button>
        {summary && <DisputeSummaryPanel summary={summary} />}
      </Card>

      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">{t("history")}</h2>
          {history.map((item) => (
            <Card key={item.id} className="p-3 text-sm">
              <p className="font-medium">{t(`kind.${item.kind as ExportKind}`)}</p>
              <p className="text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
              </p>
              <a
                href={`/verify/${item.id}`}
                className="text-primary underline text-xs"
              >
                {t("verifyLink")}
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
