import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChildrenForm } from "@/components/onboarding/children-form";
import { buttonVariants } from "@/components/ui/button";

export default async function OnboardingChildrenPage({
  searchParams,
}: {
  searchParams: Promise<{ circle?: string }>;
}) {
  const { circle } = await searchParams;
  if (!circle) redirect("/onboarding/circle");

  const t = await getTranslations("onboarding");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("childrenTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("childrenSubtitle")}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ChildrenForm circleId={circle} />
          <Link href="/app" className={buttonVariants({ variant: "secondary" })}>
            {t("finish")}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
