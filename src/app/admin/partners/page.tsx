import { listPartnerApplications } from "@/actions/pro/partner";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  AdminInfoBox,
  AdminShell,
  AdminStat,
} from "@/components/admin/admin-shell";
import { PartnerApplicationsPanel } from "@/components/pro/partner-applications-panel";

export default async function AdminPartnersPage() {
  const auth = await requireAdmin("/partners");

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

  const applications = await listPartnerApplications();
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

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
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminStat
            label="Pending review"
            value={pendingCount}
            hint={pendingCount > 0 ? "Needs your decision" : "Nothing waiting"}
          />
          <AdminStat label="Approved" value={approvedCount} hint="Activation email sent" />
          <AdminStat label="Rejected" value={rejectedCount} hint="Archived in this list" />
        </div>

        <AdminInfoBox title="What happens when you approve">
          <ol className="list-decimal space-y-1.5 pl-4">
            <li>The applicant receives an activation email with a secure link.</li>
            <li>They have 14 days to set up their professional dashboard.</li>
            <li>Rejecting optionally records a reason for your internal notes only.</li>
          </ol>
        </AdminInfoBox>

        <PartnerApplicationsPanel applications={applications} />
      </div>
    </AdminShell>
  );
}
