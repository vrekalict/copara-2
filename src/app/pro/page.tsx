import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("pro");

  if (user) {
    const access = await requireApprovedPartner(supabase, user.id, user.email);
    if (access.ok) {
      redirect("/pro/dashboard");
    }

    if (access.reason === "pending") {
      return (
        <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            Your partner application is under review. We will email you when your dashboard access
            is approved.
          </p>
          <Link href="/professionals#request-access" className="text-sm font-medium underline">
            Partner program details
          </Link>
        </main>
      );
    }

    return (
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-12">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">
          Partner dashboard access requires approval. Request access below — we will email you an
          activation link after review.
        </p>
        <Link
          href="/professionals#request-access"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Request partner access
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("signInPrompt")}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SignInForm next="/pro/dashboard" />
          <p className="text-center text-sm text-muted-foreground">
            Not a partner yet?{" "}
            <Link href="/professionals#request-access" className="font-medium underline">
              Request access
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
