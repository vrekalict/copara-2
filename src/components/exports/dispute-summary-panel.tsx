"use client";

import { useTranslations } from "next-intl";
import type { DisputeSummaryResult } from "@/lib/ai/summarize";
import { Card } from "@/components/ui/card";

export function DisputeSummaryPanel({
  summary,
}: {
  summary: DisputeSummaryResult;
}) {
  const t = useTranslations("exports.summary");

  return (
    <div className="flex flex-col gap-3 text-sm">
      <section>
        <h3 className="font-medium mb-2">{t("timeline")}</h3>
        {summary.timeline.map((entry, i) => (
          <Card key={i} className="p-3 mb-2">
            <p className="text-xs text-muted-foreground">{entry.at}</p>
            <p>{entry.summary}</p>
            {entry.message_ids.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("citations")}: {entry.message_ids.join(", ")}
              </p>
            )}
          </Card>
        ))}
      </section>

      <section>
        <h3 className="font-medium mb-2">{t("positions")}</h3>
        {summary.positions.map((p, i) => (
          <Card key={i} className="p-3 mb-2">
            <p className="font-medium">{p.party}</p>
            <p>{p.position}</p>
          </Card>
        ))}
      </section>

      {summary.unresolved.length > 0 && (
        <section>
          <h3 className="font-medium mb-2">{t("unresolved")}</h3>
          <ul className="list-disc pl-5 gap-1">
            {summary.unresolved.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted-foreground italic">{summary.disclaimer}</p>
    </div>
  );
}
