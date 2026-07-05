import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getProCircles } from "@/actions/pro";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function ProDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations("pro");
  const params = await searchParams;

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("signInPrompt")}</p>
        <Link href="/sign-up?next=/pro" className={buttonVariants()}>
          {t("signUp")}
        </Link>
      </div>
    );
  }

  const circles = await getProCircles(user.id);

  if (circles.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("setupSubtitle")}</p>
        <ProSetupForm />
      </div>
    );
  }

  if (params.case) {
    redirect(`/pro/circles/${params.case}`);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Link href="/pro/setup" className={buttonVariants({ variant: "outline", size: "sm" })}>
          {t("newCase")}
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {circles.map((circle) => (
          <Link key={circle.circleId} href={`/pro/circles/${circle.circleId}`}>
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <p className="font-medium">{circle.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(circle.createdAt).toLocaleDateString()}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
