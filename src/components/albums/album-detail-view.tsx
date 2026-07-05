"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { addAlbumPhoto, deleteAlbum, deleteAlbumPhoto } from "@/actions/albums";
import { createClient } from "@/lib/supabase/client";
import {
  ALBUM_PHOTOS_BUCKET,
  albumPhotoStoragePath,
  isAllowedAlbumPhoto,
} from "@/lib/album-photos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PhotoRow = {
  id: string;
  file_path: string;
  mime: string;
  caption: string | null;
};

type ActionState = { error?: string; success?: boolean } | null;

function AlbumPhotoItem({
  photo,
  albumId,
  deletePhotoAction,
}: {
  photo: PhotoRow;
  albumId: string;
  deletePhotoAction: (payload: FormData) => void;
}) {
  const t = useTranslations("albums");
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.storage
      .from(ALBUM_PHOTOS_BUCKET)
      .createSignedUrl(photo.file_path, 3600)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [photo.file_path]);

  return (
    <div className="flex flex-col gap-1">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" download>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={photo.caption ?? ""}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </a>
      ) : (
        <div className="aspect-square rounded-lg bg-muted" />
      )}
      {photo.caption && (
        <p className="text-xs text-muted-foreground">{photo.caption}</p>
      )}
      <form action={deletePhotoAction}>
        <input type="hidden" name="photoId" value={photo.id} />
        <input type="hidden" name="albumId" value={albumId} />
        <Button type="submit" size="sm" variant="ghost" className="h-7 px-0 text-xs">
          {t("removePhoto")}
        </Button>
      </form>
    </div>
  );
}

export function AlbumDetailView({
  circleId,
  albumId,
  title,
  photos,
}: {
  circleId: string;
  albumId: string;
  title: string;
  photos: PhotoRow[];
}) {
  const t = useTranslations("albums");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [photoState, photoAction, photoPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await addAlbumPhoto(formData)) ?? null;
      if (result?.success) {
        setFilePath(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      return result;
    },
    null,
  );

  const [, deletePhotoAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await deleteAlbumPhoto(formData);
      return null;
    },
    null,
  );

  const [, deleteAlbumAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await deleteAlbum(formData);
      return null;
    },
    null,
  );

  async function handleFileSelect(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setUploadError(null);
    setUploading(true);

    const allowed = isAllowedAlbumPhoto(file);
    if (!allowed.ok) {
      setUploadError(
        allowed.reason === "too_large" ? t("photoTooLarge") : t("photoType"),
      );
      setUploading(false);
      return;
    }

    try {
      const path = albumPhotoStoragePath(circleId, albumId, file);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(ALBUM_PHOTOS_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadError(error.message);
        setFilePath(null);
        return;
      }

      setFilePath(path);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href="/app/albums" className="text-sm text-primary underline-offset-4 hover:underline">
            {t("backToAlbums")}
          </Link>
          <h1 className="mt-2 text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("photoCount", { count: photos.length })}
          </p>
        </div>
        <form action={deleteAlbumAction}>
          <input type="hidden" name="albumId" value={albumId} />
          <Button type="submit" size="sm" variant="outline">
            {t("deleteAlbum")}
          </Button>
        </form>
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("emptyAlbum")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <AlbumPhotoItem
              key={photo.id}
              photo={photo}
              albumId={albumId}
              deletePhotoAction={deletePhotoAction}
            />
          ))}
        </div>
      )}

      <section className="rounded-xl border border-border p-4">
        <h2 className="mb-3 font-medium">{t("addPhoto")}</h2>
        <form action={photoAction} className="flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <input type="hidden" name="albumId" value={albumId} />
          <input type="hidden" name="filePath" value={filePath ?? ""} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="photo-file">{t("photoFile")}</Label>
            <input
              ref={fileInputRef}
              id="photo-file"
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => void handleFileSelect(e.target.files)}
              disabled={uploading}
            />
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="caption">{t("caption")}</Label>
            <Input id="caption" name="caption" />
          </div>

          {photoState?.error && (
            <p className="text-sm text-destructive">{photoState.error}</p>
          )}
          {photoState?.success && (
            <p className="text-sm text-green-600">{t("photoAdded")}</p>
          )}

          <Button
            type="submit"
            disabled={photoPending || uploading || !filePath}
            className="self-start"
          >
            {photoPending ? t("uploading") : t("uploadPhoto")}
          </Button>
        </form>
      </section>
    </div>
  );
}
