"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createAlbum } from "@/actions/albums";
import { AlbumsListView } from "@/components/albums/albums-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AlbumSummary = {
  id: string;
  title: string;
  updated_at: string;
  photo_count: number;
  cover_path: string | null;
};

type ActionState = { error?: string; success?: boolean; albumId?: string } | null;

export function AlbumsView({
  circleId,
  albums,
}: {
  circleId: string;
  albums: AlbumSummary[];
}) {
  const t = useTranslations("albums");
  const router = useRouter();

  const [createState, createAction, createPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await createAlbum(formData)) ?? null;
      if (result?.success && result.albumId) {
        router.push(`/app/albums/${result.albumId}`);
      }
      return result;
    },
    null,
  );

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div>
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {albums.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <AlbumsListView albums={albums} />
      )}

      <section className="rounded-xl border border-border p-4">
        <h2 className="mb-3 font-medium">{t("newAlbum")}</h2>
        <form action={createAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="circleId" value={circleId} />
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="album-title">{t("albumTitle")}</Label>
            <Input id="album-title" name="title" required />
          </div>
          <Button type="submit" disabled={createPending}>
            {createPending ? t("creating") : t("createAlbum")}
          </Button>
        </form>
        {createState?.error && (
          <p className="mt-2 text-sm text-destructive">{createState.error}</p>
        )}
      </section>
    </div>
  );
}
