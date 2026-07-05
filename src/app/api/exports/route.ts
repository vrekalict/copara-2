import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { requireActiveCircleMember } from "@/lib/circles/membership";
import { computeChainDigest } from "@/lib/exports/chain";
import {
  buildStoredParams,
  fetchExportData,
} from "@/lib/exports/fetch-data";
import { ExportPdfDocument } from "@/lib/exports/generate-pdf";
import type { ExportKind } from "@/lib/exports/types";
import { BRAND } from "@/lib/brand";

const VALID_KINDS: ExportKind[] = [
  "messages",
  "expenses",
  "schedule",
  "change_requests",
];

type ExportRequest = {
  circle_id?: string;
  kind?: string;
  date_from?: string;
  date_to?: string;
  thread_ids?: string[];
};

export async function POST(request: Request) {
  let body: ExportRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const circleId = body.circle_id ?? "";
  const kind = body.kind as ExportKind;

  if (!circleId || !VALID_KINDS.includes(kind)) {
    return NextResponse.json(
      { error: "Missing circle_id or invalid kind." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const exportData = await fetchExportData(supabase, {
      circleId,
      kind,
      params: {
        date_from: body.date_from,
        date_to: body.date_to,
        thread_ids: body.thread_ids,
      },
    });

    if (exportData.chainRecords.length === 0) {
      return NextResponse.json(
        { error: "No records found for this export." },
        { status: 400 },
      );
    }

    const chainDigest = computeChainDigest(exportData.chainRecords);
    const exportId = crypto.randomUUID();
    const origin = new URL(request.url).origin;
    const verifyUrl = `${origin}/verify/${exportId}`;
    const exportedAt = new Date().toISOString();

    const { data: circle } = await supabase
      .from("circles")
      .select("name")
      .eq("id", circleId)
      .single();

    const { data: members } = await supabase
      .from("circle_members")
      .select("user_id, profiles(display_name)")
      .eq("circle_id", circleId)
      .eq("status", "active")
      .eq("role", "parent");

    const parties = (members ?? []).map((m) => {
      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      return (profile?.display_name as string) ?? "Parent";
    });

    const pdfBuffer = await renderToBuffer(
      ExportPdfDocument({
        meta: {
          exportId,
          circleName: (circle?.name as string) ?? BRAND.defaultCircleName,
          parties,
          kind,
          dateFrom: body.date_from,
          dateTo: body.date_to,
          exportedAt,
          chainDigest,
          verifyUrl,
        },
        data: exportData,
      }),
    );

    const storagePath = `${circleId}/${exportId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("exports")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const storedParams = buildStoredParams(exportData);
    storedParams.thread_ids = body.thread_ids;

    const { data: exportRow, error: insertError } = await supabase
      .from("exports")
      .insert({
        id: exportId,
        circle_id: circleId,
        requested_by: user.id,
        kind,
        params: storedParams,
        file_url: storagePath,
        chain_digest: chainDigest,
      })
      .select("id, chain_digest, created_at")
      .single();

    if (insertError || !exportRow) {
      return NextResponse.json(
        { error: insertError?.message ?? "Could not save export." },
        { status: 500 },
      );
    }

    const { data: signedUrl } = await supabase.storage
      .from("exports")
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({
      id: exportRow.id,
      chain_digest: exportRow.chain_digest,
      created_at: exportRow.created_at,
      verify_url: verifyUrl,
      download_url: signedUrl?.signedUrl ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const circleId = searchParams.get("circle_id") ?? "";

  if (!circleId) {
    return NextResponse.json({ error: "Missing circle_id." }, { status: 400 });
  }

  const membership = await requireActiveCircleMember(supabase, user.id, circleId);
  if (!membership.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: exports, error } = await supabase
    .from("exports")
    .select("id, kind, chain_digest, created_at, file_url")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exports: exports ?? [] });
}
