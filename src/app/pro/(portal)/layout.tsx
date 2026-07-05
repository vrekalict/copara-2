import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";

export default async function ProPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/pro");
  }

  const access = await requireApprovedPartner(supabase, user.id, user.email);
  if (!access.ok) {
    if (access.reason === "pending") {
      return (
        <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
          <h1 className="text-2xl font-semibold">Application under review</h1>
          <p className="text-sm text-muted-foreground">
            Your partner application is pending approval. We will email you when your dashboard
            access is ready.
          </p>
          <Link href="/professionals#request-access" className="text-sm font-medium underline">
            View partner program
          </Link>
        </main>
      );
    }

    return (
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
        <h1 className="text-2xl font-semibold">Partner access required</h1>
        <p className="text-sm text-muted-foreground">
          The professional dashboard is available to approved Copara partners only. Request access
          first — we will email you an activation link after review.
        </p>
        <Link
          href="/professionals#request-access"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Request partner access
        </Link>
      </main>
    );
  }

  return children;
}
