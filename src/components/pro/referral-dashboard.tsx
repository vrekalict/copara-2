"use client";

import { useState } from "react";
import { Eye, FileText, Gift, Users } from "lucide-react";
import type { ProfessionalReferral } from "@/lib/pro/referrals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const className = "size-5 text-primary";
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
          className="rounded-2xl border border-[var(--marketing-border)] bg-background p-6 shadow-sm"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <BenefitIcon icon={benefit.icon} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-heading">{benefit.title}</h3>
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
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <p className="text-sm font-semibold text-slate-heading">Partner referral program</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Share your link with client families. Earn {bonusPercent}% of their first paid invoice —
          one bonus per household.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm break-all">
            {referralUrl}
          </code>
          <Button type="button" variant="outline" onClick={copyLink} className="min-h-10 shrink-0">
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Partner code: {referralCode}</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total referrals", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Subscribed", value: stats.subscribed },
          { label: "Bonus eligible", value: stats.bonusEligible },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-2xl font-bold text-slate-heading">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--marketing-border)] px-5 py-4">
          <h2 className="font-semibold text-slate-heading">Referral activity</h2>
        </div>
        {referrals.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No referrals yet. Share your partner link with clients to start tracking bonuses.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Bonus</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-t border-[var(--marketing-border)]">
                    <td className="px-5 py-3">
                      <p>{referral.referredName ?? referral.referredEmail}</p>
                      {referral.referredName && (
                        <p className="text-xs text-muted-foreground">{referral.referredEmail}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">{STATUS_LABELS[referral.status] ?? referral.status}</td>
                    <td className="px-5 py-3">
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
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
