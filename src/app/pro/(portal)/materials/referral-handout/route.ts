import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";
import { getReferralHandoutCopy } from "@/lib/pro/referral-handout-copy";
import { ReferralHandoutDocument } from "@/lib/pro/referral-handout-pdf";
import { referralQrDataUrl } from "@/lib/pro/referral-qr";
import { getReferralSlugForUser, buildReferralUrl } from "@/lib/pro/referrals";
import { SITE } from "@/lib/marketing/site";

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

  let referralUrl: string;
  try {
    const code = await getReferralSlugForUser(supabase, user.id);
    referralUrl = buildReferralUrl(SITE.url, code);
  } catch {
    return NextResponse.json({ error: "Could not load referral link." }, { status: 500 });
  }

  const locale = await getLocale();
  const copy = getReferralHandoutCopy(locale);
  const qrDataUrl = await referralQrDataUrl(referralUrl);

  const buffer = await renderToBuffer(
    ReferralHandoutDocument({ copy, referralUrl, qrDataUrl }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="copara-referral-handout.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
