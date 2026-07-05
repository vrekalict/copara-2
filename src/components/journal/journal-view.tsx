"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { createJournalEntry, deleteJournalEntry } from "@/actions/journal";
import { createClient } from "@/lib/supabase/client";
import {
  JOURNAL_MEDIA_BUCKET,
  isAllowedJournalMedia,
  journalMediaStoragePath,
  type JournalMediaItem,
} from "@/lib/journal-media";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { JournalMediaGrid } from "@/components/journal/journal-media-grid";

type EntryRow = {
  id: string;
  body: string;
  created_at: string;
  created_by: string;
  child_id: string | null;
  journal_media: { id: string; file_path: string; mime: string }[];
};

type Child = { id: string; first_name: string };

type ActionState = { error?: string; success?: boolean } | null;

function formatWhen(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function JournalView({
  circleId,
  entries,
  children,
  authorNames,
  currentUserId,
}: {
  circleId: string;
  entries: EntryRow[];
  children: Child[];
  authorNames: Record<string, string>;
  currentUserId: string;
}) {
  const t = useTranslations("journal");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingMedia, setPendingMedia] = useState<JournalMediaItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [createState, createAction, createPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await createJournalEntry(formData)) ?? null;
      if (result?.success) {
        setPendingMedia([]);
        setUploadError(null);
      }
      return result;
    },
    null,
  );

  const [, deleteAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await deleteJournalEntry(formData);
      return null;
    },
    null,
  );

  async function handleMediaSelect(files: FileList | null) {
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);

    const supabase = createClient();
    const uploaded: JournalMediaItem[] = [];

    try {
      for (const file of Array.from(files)) {
        const allowed = isAllowedJournalMedia(file);
        if (!allowed.ok) {
          setUploadError(
            allowed.reason === "too_large" ? t("mediaTooLarge") : t("mediaType"),
          );
          continue;
        }

        const path = journalMediaStoragePath(circleId, file);
        const { error } = await supabase.storage
          .from(JOURNAL_MEDIA_BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });

        if (error) {
          setUploadError(error.message);
          continue;
        }

        uploaded.push({ path, mime: file.type });
      }

      if (uploaded.length > 0) {
        setPendingMedia((prev) => [...prev, ...uploaded]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const childName = (id: string | null) =>
    children.find((c) => c.id === id)?.first_name ?? null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div>
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <section className="flex flex-col gap-3">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => {
            const media = Array.isArray(entry.journal_media)
              ? entry.journal_media
              : [];
            const author = authorNames[entry.created_by] ?? t("unknownAuthor");
            const child = childName(entry.child_id);

            return (
              <li key={entry.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-primary">
                    {author} · {formatWhen(entry.created_at)}
                    {child && ` · ${child}`}
                  </p>
                  {entry.created_by === currentUserId && (
                    <form action={deleteAction}>
                      <input type="hidden" name="entryId" value={entry.id} />
                      <Button type="submit" size="sm" variant="ghost" className="h-7 px-2 text-xs">
                        {t("delete")}
                      </Button>
                    </form>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{entry.body}</p>
                <JournalMediaGrid items={media} />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-border p-4">
        <h2 className="mb-3 font-medium">{t("newEntry")}</h2>
        <form action={createAction} className="flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <input
            type="hidden"
            name="mediaPaths"
            value={JSON.stringify(pendingMedia)}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="body">{t("entryBody")}</Label>
            <textarea
              id="body"
              name="body"
              rows={4}
              required
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder={t("entryPlaceholder")}
            />
          </div>

          {children.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="childId">{t("child")}</Label>
              <select
                id="childId"
                name="childId"
                className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option value="">{t("noChild")}</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.first_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="journal-media">{t("addMedia")}</Label>
            <input
              ref={fileInputRef}
              id="journal-media"
              type="file"
              accept="image/*,video/mp4,video/quicktime"
              multiple
              className="text-sm"
              onChange={(e) => void handleMediaSelect(e.target.files)}
              disabled={uploading}
            />
            {pendingMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {pendingMedia.map((item) => (
                  <span key={item.path} className="rounded bg-muted px-2 py-1">
                    {item.path.split("/").pop()}
                    <button
                      type="button"
                      className="ml-1 inline-flex"
                      onClick={() =>
                        setPendingMedia((prev) =>
                          prev.filter((m) => m.path !== item.path),
                        )
                      }
                      aria-label={t("removeMedia")}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>

          {createState?.error && (
            <p className="text-sm text-destructive">{createState.error}</p>
          )}
          {createState?.success && (
            <p className="text-sm text-green-600">{t("saved")}</p>
          )}

          <Button type="submit" disabled={createPending || uploading}>
            {createPending ? t("posting") : t("postEntry")}
          </Button>
        </form>
      </section>
    </div>
  );
}
