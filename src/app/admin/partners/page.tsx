import { listPartnerApplications } from "@/actions/pro/partner";
import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminPartnersSubnav } from "@/components/admin/admin-partners-subnav";
import {
  AdminInfoBox,
  AdminShell,
  AdminStat,
} from "@/components/admin/admin-shell";
import { PartnerApplicationsPanel } from "@/components/pro/partner-applications-panel";

export default async function AdminPartnersPage() {
  const auth = await requireAdmin();

  const applications = await listPartnerApplications();
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const activatedCount = applications.filter((a) => a.status === "activated").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;
  const unsentApproved = applications.filter(
    (a) => a.status === "approved" && a.approvalEmailSentCount === 0,
  ).length;

  return (
    <AdminShell
      active="partners"
      eyebrow="Professional program"
      title="Partner applications"
      description={
        <>
          Review requests from family-law professionals who want Copara partner access. Signed in as{" "}
          <span className="font-medium text-foreground">{auth.user.email}</span>.
        </>
      }
      maxWidth="4xl"
    >
      <AdminPartnersSubnav active="applications" />

      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStat
            label="Pending review"
            value={pendingCount}
            hint={pendingCount > 0 ? "Needs your decision" : "Nothing waiting"}
          />
          <AdminStat
            label="Approved"
            value={approvedCount}
            hint={
              unsentApproved > 0
                ? `${unsentApproved} waiting for activation email`
                : "Awaiting partner activation"
            }
          />
          <AdminStat label="Activated" value={activatedCount} hint="Live partner accounts" />
          <AdminStat label="Rejected" value={rejectedCount} hint="Archived in this list" />
        </div>

        <AdminInfoBox title="What happens when you approve">
          <ol className="list-decimal space-y-1.5 pl-4">
            <li>The applicant receives an activation email with a secure link (requires RESEND_API_KEY).</li>
            <li>They have 14 days to set up their professional dashboard.</li>
            <li>Use <strong>Resend activation email</strong> if the first send failed or the link expired.</li>
            <li>Rejecting optionally records a reason for your internal notes only.</li>
          </ol>
        </AdminInfoBox>

        <PartnerApplicationsPanel applications={applications} />
      </div>
    </AdminShell>
  );
}
