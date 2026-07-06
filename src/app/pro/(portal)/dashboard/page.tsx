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
import { ProPartnerMaterials } from "@/components/pro/pro-partner-materials";
import { ProPartnerProfileCard } from "@/components/pro/pro-partner-profile-card";
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
        <ProPartnerProfileCard
          practiceName={referral.practiceName}
          referralSlug={referral.referralSlug}
          referralUrl={referral.referralUrl}
          labels={{
            title: t("partnerProfile.title"),
            description: t("partnerProfile.description"),
            companyLabel: t("partnerProfile.companyLabel"),
            companyPlaceholder: t("partnerProfile.companyPlaceholder"),
            companyHint: t("partnerProfile.companyHint"),
            slugLabel: t("partnerProfile.slugLabel"),
            slugHint: t("partnerProfile.slugHint"),
            previewLabel: t("partnerProfile.previewLabel"),
            save: t("partnerProfile.save"),
            saving: t("partnerProfile.saving"),
            saved: t("partnerProfile.saved"),
            copyLink: t("partnerProfile.copyLink"),
            copied: t("partnerProfile.copied"),
            available: t("partnerProfile.available"),
            unavailable: t("partnerProfile.unavailable"),
            checking: t("partnerProfile.checking"),
          }}
        />

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
          <ProSectionHeading
            title={t("materials.sectionTitle")}
            description={t("materials.sectionDescription")}
          />
          <ProPartnerMaterials referralUrl={referral.referralUrl} />
        </section>

        <section>
          <ProSectionHeading title={t("referralProgram")} description={t("referralProgramHint")} />
          <ProReferralDashboard
            {...referral}
            labels={{
              intro: t("referralDashboard.intro"),
              statTotal: t("referralDashboard.statTotal"),
              statOwed: t("referralDashboard.statOwed"),
              statPaid: t("referralDashboard.statPaid"),
              statSubscribed: t("referralDashboard.statSubscribed"),
              owedHint: t("referralDashboard.owedHint"),
              paidHint: t("referralDashboard.paidHint"),
              activityTitle: t("referralDashboard.activityTitle"),
              emptyActivity: t("referralDashboard.emptyActivity"),
              colClient: t("referralDashboard.colClient"),
              colStatus: t("referralDashboard.colStatus"),
              colBonus: t("referralDashboard.colBonus"),
              colDate: t("referralDashboard.colDate"),
              pendingFirstInvoice: t("referralDashboard.pendingFirstInvoice"),
              statusLabels: {
                pending: t("referralDashboard.statusPending"),
                signed_up: t("referralDashboard.statusSignedUp"),
                subscribed: t("referralDashboard.statusSubscribed"),
                ineligible: t("referralDashboard.statusIneligible"),
              },
              bonusLabels: {
                pending: t("referralDashboard.bonusPending"),
                eligible: t("referralDashboard.bonusEligible"),
                paid: t("referralDashboard.bonusPaid"),
                ineligible: t("referralDashboard.bonusIneligible"),
              },
            }}
            compact={isEmpty}
          />
        </section>
      </div>
    </ProPortalShell>
  );
}
