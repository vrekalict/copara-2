import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { createClient } from "@/lib/supabase/server";
import { getAppAccess } from "@/lib/stripe/access";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SubscribeSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const access = await getAppAccess(supabase, user.id);

  return (
    <AuthShell
      eyebrow="Trial started"
      title={access.hasAccess ? "You are all set" : "Finishing setup…"}
      description="Your free trial is active. Set up your co-parenting circle to start using Copara."
    >
      <Link
        href="/onboarding/circle"
        className={cn(buttonVariants(), "min-h-11 w-full justify-center")}
      >
        Continue setup
      </Link>
    </AuthShell>
  );
}
