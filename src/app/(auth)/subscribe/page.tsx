import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SubscribeCheckout } from "@/components/billing/subscribe-checkout";
import { SubscribePlanPicker } from "@/components/billing/subscribe-plan-picker";
import { getSubscribePlanDetails } from "@/actions/stripe/checkout";
import { createClient } from "@/lib/supabase/server";
import { getAppAccess } from "@/lib/stripe/access";
import { isPlanKey } from "@/lib/stripe/config";

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
    const params = new URLSearchParams();
    if (plan) params.set("plan", plan);
    if (ref) params.set("ref", ref);
    const next = params.size > 0 ? `/subscribe?${params.toString()}` : "/subscribe";
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  const access = await getAppAccess(supabase, user.id);
  if (access.hasAccess) {
    redirect("/onboarding/circle");
  }

  const planKey = plan && isPlanKey(plan) ? plan : null;
  const planDetails = planKey ? await getSubscribePlanDetails(planKey) : null;

  return (
    <AuthShell
      eyebrow="Start your free trial"
      title={planDetails ? planDetails.label : "Choose a plan"}
      description={
        planDetails
          ? `${planDetails.trialDays}-day free trial. You will not be charged until the trial ends. Cancel anytime from your account.`
          : "Select a plan to continue to secure checkout. Both parents can share one Family Circle subscription."
      }
    >
      <div className="flex flex-col gap-4">
        {planKey && planDetails ? (
          <SubscribeCheckout planKey={planKey} referralCode={ref} />
        ) : (
          <SubscribePlanPicker referralCode={ref} />
        )}

        <p className="text-center text-sm text-muted-foreground">
          {planKey ? (
            <>
              Need a different plan?{" "}
              <Link href="/subscribe" className="font-medium text-foreground underline">
                Change plan
              </Link>
            </>
          ) : (
            <>
              Want the full comparison?{" "}
              <Link href="/pricing" className="font-medium text-foreground underline">
                View pricing
              </Link>
            </>
          )}
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Already subscribed?{" "}
          <Link href="/onboarding/circle" className="font-medium text-foreground underline">
            Continue to setup
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
