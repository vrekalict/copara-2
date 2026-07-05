import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAppAccess } from "@/lib/stripe/access";
import { SubscribeCheckout } from "@/components/billing/subscribe-checkout";
import { getSubscribePlanDetails } from "@/actions/stripe/checkout";
import { isPlanKey } from "@/lib/stripe/config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; ref?: string }>;
}) {
  const { plan, ref } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const next = plan ? `/subscribe?plan=${encodeURIComponent(plan)}` : "/subscribe";
    const refParam = ref ? `&ref=${encodeURIComponent(ref)}` : "";
    redirect(`/sign-in?next=${encodeURIComponent(`${next}${refParam}`)}`);
  }

  const access = await getAppAccess(supabase, user.id);
  if (access.hasAccess) {
    redirect("/onboarding/circle");
  }

  const planKey = plan && isPlanKey(plan) ? plan : null;
  const planDetails = planKey ? await getSubscribePlanDetails(planKey) : null;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <p className="text-sm font-medium text-primary">Start your free trial</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {planDetails ? planDetails.label : "Choose a plan"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {planDetails
            ? `${planDetails.trialDays}-day free trial. You will not be charged until the trial ends. Cancel anytime from your account.`
            : "Select a plan on the pricing page, then return here to start your trial."}
        </p>
      </div>

      {planKey && planDetails ? (
        <SubscribeCheckout planKey={planKey} referralCode={ref} />
      ) : (
        <Link href="/pricing" className={cn(buttonVariants(), "min-h-11 justify-center")}>
          View pricing
        </Link>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already subscribed?{" "}
        <Link href="/onboarding/circle" className="font-medium text-foreground underline">
          Continue to setup
        </Link>
      </p>
    </main>
  );
}
