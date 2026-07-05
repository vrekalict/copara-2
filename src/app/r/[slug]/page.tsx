import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { findProfessionalByReferralRef } from "@/lib/pro/referrals";

export default async function PartnerReferralRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = slug.trim().toLowerCase();
  const service = createServiceClient();
  const professional = await findProfessionalByReferralRef(service, normalized);

  if (!professional) {
    redirect("/sign-up");
  }

  redirect(`/sign-up?ref=${encodeURIComponent(professional.referralSlug)}`);
}
