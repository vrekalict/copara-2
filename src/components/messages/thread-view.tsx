"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markThreadRead, searchThreadMessages } from "@/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

type Message = {
  id: string;
  body: string | null;
  sender_id: string;
  created_at: string;
};

type SendState = { error?: string; success?: boolean } | null;
type SearchState = { error?: string; results: Message[] } | null;

export function ThreadView({
  threadId,
  currentUserId,
  initialMessages,
}: {
  threadId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const t = useTranslations("messages");
  const [messages, setMessages] = useState(initialMessages);
  const [searchOpen, setSearchOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    markThreadRead(threadId);

    const supabase = createClient();
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const message = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
          markThreadRead(threadId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  const [sendState, sendAction, sendPending] = useActionState<SendState, FormData>(
    async (_prev, formData) => {
      const result = await sendMessage(formData);
      if (result?.success) formRef.current?.reset();
      return result ?? null;
    },
    null,
  );

  const [searchState, searchAction, searchPending] = useActionState<SearchState, FormData>(
    async (_prev, formData) => (await searchThreadMessages(formData)) ?? { results: [] },
    { results: [] },
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-end border-b border-border px-4 py-2">
        <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen((v) => !v)}>
          {searchOpen ? <X className="size-4" /> : <Search className="size-4" />}
        </Button>
      </div>

      {searchOpen && (
        <div className="flex flex-col gap-2 border-b border-border p-4">
          <form action={searchAction} className="flex gap-2">
            <input type="hidden" name="threadId" value={threadId} />
            <Input name="query" placeholder={t("searchPlaceholder")} required />
            <Button type="submit" disabled={searchPending}>
              {t("search")}
            </Button>
          </form>
          <ul className="flex flex-col gap-1">
            {(searchState?.results ?? []).map((m) => (
              <li key={m.id} className="rounded-md bg-muted px-2 py-1 text-sm">
                {m.body}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <li key={m.id} className={mine ? "self-end" : "self-start"}>
              <div
                className={
                  "max-w-xs rounded-2xl px-3 py-2 text-sm " +
                  (mine ? "bg-primary text-primary-foreground" : "bg-muted")
                }
              >
                {m.body}
              </div>
            </li>
          );
        })}
      </ul>

      <form ref={formRef} action={sendAction} className="flex gap-2 border-t border-border p-4">
        <input type="hidden" name="threadId" value={threadId} />
        <Input name="body" placeholder={t("typePlaceholder")} required autoComplete="off" />
        {sendState?.error && <p className="text-sm text-destructive">{sendState.error}</p>}
        <Button type="submit" disabled={sendPending}>
          {t("send")}
        </Button>
      </form>
    </div>
  );
}
