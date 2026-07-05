import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/app-shell/top-bar";
import { BottomNav } from "@/components/app-shell/bottom-nav";
import { SkipLink } from "@/components/app-shell/skip-link";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineMessageFlusher } from "@/components/messages/offline-message-flusher";

async function getEngagement(userId: string) {
  const supabase = await createClient();

  const { count: messageCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", userId);

  const { data: settings } = await supabase
    .from("user_settings")
    .select("pwa_prompt_snoozed_until")
    .eq("user_id", userId)
    .maybeSingle();

  const sentMessage = (messageCount ?? 0) >= 1;
  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("id", userId)
    .single();

  const accountAge = profile?.created_at
    ? Date.now() - new Date(profile.created_at as string).getTime()
    : 0;
  const secondSession = accountAge > 24 * 60 * 60 * 1000;

  return {
    engaged: sentMessage || secondSession,
    snoozedUntil: (settings?.pwa_prompt_snoozed_until as string | null) ?? null,
  };
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: memberships } = await supabase
    .from("circle_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!memberships || memberships.length === 0) {
    redirect("/onboarding/circle");
  }

  const isProOnly = memberships.every((m) => m.role === "professional");
  if (isProOnly) {
    redirect("/pro");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? user.email ?? "Member";
  const { engaged, snoozedUntil } = await getEngagement(user.id);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SkipLink />
      <OfflineMessageFlusher />
      <TopBar displayName={displayName} />
      <main id="main-content" className="flex-1 overflow-y-auto pb-16">{children}</main>
      <BottomNav />
      <InstallPrompt engaged={engaged} snoozedUntil={snoozedUntil} />
    </div>
  );
}
