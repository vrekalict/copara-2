import { Suspense } from "react";
import { getAdminPartnerPayouts } from "@/actions/admin/partner-payouts";
import type { AdminReferralPayoutFilter } from "@/lib/admin/partner-payouts";
import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminPartnersSubnav } from "@/components/admin/admin-partners-subnav";
import { PartnerPayoutsPanel } from "@/components/admin/partner-payouts-panel";
import {
  AdminInfoBox,
  AdminShell,
} from "@/components/admin/admin-shell";

function parseFilter(value: string | undefined): AdminReferralPayoutFilter {
  if (
    value === "paid" ||
    value === "pending" ||
    value === "ineligible" ||
    value === "all"
  ) {
    return value;
  }
  return "owed";
}

export default async function AdminPartnerPayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const auth = await requireAdmin("/partners/payouts");

  if (!auth.ok) {
    return (
      <AdminShell title="Access denied" maxWidth="lg">
        <AdminInfoBox title="Admin access required">
          Your account is not configured as a Copara admin. Add your email to{" "}
          <code className="text-xs">COPARA_ADMIN_EMAILS</code>.
        </AdminInfoBox>
      </AdminShell>
    );
  }

  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const { payouts, summary } = await getAdminPartnerPayouts(filter);

  return (
    <AdminShell
      active="partners"
      eyebrow="Professional program"
      title="Referral payouts"
      description={
        <>
          Track partner referral bonuses — mark e-transfers or other payouts as paid and keep internal
          notes. Signed in as{" "}
          <span className="font-medium text-foreground">{auth.user.email}</span>.
        </>
      }
      maxWidth="4xl"
    >
      <AdminPartnersSubnav active="payouts" />

      <AdminInfoBox title="How payouts work">
        <ul className="list-disc space-y-1 pl-4">
          <li>
            A referral becomes <strong>eligible</strong> after the family&apos;s first paid Stripe
            invoice (25% of that invoice).
          </li>
          <li>
            Mark <strong>paid</strong> after you send the partner their bonus — use the{" "}
            <strong>E-transfer</strong> email shown on each row (partners set this in their dashboard).
          </li>
          <li>
            Use <strong>Revert to owed</strong> if a payout was marked paid by mistake.
          </li>
        </ul>
      </AdminInfoBox>

      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading payouts…</p>}>
          <PartnerPayoutsPanel payouts={payouts} summary={summary} filter={filter} />
        </Suspense>
      </div>
    </AdminShell>
  );
}
