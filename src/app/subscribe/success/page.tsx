import { redirect } from "next/navigation";
import Link from "next/link";
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
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center gap-6 p-6 text-center">
      <div>
        <p className="text-sm font-medium text-primary">Trial started</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {access.hasAccess ? "You are all set" : "Finishing setup…"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your free trial is active. Set up your co-parenting circle to start using Copara.
        </p>
      </div>
      <Link
        href="/onboarding/circle"
        className={cn(buttonVariants(), "min-h-11 justify-center")}
      >
        Continue setup
      </Link>
    </main>
  );
}
