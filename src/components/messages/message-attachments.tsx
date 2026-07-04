"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MESSAGE_ATTACHMENT_BUCKET,
  type MessageAttachment,
} from "@/lib/attachments";

function isImage(mime: string) {
  return mime.startsWith("image/");
}

export function MessageAttachments({
  attachments,
}: {
  attachments: MessageAttachment[];
}) {
  const t = useTranslations("messages");
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (attachments.length === 0) return;

    const supabase = createClient();
    let cancelled = false;

    void (async () => {
      const next: Record<string, string> = {};
      for (const attachment of attachments) {
        const { data } = await supabase.storage
          .from(MESSAGE_ATTACHMENT_BUCKET)
          .createSignedUrl(attachment.path, 3600);
        if (data?.signedUrl) next[attachment.id] = data.signedUrl;
      }
      if (!cancelled) setUrls(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [attachments]);

  if (attachments.length === 0) return null;

  return (
    <div className="mt-1 flex flex-col gap-1">
      {attachments.map((attachment) => {
        const url = urls[attachment.id];
        if (isImage(attachment.mime) && url) {
          return (
            <a key={attachment.id} href={url} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={attachment.name}
                className="max-h-40 rounded-lg object-cover"
              />
            </a>
          );
        }

        return (
          <a
            key={attachment.id}
            href={url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs underline"
          >
            <FileText className="size-3" />
            {attachment.name || t("attachment")}
          </a>
        );
      })}
    </div>
  );
}
