import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProCircles } from "@/actions/pro";
import { getProReferralDashboard } from "@/actions/pro/referrals";
import { ProCaseList } from "@/components/pro/pro-case-list";
import { ProGuideCollapsible } from "@/components/pro/pro-guide-collapsible";
import { ProPartnerGuide } from "@/components/pro/pro-partner-guide";
import { ProPortalCard, ProPortalShell, ProSectionHeading } from "@/components/pro/pro-portal-shell";
import { ProReferralDashboard } from "@/components/pro/referral-dashboard";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";
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

  const guideContent = {
    gettingStartedTitle: t("gettingStarted"),
    steps: [
      { title: t("step1Title"), body: t("step1Body") },
      { title: t("step2Title"), body: t("step2Body") },
      { title: t("step3Title"), body: t("step3Body") },
      { title: t("step4Title"), body: t("step4Body", { trialDays: STRIPE_TRIAL_DAYS }) },
    ],
    linkComparisonTitle: t("linkComparisonTitle"),
    caseInvite: {
      title: t("caseInviteToolTitle"),
      when: t("caseInviteToolWhen"),
      points: [t("caseInviteToolPoint1"), t("caseInviteToolPoint2"), t("caseInviteToolPoint3")],
    },
    referralLink: {
      title: t("referralLinkToolTitle"),
      when: t("referralLinkToolWhen"),
      points: [
        t("referralLinkToolPoint1"),
        t("referralLinkToolPoint2"),
        t("referralLinkToolPoint3"),
      ],
    },
    billingTitle: t("billingTitle"),
    billingBody: t("billingBody", { trialDays: STRIPE_TRIAL_DAYS }),
    accessTitle: t("accessTitle"),
    accessBody: t("accessBody"),
    memberStatusTitle: t("memberStatusTitle"),
    statusInvited: t("statusInvited"),
    statusActive: t("statusActive"),
    statusProfessional: t("statusProfessional"),
    benefitsTitle: t("benefitsTitle"),
    benefits: [
      { title: t("benefitReadOnlyTitle"), description: t("benefitReadOnlyBody"), icon: "eye" },
      { title: t("benefitFollowUpTitle"), description: t("benefitFollowUpBody"), icon: "users" },
      { title: t("benefitMaterialsTitle"), description: t("benefitMaterialsBody"), icon: "file" },
      { title: t("benefitReferralTitle"), description: t("benefitReferralBody"), icon: "gift" },
    ],
  };

  return (
    <ProPortalShell
      eyebrow="Partner program"
      title={t("title")}
      description={isEmpty ? t("setupSubtitle") : t("dashboardSubtitle")}
      actions={
        <Link
          href="/pro/setup"
          className={cn(buttonVariants(), "min-h-11 gap-2 bg-[var(--marketing-navy)] hover:bg-[var(--marketing-navy-soft)]")}
        >
          <Plus className="size-4" aria-hidden />
          {t("newCase")}
        </Link>
      }
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-10">
        <ProGuideCollapsible title={t("guideTitle")} defaultOpen={isEmpty}>
          <ProPartnerGuide content={guideContent} />
        </ProGuideCollapsible>

        {isEmpty ? (
          <ProPortalCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[var(--marketing-slate)]">{t("createFirstCase")}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("createFirstCaseHint")}</p>
            </div>
            <Link
              href="/pro/setup"
              className={cn(
                buttonVariants(),
                "min-h-11 shrink-0 bg-[var(--marketing-navy)] hover:bg-[var(--marketing-navy-soft)]",
              )}
            >
              {t("newCase")}
            </Link>
          </ProPortalCard>
        ) : (
          <section>
            <ProSectionHeading title={t("yourCases")} description={t("yourCasesHint")} />
            <ProCaseList
              cases={circles}
              newCaseLabel={t("newCase")}
              emptyHint={t("noCasesHint")}
            />
          </section>
        )}

        <section>
          <ProSectionHeading title={t("referralProgram")} description={t("referralProgramHint")} />
          <ProReferralDashboard {...referral} compact={isEmpty} />
        </section>
      </div>
    </ProPortalShell>
  );
}
