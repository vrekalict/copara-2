import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { StartConversationButton } from "@/components/messages/start-conversation-button";
import { MessageSquare } from "lucide-react";

type ThreadRow = {
  id: string;
  title: string | null;
  messages: { body: string | null; created_at: string; sender_id: string }[];
};

export default async function MessagesPage() {
  const t = await getTranslations("messages");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  const { data: threads } = await supabase
    .from("threads")
    .select("id, title, messages(body, created_at, sender_id)")
    .order("created_at", { referencedTable: "messages", ascending: false })
    .limit(1, { referencedTable: "messages" })
    .returns<ThreadRow[]>();

  const sorted = [...(threads ?? [])].sort((a, b) => {
    const aTime = a.messages[0]?.created_at ?? "";
    const bTime = b.messages[0]?.created_at ?? "";
    return bTime.localeCompare(aTime);
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">{t("title")}</h1>

      {sorted.length === 0 && membership ? (
        <EmptyState
          icon={MessageSquare}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={<StartConversationButton circleId={membership.circle_id} />}
        />
      ) : (
        sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )
      )}

      <ul className="flex flex-col divide-y divide-border">
        {sorted.map((thread) => (
          <li key={thread.id}>
            <Link
              href={`/app/messages/${thread.id}`}
              className="flex flex-col gap-0.5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <span className="font-medium">{thread.title ?? t("untitled")}</span>
              <span className="truncate text-sm text-muted-foreground">
                {thread.messages[0]?.body ?? t("noMessagesYet")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
