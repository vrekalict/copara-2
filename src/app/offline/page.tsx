import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default async function OfflinePage() {
  const t = await getTranslations("offline");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("description")}</p>
      <Link href="/app/messages" className="mt-4 text-sm text-primary underline">
        {t("backToApp")}
      </Link>
    </main>
  );
}
