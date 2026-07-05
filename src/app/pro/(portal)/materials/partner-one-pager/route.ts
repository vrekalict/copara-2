import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";
import { getPartnerOnePagerCopy } from "@/lib/pro/partner-one-pager-copy";
import { PartnerOnePagerDocument } from "@/lib/pro/partner-one-pager-pdf";

export const runtime = "nodejs";

export async function GET() {
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

  const locale = await getLocale();
  const copy = getPartnerOnePagerCopy(locale);
  const buffer = await renderToBuffer(PartnerOnePagerDocument({ copy }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="copara-partner-one-pager.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
