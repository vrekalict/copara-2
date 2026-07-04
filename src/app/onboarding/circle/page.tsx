import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleForm } from "@/components/onboarding/circle-form";

export default function OnboardingCirclePage() {
  const t = useTranslations("onboarding");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("circleTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("circleSubtitle")}</p>
        </CardHeader>
        <CardContent>
          <CircleForm />
        </CardContent>
      </Card>
    </main>
  );
}
