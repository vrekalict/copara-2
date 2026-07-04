export const MESSAGE_ATTACHMENT_BUCKET = "message-attachments";
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type MessageAttachment = {
  id: string;
  name: string;
  mime: string;
  path: string;
  size: number;
};

export function isAllowedAttachment(file: File) {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { ok: false as const, reason: "too_large" as const };
  }
  if (!ALLOWED_ATTACHMENT_MIMES.has(file.type)) {
    return { ok: false as const, reason: "type" as const };
  }
  return { ok: true as const };
}

export function attachmentStoragePath(
  circleId: string,
  threadId: string,
  file: File,
) {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const id = crypto.randomUUID();
  return {
    id,
    path: `${circleId}/${threadId}/${id}.${ext}`,
  };
}

export function parseAttachments(value: unknown): MessageAttachment[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is MessageAttachment =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as MessageAttachment).id === "string" &&
      typeof (item as MessageAttachment).path === "string",
  );
}
