"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ALBUM_PHOTOS_BUCKET } from "@/lib/album-photos";
import { createClient } from "@/lib/supabase/client";

export function AlbumCoverThumb({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    const supabase = createClient();
    let cancelled = false;

    void supabase.storage
      .from(ALBUM_PHOTOS_BUCKET)
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!path || !url) {
    return <div className="aspect-[4/3] rounded-lg bg-muted" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
  );
}

export function AlbumsListView({
  albums,
}: {
  albums: {
    id: string;
    title: string;
    updated_at: string;
    photo_count: number;
    cover_path: string | null;
  }[];
}) {
  const t = useTranslations("albums");

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {albums.map((album) => (
        <li key={album.id}>
          <Link
            href={`/app/albums/${album.id}`}
            className="block overflow-hidden rounded-xl border border-border hover:bg-muted/30"
          >
            <AlbumCoverThumb path={album.cover_path} />
            <div className="p-3">
              <p className="font-medium">{album.title}</p>
              <p className="text-sm text-muted-foreground">
                {t("photoCount", { count: album.photo_count })} ·{" "}
                {new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  day: "numeric",
                }).format(new Date(album.updated_at))}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
