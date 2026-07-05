import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getProCircles } from "@/actions/pro";
import { getProReferralDashboard } from "@/actions/pro/referrals";
import { ProReferralDashboard } from "@/components/pro/referral-dashboard";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function ProDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/pro");

  const t = await getTranslations("pro");
  const params = await searchParams;

  const referral = await getProReferralDashboard(user.id);
  const circles = await getProCircles(user.id);

  if (circles.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("setupSubtitle")}</p>
        </div>
        <ProReferralDashboard {...referral} />
        <ProSetupForm />
      </div>
    );
  }

  if (params.case) {
    redirect(`/pro/circles/${params.case}`);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Link href="/pro/setup" className={buttonVariants({ variant: "outline", size: "sm" })}>
          {t("newCase")}
        </Link>
      </div>

      <ProReferralDashboard {...referral} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Your cases</h2>
        <div className="flex flex-col gap-3">
          {circles.map((circle) => (
            <Link key={circle.circleId} href={`/pro/circles/${circle.circleId}`}>
              <Card className="p-4 transition-colors hover:bg-muted/50">
                <p className="font-medium">{circle.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(circle.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
