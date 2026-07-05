"use client";

import { useState } from "react";
import { Eye, FileText, Gift, Users } from "lucide-react";
import type { ProfessionalReferral } from "@/lib/pro/referrals";
import { ProPortalCard, ProPortalStat } from "@/components/pro/pro-portal-shell";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  signed_up: "Signed up",
  subscribed: "Subscribed",
  ineligible: "Ineligible",
};

const BONUS_LABELS: Record<string, string> = {
  pending: "Pending",
  eligible: "Eligible",
  paid: "Paid",
  ineligible: "Ineligible",
};

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

export function ProReferralDashboard({
  referralUrl,
  referralCode,
  bonusPercent,
  currency,
  stats,
  referrals,
  compact = false,
}: {
  referralUrl: string;
  referralCode: string;
  bonusPercent: number;
  currency: string;
  stats: {
    pending: number;
    signedUp: number;
    subscribed: number;
    bonusEligible: number;
    bonusPaid: number;
    potentialBonus: number;
    total: number;
  };
  referrals: ProfessionalReferral[];
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <ProPortalCard>
        <p className="text-sm font-semibold text-[var(--marketing-slate)]">Your referral link</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Share with client families. Earn {bonusPercent}% of their first paid invoice — one bonus per
          household.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/50 px-3 py-2.5 text-sm break-all">
            {referralUrl}
          </code>
          <Button type="button" variant="outline" onClick={copyLink} className="min-h-11 shrink-0">
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Partner code: {referralCode}</p>
      </ProPortalCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ProPortalStat label="Total referrals" value={stats.total} />
        <ProPortalStat label="Pending" value={stats.pending} />
        <ProPortalStat label="Subscribed" value={stats.subscribed} />
        <ProPortalStat label="Bonus eligible" value={stats.bonusEligible} />
      </div>

      {!compact && (
        <ProPortalCard className="overflow-hidden p-0">
          <div className="border-b border-[var(--marketing-border)] px-6 py-4">
            <h3 className="font-semibold text-[var(--marketing-slate)]">Referral activity</h3>
          </div>
          {referrals.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              No referrals yet. Share your partner link with clients to start tracking bonuses.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--marketing-mist)]/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Bonus</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-t border-[var(--marketing-border)]">
                      <td className="px-6 py-3">
                        <p>{referral.referredName ?? referral.referredEmail}</p>
                        {referral.referredName && (
                          <p className="text-xs text-muted-foreground">{referral.referredEmail}</p>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {STATUS_LABELS[referral.status] ?? referral.status}
                      </td>
                      <td className="px-6 py-3">
                        {referral.bonusStatus === "ineligible" && referral.bonusIneligibleReason ? (
                          <span className="text-muted-foreground">{referral.bonusIneligibleReason}</span>
                        ) : referral.bonusAmountCad != null ? (
                          `${referral.bonusAmountCad.toFixed(2)} ${currency} · ${BONUS_LABELS[referral.bonusStatus] ?? referral.bonusStatus}`
                        ) : referral.status === "subscribed" || referral.status === "signed_up" ? (
                          `Pending first invoice · ${BONUS_LABELS[referral.bonusStatus] ?? referral.bonusStatus}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ProPortalCard>
      )}
    </div>
  );
}
