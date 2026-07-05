import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteForm } from "@/components/onboarding/invite-form";

export default async function OnboardingInvitePage({
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
          <CardTitle>{t("inviteTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("inviteSubtitle")}</p>
        </CardHeader>
        <CardContent>
          <InviteForm circleId={circle} />
        </CardContent>
      </Card>
    </main>
  );
}
