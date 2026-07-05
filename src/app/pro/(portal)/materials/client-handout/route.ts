import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";
import { getClientHandoutCopy } from "@/lib/pro/client-handout-copy";
import { ClientHandoutDocument } from "@/lib/pro/client-handout-pdf";
import { referralQrDataUrl } from "@/lib/pro/referral-qr";
import { SITE } from "@/lib/marketing/site";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const circleId = searchParams.get("circleId")?.trim();
  if (!circleId) {
    return NextResponse.json({ error: "Case ID required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const access = await requireApprovedPartner(supabase, user.id, user.email);
  if (!access.ok) {
    return NextResponse.json({ error: "Partner access required." }, { status: 403 });
  }

  const { data: membership } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .eq("role", "professional")
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Case access required." }, { status: 403 });
  }

  const { data: circle } = await supabase
    .from("circles")
    .select("name")
    .eq("id", circleId)
    .maybeSingle();

  if (!circle) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  const base = SITE.url.replace(/\/$/, "");
  const inviteUrl = `${base}/join/case/${circleId}`;
  const locale = await getLocale();
  const copy = getClientHandoutCopy(locale, (circle.name as string) ?? "Case");
  const qrDataUrl = await referralQrDataUrl(inviteUrl);

  const buffer = await renderToBuffer(
    ClientHandoutDocument({ copy, inviteUrl, qrDataUrl }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="copara-client-handout.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
