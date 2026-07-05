import { Link2, Users } from "lucide-react";
import { ProGettingStarted } from "@/components/pro/pro-getting-started";
import { ProBenefitGrid } from "@/components/pro/referral-dashboard";
import { ProPortalCard } from "@/components/pro/pro-portal-shell";

export type PartnerGuideContent = {
  gettingStartedTitle: string;
  steps: readonly { title: string; body: string }[];
  linkComparisonTitle: string;
  caseInvite: {
    title: string;
    when: string;
    points: readonly string[];
  };
  referralLink: {
    title: string;
    when: string;
    points: readonly string[];
  };
  billingTitle: string;
  billingBody: string;
  accessTitle: string;
  accessBody: string;
  memberStatusTitle: string;
  statusInvited: string;
  statusActive: string;
  statusProfessional: string;
  benefitsTitle: string;
  benefits: readonly { title: string; description: string; icon: string }[];
};

function ProLinkComparison({
  linkComparisonTitle,
  caseInvite,
  referralLink,
}: Pick<PartnerGuideContent, "linkComparisonTitle" | "caseInvite" | "referralLink">) {
  return (
    <div>
      <h3 className="text-base font-semibold text-[var(--marketing-slate)]">{linkComparisonTitle}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/30 p-5">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[var(--marketing-teal)]" aria-hidden />
            <h4 className="font-semibold text-[var(--marketing-slate)]">{caseInvite.title}</h4>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{caseInvite.when}</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            {caseInvite.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-[var(--marketing-teal)]" aria-hidden>
                  ·
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/30 p-5">
          <div className="flex items-center gap-2">
            <Link2 className="size-4 text-[var(--marketing-teal)]" aria-hidden />
            <h4 className="font-semibold text-[var(--marketing-slate)]">{referralLink.title}</h4>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{referralLink.when}</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            {referralLink.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-[var(--marketing-teal)]" aria-hidden>
                  ·
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

export function ProPartnerGuide({ content }: { content: PartnerGuideContent }) {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <ProGettingStarted title={content.gettingStartedTitle} steps={content.steps} />

      <ProLinkComparison
        linkComparisonTitle={content.linkComparisonTitle}
        caseInvite={content.caseInvite}
        referralLink={content.referralLink}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ProPortalCard className="p-5">
          <p className="font-semibold text-[var(--marketing-slate)]">{content.billingTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.billingBody}</p>
        </ProPortalCard>
        <ProPortalCard className="p-5">
          <p className="font-semibold text-[var(--marketing-slate)]">{content.accessTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.accessBody}</p>
        </ProPortalCard>
      </div>

      <ProPortalCard className="p-5">
        <p className="font-semibold text-[var(--marketing-slate)]">{content.memberStatusTitle}</p>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-[var(--marketing-slate)]">invited</dt>
            <dd className="text-muted-foreground">{content.statusInvited}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-[var(--marketing-slate)]">active</dt>
            <dd className="text-muted-foreground">{content.statusActive}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-[var(--marketing-slate)]">professional</dt>
            <dd className="text-muted-foreground">{content.statusProfessional}</dd>
          </div>
        </dl>
      </ProPortalCard>

      <div>
        <h3 className="mb-4 text-base font-semibold text-[var(--marketing-slate)]">
          {content.benefitsTitle}
        </h3>
        <ProBenefitGrid benefits={content.benefits} />
      </div>
    </div>
  );
}

export function ProCaseBillingNote({ title, body }: { title: string; body: string }) {
  return (
    <ProPortalCard className="border-[var(--marketing-teal)]/20 bg-[var(--marketing-teal)]/5 p-5">
      <p className="font-semibold text-[var(--marketing-slate)]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </ProPortalCard>
  );
}
