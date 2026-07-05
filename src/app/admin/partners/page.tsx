import { listPartnerApplications } from "@/actions/pro/partner";
import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { PartnerApplicationsPanel } from "@/components/pro/partner-applications-panel";

export default async function AdminPartnersPage() {
  const auth = await requireAdmin("/partners");

  if (!auth.ok) {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is not configured as a Copara admin. Set{" "}
          <code className="text-xs">COPARA_ADMIN_EMAILS</code> to include your email.
        </p>
      </main>
    );
  }

  const applications = await listPartnerApplications();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <AdminNav active="partners" />
      <h1 className="text-2xl font-semibold">Partner applications</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Review professional partner requests. Approving sends an activation email with a 14-day
        link to set up dashboard access.
      </p>
      <div className="mt-8">
        <PartnerApplicationsPanel applications={applications} />
      </div>
    </main>
  );
}
