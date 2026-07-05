"use client";

import { useEffect, useState } from "react";
import { JOURNAL_MEDIA_BUCKET } from "@/lib/journal-media";
import { createClient } from "@/lib/supabase/client";

function isVideo(mime: string) {
  return mime.startsWith("video/");
}

export function JournalMediaGrid({
  items,
}: {
  items: { id: string; file_path: string; mime: string }[];
}) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) return;
    const supabase = createClient();
    let cancelled = false;

    void (async () => {
      const next: Record<string, string> = {};
      for (const item of items) {
        const { data } = await supabase.storage
          .from(JOURNAL_MEDIA_BUCKET)
          .createSignedUrl(item.file_path, 3600);
        if (data?.signedUrl) next[item.id] = data.signedUrl;
      }
      if (!cancelled) setUrls(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {items.map((item) => {
        const url = urls[item.id];
        if (!url) {
          return (
            <div
              key={item.id}
              className="aspect-square rounded-md bg-muted"
            />
          );
        }
        if (isVideo(item.mime)) {
          return (
            <video
              key={item.id}
              src={url}
              controls
              className="aspect-square rounded-md object-cover"
            />
          );
        }
        return (
          <a key={item.id} href={url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="aspect-square rounded-md object-cover"
            />
          </a>
        );
      })}
    </div>
  );
}
