import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default function Home() {
  const t = useTranslations("marketing");
  const common = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold text-foreground">
          {common("appName")}
        </span>
        <LocaleSwitcher />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div className="flex max-w-xl flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("tagline")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
            {t("ctaParent")}
          </Link>
          <Link
            href="/pro"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            {t("ctaProfessional")}
          </Link>
        </div>
      </main>
    </div>
  );
}
