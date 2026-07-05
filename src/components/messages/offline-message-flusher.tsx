"use client";

import { useEffect } from "react";
import { sendMessage } from "@/actions/messages";
import { listQueuedMessages, removeQueuedMessage } from "@/lib/offline/message-queue";

async function flushOfflineMessages() {
  const queued = await listQueuedMessages();
  for (const item of queued) {
    const formData = new FormData();
    formData.set("threadId", item.threadId);
    formData.set("body", item.body);
    formData.set("attachments", JSON.stringify(item.attachments));

    const result = await sendMessage(formData);
    if (result?.success) {
      await removeQueuedMessage(item.id);
    }
  }
}

export function OfflineMessageFlusher() {
  useEffect(() => {
    function handleOnline() {
      void flushOfflineMessages();
    }

    if (navigator.onLine) {
      void flushOfflineMessages();
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return null;
}
