import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPartnerActivation } from "@/actions/pro/partner";
import { PartnerActivatePanel } from "@/components/pro/partner-activate-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE } from "@/lib/marketing/site";

export default async function ProActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const activation = token ? await getPartnerActivation(token) : null;

  if (!activation) {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
        <h1 className="text-2xl font-semibold">Invalid activation link</h1>
        <p className="text-sm text-muted-foreground">
          This partner activation link is invalid. Contact support or request access again.
        </p>
        <Link href="/professionals#request-access" className="text-sm font-medium underline">
          Request partner access
        </Link>
      </main>
    );
  }

  if ("expired" in activation && activation.expired) {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
        <h1 className="text-2xl font-semibold">Link expired</h1>
        <p className="text-sm text-muted-foreground">
          Your activation link for {activation.email} has expired. Email{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="underline">
            {SITE.supportEmail}
          </a>{" "}
          to request a new one.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emailMatches =
    Boolean(user?.email) &&
    user!.email!.trim().toLowerCase() === activation.email.trim().toLowerCase();

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Activate partner access</CardTitle>
          <p className="text-sm text-muted-foreground">
            Welcome, {activation.firstName}. Complete activation for your Copara partner dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <PartnerActivatePanel
            token={token}
            email={activation.email}
            firstName={activation.firstName}
            isSignedIn={Boolean(user)}
            emailMatches={emailMatches}
          />
        </CardContent>
      </Card>
    </main>
  );
}
