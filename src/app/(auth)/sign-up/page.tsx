import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { userHasLegalAcceptance } from "@/lib/auth/legal-gate";
import { resolveAuthRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { isPlanKey, PLAN_LABELS, STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; plan?: string; ref?: string }>;
}) {
  const { next, plan, ref } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!(await userHasLegalAcceptance(supabase, user.id))) {
      const params = new URLSearchParams();
      if (next) params.set("next", next);
      if (plan) params.set("plan", plan);
      if (ref) params.set("ref", ref);
      redirect(`/complete-signup?${params.toString()}`);
    }
    redirect(
      resolveAuthRedirect({
        next,
        plan,
        ref,
        fallback: "/app",
      }),
    );
  }

  const t = await getTranslations("auth");
  const hasPlan = plan && isPlanKey(plan);
  const planLabel = hasPlan ? PLAN_LABELS[plan] : null;

  return (
    <AuthShell
      eyebrow={hasPlan ? planLabel ?? undefined : "Get started"}
      title={t("signUp")}
      description={
        hasPlan
          ? `Create your account to start your ${STRIPE_TRIAL_DAYS}-day free trial on ${planLabel}. You will not be charged until the trial ends.`
          : "Create your Copara account to coordinate schedules, messages, and shared records with your co-parent."
      }
    >
      <SignUpForm next={next} plan={plan} ref={ref} />
    </AuthShell>
  );
}
