"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { updateNotifPrefs } from "@/actions/settings";
import { subscribeToPushNotifications } from "@/lib/push/subscribe-client";
import { Button } from "@/components/ui/button";

export function NotifPrefsPanel({
  initialPrefs,
}: {
  initialPrefs: Record<string, boolean>;
}) {
  const t = useTranslations("settings");
  const [messagesEnabled, setMessagesEnabled] = useState(
    initialPrefs.messages !== false,
  );
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const savePrefs = useCallback(async (nextMessages: boolean) => {
    setSaving(true);
    const result = await updateNotifPrefs({ messages: nextMessages });
    setSaving(false);
    if (result?.error) {
      setPushStatus(result.error);
      return;
    }
    setPushStatus(t("prefsSaved"));
  }, [t]);

  const enablePush = useCallback(async () => {
    setPushStatus(null);
    const result = await subscribeToPushNotifications();
    if (!result.ok) {
      if (result.reason === "denied") setPushStatus(t("pushDenied"));
      else if (result.reason === "no_vapid") setPushStatus(t("pushNotConfigured"));
      else setPushStatus(t("pushFailed"));
      return;
    }
    setPushStatus(t("pushEnabled"));
  }, [t]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <p className="font-medium">{t("notifications")}</p>
        <p className="text-sm text-muted-foreground">{t("notificationsHint")}</p>
      </div>

      <Button type="button" size="sm" variant="outline" className="self-start" onClick={() => void enablePush()}>
        {t("enablePush")}
      </Button>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={messagesEnabled}
          disabled={saving}
          onChange={(e) => {
            const next = e.target.checked;
            setMessagesEnabled(next);
            void savePrefs(next);
          }}
        />
        {t("messageNotifications")}
      </label>

      {pushStatus && <p className="text-sm text-muted-foreground">{pushStatus}</p>}
    </div>
  );
}
