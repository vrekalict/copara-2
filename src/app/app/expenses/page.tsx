import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/app-shell/coming-soon";

export default function ExpensesPage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("expenses")} />;
}
