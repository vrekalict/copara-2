export const ALBUM_PHOTOS_BUCKET = "album-photos";
export const MAX_ALBUM_PHOTO_BYTES = 25 * 1024 * 1024;

const ALLOWED_ALBUM_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function albumPhotoStoragePath(circleId: string, albumId: string, file: File) {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const id = crypto.randomUUID();
  return `${circleId}/${albumId}/${id}.${ext}`;
}

export function isAllowedAlbumPhoto(file: File) {
  if (file.size > MAX_ALBUM_PHOTO_BYTES) {
    return { ok: false as const, reason: "too_large" as const };
  }
  if (!ALLOWED_ALBUM_MIMES.has(file.type) && !file.type.startsWith("image/")) {
    return { ok: false as const, reason: "type" as const };
  }
  return { ok: true as const };
}

export function isValidAlbumPhotoPath(path: string, circleId: string, albumId: string) {
  return path.startsWith(`${circleId}/${albumId}/`) && !path.includes("..");
}
