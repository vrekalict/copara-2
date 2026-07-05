export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPushNotifications() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return { ok: false as const, reason: "unsupported" as const };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false as const, reason: "denied" as const };
  }

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
  if (!vapidKey) {
    return { ok: false as const, reason: "no_vapid" as const };
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });

  const json = subscription.toJSON();
  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: json.keys,
    }),
  });

  if (!response.ok) {
    return { ok: false as const, reason: "subscribe_failed" as const };
  }

  return { ok: true as const };
}
