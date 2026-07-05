export const JOURNAL_MEDIA_BUCKET = "journal-media";
export const MAX_JOURNAL_MEDIA_BYTES = 25 * 1024 * 1024;

const ALLOWED_JOURNAL_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
]);

export type JournalMediaItem = {
  path: string;
  mime: string;
};

export function journalMediaStoragePath(circleId: string, file: File) {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const id = crypto.randomUUID();
  return `${circleId}/${id}.${ext}`;
}

export function isAllowedJournalMedia(file: File) {
  if (file.size > MAX_JOURNAL_MEDIA_BYTES) {
    return { ok: false as const, reason: "too_large" as const };
  }
  if (!ALLOWED_JOURNAL_MIMES.has(file.type) && !file.type.startsWith("image/")) {
    return { ok: false as const, reason: "type" as const };
  }
  return { ok: true as const };
}

export function isValidJournalMediaPath(path: string, circleId: string) {
  return path.startsWith(`${circleId}/`) && !path.includes("..");
}

export function parseJournalMediaPaths(raw: string): JournalMediaItem[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is JournalMediaItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as JournalMediaItem).path === "string" &&
        typeof (item as JournalMediaItem).mime === "string",
    );
  } catch {
    return [];
  }
}
