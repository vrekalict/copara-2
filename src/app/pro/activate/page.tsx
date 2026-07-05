import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { createClient } from "@/lib/supabase/server";
import { getPartnerActivation } from "@/actions/pro/partner";
import { PartnerActivatePanel } from "@/components/pro/partner-activate-panel";
import { SITE } from "@/lib/marketing/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; "sign-in"?: string }>;
}) {
  const { token = "", "sign-in": signIn } = await searchParams;
  const activation = token ? await getPartnerActivation(token) : null;

  if (!activation) {
    return (
      <AuthShell
        variant="partner"
        eyebrow="Partner access"
        title="Invalid activation link"
        description="This partner activation link is invalid or has already been used."
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Contact support or submit a new partner access request.
          </p>
          <Link
            href="/professionals#request-access"
            className={cn(buttonVariants(), "min-h-11 justify-center")}
          >
            Request partner access
          </Link>
        </div>
      </AuthShell>
    );
  }

  if ("expired" in activation && activation.expired) {
    return (
      <AuthShell
        variant="partner"
        eyebrow="Partner access"
        title="Link expired"
        description={`Your activation link for ${activation.email} has expired.`}
      >
        <p className="text-sm text-muted-foreground">
          Email{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="font-medium underline">
            {SITE.supportEmail}
          </a>{" "}
          to request a new activation link.
        </p>
      </AuthShell>
    );
  }

  if (activation.alreadyActivated) {
    return (
      <AuthShell
        variant="partner"
        eyebrow="Partner access"
        title="Already activated"
        description={`Partner access for ${activation.email} is already active.`}
      >
        <Link href="/pro/dashboard" className={cn(buttonVariants(), "min-h-11 justify-center")}>
          Open partner dashboard
        </Link>
      </AuthShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emailMatches =
    Boolean(user?.email) &&
    user!.email!.trim().toLowerCase() === activation.email.trim().toLowerCase();

  if (!user && signIn !== "1") {
    redirect(`/pro/activate/sign-up?token=${encodeURIComponent(token)}`);
  }

  const panelMode = user ? (emailMatches ? "activate" : "wrong-account") : "sign-in";

  return (
    <AuthShell
      variant="partner"
      eyebrow="Partner access"
      title={
        panelMode === "sign-in"
          ? "Sign in to activate"
          : panelMode === "wrong-account"
            ? "Wrong account signed in"
            : "Activate partner access"
      }
      description={
        panelMode === "wrong-account"
          ? `You're signed in with a different email than ${activation.email}. Sign out to continue with the email from your approved application.`
          : `Welcome, ${activation.firstName}. Complete activation for your Copara partner dashboard.`
      }
    >
      <PartnerActivatePanel
        token={token}
        email={activation.email}
        firstName={activation.firstName}
        mode={panelMode}
      />
    </AuthShell>
  );
}
