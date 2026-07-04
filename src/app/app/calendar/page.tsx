import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/app-shell/coming-soon";

export default function CalendarPage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("calendar")} />;
}
