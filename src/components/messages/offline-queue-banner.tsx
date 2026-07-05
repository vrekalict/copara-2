"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { listQueuedMessages } from "@/lib/offline/message-queue";

export function OfflineQueueBanner({ threadId }: { threadId?: string }) {
  const t = useTranslations("messages");
  const [count, setCount] = useState(0);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function refresh() {
      setOffline(!navigator.onLine);
      void listQueuedMessages(threadId).then((items) => setCount(items.length));
    }

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    const interval = setInterval(refresh, 5000);

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      clearInterval(interval);
    };
  }, [threadId]);

  if (!offline && count === 0) return null;

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
      role="status"
      aria-live="polite"
    >
      {offline ? t("offlineBanner") : t("queuedBanner", { count })}
    </div>
  );
}
