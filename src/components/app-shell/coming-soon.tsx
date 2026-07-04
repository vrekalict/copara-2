import { useTranslations } from "next-intl";

export function ComingSoon({ title }: { title: string }) {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col gap-1 p-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
    </div>
  );
}
