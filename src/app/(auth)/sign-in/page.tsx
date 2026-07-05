import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { userHasLegalAcceptance } from "@/lib/auth/legal-gate";
import { resolveAuthRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!(await userHasLegalAcceptance(supabase, user.id))) {
      const params = new URLSearchParams();
      if (next) params.set("next", next);
      const qs = params.toString();
      redirect(`/complete-signup${qs ? `?${qs}` : ""}`);
    }
    redirect(
      resolveAuthRedirect({
        next,
        fallback: "/app",
      }),
    );
  }

  const t = await getTranslations("auth");

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={t("signIn")}
      description="Sign in to continue to your co-parenting circle, messages, and records."
    >
      <SignInForm next={next} />
    </AuthShell>
  );
}
