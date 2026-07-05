"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type VerifyResult = {
  export_id: string;
  kind: string;
  circle_name: string;
  created_at: string;
  stored_digest: string;
  recomputed_digest: string;
  record_count: number;
  verified: boolean;
  tamper_detected: boolean;
};

export function VerifyExportView({ exportId }: { exportId: string }) {
  const t = useTranslations("exports");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${exportId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Verification failed.");
        }
        return res.json() as Promise<VerifyResult>;
      })
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : "Error"))
      .finally(() => setLoading(false));
  }, [exportId]);

  if (loading) {
    return <p className="text-muted-foreground">{t("verifyLoading")}</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!result) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">{t("verifyTitle")}</h1>
        <Badge variant={result.verified ? "default" : "destructive"}>
          {result.verified ? t("verifyPass") : t("verifyFail")}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{t("verifyDisclaimer")}</p>

      <Card className="p-4 flex flex-col gap-2 text-sm">
        <p>
          <span className="font-medium">{t("exportId")}:</span> {result.export_id}
        </p>
        <p>
          <span className="font-medium">{t("circle")}:</span> {result.circle_name}
        </p>
        <p>
          <span className="font-medium">{t("kindLabel")}:</span> {result.kind}
        </p>
        <p>
          <span className="font-medium">{t("exportedAt")}:</span>{" "}
          {new Date(result.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">{t("recordCount")}:</span> {result.record_count}
        </p>
        <p className="break-all font-mono text-xs mt-2">
          {result.stored_digest}
        </p>
      </Card>

      {result.tamper_detected && (
        <p className="text-destructive text-sm">{t("tamperDetected")}</p>
      )}
    </div>
  );
}
