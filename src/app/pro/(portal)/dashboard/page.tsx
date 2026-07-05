import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProCircles } from "@/actions/pro";
import { getProReferralDashboard } from "@/actions/pro/referrals";
import { ProCaseList } from "@/components/pro/pro-case-list";
import { ProGettingStarted } from "@/components/pro/pro-getting-started";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { ProPortalShell, ProSectionHeading } from "@/components/pro/pro-portal-shell";
import { ProReferralDashboard } from "@/components/pro/referral-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  if (params.case) {
    redirect(`/pro/circles/${params.case}`);
  }

  const referral = await getProReferralDashboard(user.id);
  const circles = await getProCircles(user.id);
  const isEmpty = circles.length === 0;

  return (
    <ProPortalShell
      eyebrow="Partner program"
      title={t("title")}
      description={isEmpty ? t("setupSubtitle") : t("dashboardSubtitle")}
      actions={
        !isEmpty ? (
          <Link
            href="/pro/setup"
            className={cn(buttonVariants(), "min-h-11 gap-2 bg-[var(--marketing-navy)] hover:bg-[var(--marketing-navy-soft)]")}
          >
            <Plus className="size-4" aria-hidden />
            {t("newCase")}
          </Link>
        ) : undefined
      }
      maxWidth="4xl"
    >
      {isEmpty ? (
        <div className="flex flex-col gap-8">
          <ProGettingStarted
            title={t("gettingStarted")}
            steps={[
              { title: t("step1Title"), body: t("step1Body") },
              { title: t("step2Title"), body: t("step2Body") },
              { title: t("step3Title"), body: t("step3Body") },
            ]}
          />
          <div>
            <ProSectionHeading title={t("createFirstCase")} description={t("createFirstCaseHint")} />
            <ProSetupForm />
          </div>
          <div>
            <ProSectionHeading title={t("referralProgram")} description={t("referralProgramHint")} />
            <ProReferralDashboard {...referral} compact />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <section>
            <ProSectionHeading
              title={t("yourCases")}
              description={t("yourCasesHint")}
            />
            <ProCaseList
              cases={circles}
              newCaseLabel={t("newCase")}
              emptyHint={t("noCasesHint")}
            />
          </section>

          <section>
            <ProSectionHeading
              title={t("referralProgram")}
              description={t("referralProgramHint")}
            />
            <ProReferralDashboard {...referral} />
          </section>
        </div>
      )}
    </ProPortalShell>
  );
}
