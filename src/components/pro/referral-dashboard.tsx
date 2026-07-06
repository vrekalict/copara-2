"use client";

import { Eye, FileText, Gift, Users } from "lucide-react";
import type { ProfessionalReferral } from "@/lib/pro/referrals";
import { ProPortalCard, ProPortalStat } from "@/components/pro/pro-portal-shell";

function BenefitIcon({ icon }: { icon: string }) {
  const className = "size-5 text-[var(--marketing-teal)]";
  switch (icon) {
    case "eye":
      return <Eye className={className} aria-hidden />;
    case "users":
      return <Users className={className} aria-hidden />;
    case "file":
      return <FileText className={className} aria-hidden />;
    default:
      return <Gift className={className} aria-hidden />;
  }
}

export function ProBenefitGrid({
  benefits,
}: {
  benefits: readonly { title: string; description: string; icon: string }[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {benefits.map((benefit) => (
        <article
          key={benefit.title}
          className="rounded-2xl border border-[var(--marketing-border)] bg-white p-6 shadow-sm"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-[var(--marketing-teal)]/10">
            <BenefitIcon icon={benefit.icon} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--marketing-slate)]">{benefit.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
        </article>
      ))}
    </div>
  );
}

function formatMoney(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency}`;
}

export function ProReferralDashboard({
  bonusPercent,
  currency,
  stats,
  referrals,
  labels,
  compact = false,
}: {
  bonusPercent: number;
  currency: string;
  stats: {
    pending: number;
    signedUp: number;
    subscribed: number;
    bonusEligible: number;
    bonusPaid: number;
    potentialBonus: number;
    paidBonusTotal: number;
    total: number;
  };
  referrals: ProfessionalReferral[];
  labels: {
    intro: string;
    statTotal: string;
    statOwed: string;
    statPaid: string;
    statSubscribed: string;
    owedHint: string;
    paidHint: string;
    activityTitle: string;
    emptyActivity: string;
    colClient: string;
    colStatus: string;
    colBonus: string;
    colDate: string;
    statusLabels: Record<string, string>;
    bonusLabels: Record<string, string>;
    pendingFirstInvoice: string;
  };
  compact?: boolean;
}) {
  const showActivity = !compact || referrals.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <ProPortalCard>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {labels.intro.replace("{percent}", String(bonusPercent))}
        </p>
      </ProPortalCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ProPortalStat label={labels.statTotal} value={stats.total} />
        <ProPortalStat
          label={labels.statOwed}
          value={formatMoney(stats.potentialBonus, currency)}
          hint={labels.owedHint.replace("{count}", String(stats.bonusEligible))}
        />
        <ProPortalStat
          label={labels.statPaid}
          value={formatMoney(stats.paidBonusTotal, currency)}
          hint={labels.paidHint.replace("{count}", String(stats.bonusPaid))}
        />
        <ProPortalStat label={labels.statSubscribed} value={stats.subscribed} />
      </div>

      {showActivity && (
        <ProPortalCard className="overflow-hidden p-0">
          <div className="border-b border-[var(--marketing-border)] px-6 py-4">
            <h3 className="font-semibold text-[var(--marketing-slate)]">{labels.activityTitle}</h3>
          </div>
          {referrals.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">{labels.emptyActivity}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--marketing-mist)]/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">{labels.colClient}</th>
                    <th className="px-6 py-3 font-medium">{labels.colStatus}</th>
                    <th className="px-6 py-3 font-medium">{labels.colBonus}</th>
                    <th className="px-6 py-3 font-medium">{labels.colDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => {
                    const dateValue =
                      referral.bonusStatus === "paid" && referral.bonusPaidAt
                        ? referral.bonusPaidAt
                        : referral.subscribedAt ?? referral.createdAt;
                    const dateLabel =
                      referral.bonusStatus === "paid" && referral.bonusPaidAt
                        ? new Date(referral.bonusPaidAt).toLocaleDateString()
                        : new Date(dateValue).toLocaleDateString();

                    return (
                      <tr key={referral.id} className="border-t border-[var(--marketing-border)]">
                        <td className="px-6 py-3">
                          <p>{referral.referredName ?? referral.referredEmail}</p>
                          {referral.referredName && (
                            <p className="text-xs text-muted-foreground">{referral.referredEmail}</p>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {labels.statusLabels[referral.status] ?? referral.status}
                        </td>
                        <td className="px-6 py-3">
                          {referral.bonusStatus === "ineligible" && referral.bonusIneligibleReason ? (
                            <span className="text-muted-foreground">
                              {referral.bonusIneligibleReason}
                            </span>
                          ) : referral.bonusAmountCad != null ? (
                            `${formatMoney(referral.bonusAmountCad, currency)} · ${labels.bonusLabels[referral.bonusStatus] ?? referral.bonusStatus}`
                          ) : referral.status === "subscribed" || referral.status === "signed_up" ? (
                            `${labels.pendingFirstInvoice} · ${labels.bonusLabels[referral.bonusStatus] ?? referral.bonusStatus}`
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{dateLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ProPortalCard>
      )}
    </div>
  );
}
