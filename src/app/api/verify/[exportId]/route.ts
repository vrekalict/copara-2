import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { computeChainDigest, verifyChainDigest } from "@/lib/exports/chain";
import { fetchLiveChainRecords } from "@/lib/exports/fetch-data";
import type { ExportKind, ExportParams } from "@/lib/exports/types";
import { BRAND } from "@/lib/brand";

export async function GET(
  _request: Request,
  context: { params: Promise<{ exportId: string }> },
) {
  const { exportId } = await context.params;
  const service = createServiceClient();

  const { data: exportRow, error } = await service
    .from("exports")
    .select("id, kind, params, chain_digest, created_at, circle_id, circles(name)")
    .eq("id", exportId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!exportRow) {
    return NextResponse.json({ error: "Export not found." }, { status: 404 });
  }

  const params = exportRow.params as ExportParams;
  const kind = exportRow.kind as ExportKind;
  const storedIds = params.message_ids ?? [];
  const storedHashes = params.message_hashes ?? [];

  const storedRecords = storedIds.map((id, i) => ({
    id,
    hash: storedHashes[i] ?? "",
  }));

  const liveRecords =
    storedIds.length > 0
      ? await fetchLiveChainRecords(service, kind, storedIds)
      : [];

  const hashMatch =
    storedIds.length > 0 &&
    storedIds.every((id, i) => {
      const live = liveRecords.find((r) => r.id === id);
      return live?.hash === storedHashes[i];
    });

  const digestMatch = verifyChainDigest(storedRecords, exportRow.chain_digest as string);

  const liveDigestMatch =
    liveRecords.length > 0 &&
    liveRecords.every((r) => r.hash !== "__missing__") &&
    verifyChainDigest(liveRecords, exportRow.chain_digest as string);

  const verified = digestMatch && hashMatch && liveDigestMatch;

  const recomputedDigest =
    liveRecords.length > 0 && liveRecords.every((r) => r.hash !== "__missing__")
      ? computeChainDigest(liveRecords)
      : null;

  const circles = exportRow.circles as { name: string } | { name: string }[] | null;
  const circle = Array.isArray(circles) ? circles[0] : circles;

  return NextResponse.json({
    export_id: exportRow.id,
    kind: exportRow.kind,
    circle_name: circle?.name ?? BRAND.defaultCircleName,
    created_at: exportRow.created_at,
    stored_digest: exportRow.chain_digest,
    recomputed_digest: recomputedDigest,
    record_count: storedIds.length,
    verified,
    tamper_detected: !verified,
  });
}
