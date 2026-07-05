import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
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
