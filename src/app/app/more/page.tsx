import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NotifPrefsPanel } from "@/components/settings/notif-prefs-panel";
import { Card } from "@/components/ui/card";

export default async function MorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: settings } = await supabase
    .from("user_settings")
    .select("notif_prefs")
    .eq("user_id", user.id)
    .maybeSingle();

  const t = await getTranslations("more");
  const notifPrefs = (settings?.notif_prefs ?? {}) as Record<string, boolean>;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      <Card className="overflow-hidden">
        <NotifPrefsPanel initialPrefs={notifPrefs} />
      </Card>

      <Card className="divide-y">
        <Link
          href="/app/journal"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("journal")}
        </Link>
        <Link
          href="/app/albums"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("albums")}
        </Link>
        <Link
          href="/app/exports"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("exports")}
        </Link>
        <div className="flex items-center justify-between p-4">
          <span>{t("language")}</span>
          <LocaleSwitcher />
        </div>
        <Link
          href="/account/billing"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Billing
        </Link>
        <Link
          href="/pro"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("professional")}
        </Link>
        <Link
          href="/legal/privacy"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("privacy")}
        </Link>
        <Link
          href="/legal/terms"
          className="block p-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("terms")}
        </Link>
      </Card>
    </div>
  );
}
