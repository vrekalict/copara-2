"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markThreadRead, searchThreadMessages } from "@/actions/messages";
import { enqueueMessage } from "@/lib/offline/message-queue";
import { OfflineQueueBanner } from "@/components/messages/offline-queue-banner";
import { useThreadTyping } from "@/components/messages/use-thread-typing";
import { TypingIndicator } from "@/components/messages/typing-indicator";
import {
  attachmentStoragePath,
  isAllowedAttachment,
  MESSAGE_ATTACHMENT_BUCKET,
  parseAttachments,
  type MessageAttachment,
} from "@/lib/attachments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageAttachments } from "@/components/messages/message-attachments";
import { ToneReviewBar } from "@/components/messages/tone-review-bar";
import { HashBadge } from "@/components/messages/hash-badge";
import { Paperclip, Search, X } from "lucide-react";

type Message = {
  id: string;
  body: string | null;
  sender_id: string;
  created_at: string;
  hash?: string;
  attachments?: unknown;
};

type SendState = { error?: string; success?: boolean; queued?: boolean } | null;
type SearchState = { error?: string; results: Message[] } | null;

export function ThreadView({
  threadId,
  circleId,
  locale,
  currentUserId,
  initialMessages,
  participantNames,
}: {
  threadId: string;
  circleId: string;
  locale: string;
  currentUserId: string;
  initialMessages: Message[];
  participantNames: Record<string, string>;
}) {
  const t = useTranslations("messages");
  const [messages, setMessages] = useState(initialMessages);
  const [searchOpen, setSearchOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [queuedLocal, setQueuedLocal] = useState<{ body: string; queuedAt: string }[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const bodyInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMessageInsert = useCallback(
    (row: unknown) => {
      const message = row as Message;
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
      markThreadRead(threadId);
    },
    [threadId],
  );

  const { typingUserIds, sendTypingStop } = useThreadTyping({
    threadId,
    currentUserId,
    draft,
    onMessageInsert: handleMessageInsert,
  });

  useEffect(() => {
    markThreadRead(threadId);
  }, [threadId]);

  const [sendState, sendAction, sendPending] = useActionState<SendState, FormData>(
    async (_prev, formData) => {
      const body = String(formData.get("body") ?? "").trim();
      const attachmentsRaw = String(formData.get("attachments") ?? "[]");
      let attachments: MessageAttachment[] = [];

      try {
        attachments = parseAttachments(JSON.parse(attachmentsRaw));
      } catch {
        return { error: "Invalid attachments." };
      }

      if (!navigator.onLine) {
        if (attachments.length > 0) {
          return { error: t("offlineNoAttachments") };
        }
        if (!body) {
          return { error: "Message can't be empty." };
        }

        await enqueueMessage({
          threadId,
          body,
          attachments: [],
        });

        setQueuedLocal((prev) => [
          ...prev,
          { body, queuedAt: new Date().toISOString() },
        ]);
        formRef.current?.reset();
        setDraft("");
        setPendingAttachments([]);
        setUploadError(null);
        sendTypingStop();
        return { success: true, queued: true };
      }

      const result = await sendMessage(formData);
      if (result?.success) {
        sendTypingStop();
        formRef.current?.reset();
        setDraft("");
        setPendingAttachments([]);
        setUploadError(null);
      }
      return result ?? null;
    },
    null,
  );

  const [searchState, searchAction, searchPending] = useActionState<SearchState, FormData>(
    async (_prev, formData) => (await searchThreadMessages(formData)) ?? { results: [] },
    { results: [] },
  );

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);

    const supabase = createClient();
    const uploaded: MessageAttachment[] = [];

    try {
      for (const file of Array.from(files)) {
        const allowed = isAllowedAttachment(file);
        if (!allowed.ok) {
          setUploadError(
            allowed.reason === "too_large" ? t("attachmentTooLarge") : t("attachmentType"),
          );
          continue;
        }

        const { id, path } = attachmentStoragePath(circleId, threadId, file);
        const { error } = await supabase.storage
          .from(MESSAGE_ATTACHMENT_BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });

        if (error) {
          setUploadError(error.message);
          continue;
        }

        uploaded.push({
          id,
          name: file.name,
          mime: file.type,
          path,
          size: file.size,
        });
      }

      if (uploaded.length > 0) {
        setPendingAttachments((prev) => [...prev, ...uploaded]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePendingAttachment(id: string) {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  useEffect(() => {
    function handleOnline() {
      setQueuedLocal([]);
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <OfflineQueueBanner threadId={threadId} />
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
        {queuedLocal.map((m, index) => (
          <li key={`queued-${index}`} className="self-end">
            <div className="max-w-xs rounded-2xl bg-primary/70 px-3 py-2 text-sm text-primary-foreground italic">
              {m.body}
            </div>
            <p className="mt-0.5 px-1 text-[10px] text-muted-foreground">{t("queuedPending")}</p>
          </li>
        ))}
        {messages.map((m, index) => {
          const mine = m.sender_id === currentUserId;
          const attachments = parseAttachments(m.attachments);
          return (
            <li key={m.id} className={mine ? "self-end" : "self-start"}>
              <div
                className={
                  "max-w-xs rounded-2xl px-3 py-2 text-sm " +
                  (mine ? "bg-primary text-primary-foreground" : "bg-muted")
                }
              >
                {m.body}
                <MessageAttachments attachments={attachments} />
              </div>
              {m.hash && (
                <div className="mt-0.5 px-1">
                  <HashBadge index={index} hash={m.hash} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ToneReviewBar
        draft={draft}
        threadId={threadId}
        locale={locale}
        onApplyRewrite={(rewrite) => {
          setDraft(rewrite);
          bodyInputRef.current?.focus();
        }}
      />

      <TypingIndicator
        typingUserIds={typingUserIds}
        participantNames={participantNames}
      />

      {pendingAttachments.length > 0 && (
        <ul className="flex flex-wrap gap-2 border-t border-border px-4 py-2 text-xs">
          {pendingAttachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-1"
            >
              <span className="max-w-[10rem] truncate">{attachment.name}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => removePendingAttachment(attachment.id)}
                aria-label={t("removeAttachment")}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} action={sendAction} className="flex flex-col gap-2 border-t border-border p-4">
        <input type="hidden" name="threadId" value={threadId} />
        <input
          type="hidden"
          name="attachments"
          value={JSON.stringify(pendingAttachments)}
          readOnly
        />
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={(e) => void handleFileSelect(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("attach")}
          >
            <Paperclip className="size-4" />
          </Button>
          <Input
            ref={bodyInputRef}
            name="body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("typePlaceholder")}
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={sendPending || uploading || (!draft.trim() && pendingAttachments.length === 0)}
          >
            {t("send")}
          </Button>
        </div>
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        {sendState?.error && <p className="text-sm text-destructive">{sendState.error}</p>}
      </form>
    </div>
  );
}
