export type AnalyticsEvent =
  | "pwa_prompt_shown"
  | "pwa_prompt_accepted"
  | "pwa_prompt_dismissed"
  | "pwa_installed"
  | "export_created"
  | "summary_generated";

export async function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
    });
  } catch {
    // Analytics must never block UX.
  }
}
