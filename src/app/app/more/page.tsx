import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/app-shell/coming-soon";

export default function MorePage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("more")} />;
}
