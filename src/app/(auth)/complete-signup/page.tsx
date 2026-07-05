import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { CompleteSignupForm } from "@/components/auth/complete-signup-form";
import { userHasLegalAcceptance } from "@/lib/auth/legal-gate";
import { resolveAuthRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export default async function CompleteSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; plan?: string; ref?: string }>;
}) {
  const { next, plan, ref } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const returnParams = new URLSearchParams();
    if (next) returnParams.set("next", next);
    if (plan) returnParams.set("plan", plan);
    if (ref) returnParams.set("ref", ref);
    const qs = returnParams.toString();
    redirect(`/sign-in?next=${encodeURIComponent(`/complete-signup${qs ? `?${qs}` : ""}`)}`);
  }

  if (await userHasLegalAcceptance(supabase, user.id)) {
    redirect(
      resolveAuthRedirect({
        next,
        plan,
        ref,
        fallback: "/app",
      }),
    );
  }

  return (
    <AuthShell
      eyebrow="Almost there"
      title="Complete your account"
      description="Choose your province and accept the Terms and Privacy Policy to continue using Copara."
    >
      <CompleteSignupForm next={next} plan={plan} ref={ref} />
    </AuthShell>
  );
}
