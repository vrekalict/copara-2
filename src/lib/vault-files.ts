import { isAllowedAttachment } from "@/lib/attachments";

export const VAULT_FILE_BUCKET = "vault-files";

export function vaultFileStoragePath(circleId: string, file: File) {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const id = crypto.randomUUID();
  return `${circleId}/${id}.${ext}`;
}

export function isAllowedVaultFile(file: File) {
  return isAllowedAttachment(file);
}

export function isValidVaultFilePath(path: string, circleId: string) {
  return path.startsWith(`${circleId}/`) && !path.includes("..");
}

export function formatEmergencyContacts(
  contacts: { name?: string; phone?: string }[] | null | undefined,
) {
  if (!contacts?.length) return "";
  return contacts
    .map((c) => [c.name ?? "", c.phone ?? ""].filter(Boolean).join(", "))
    .join("\n");
}

export function parseEmergencyContacts(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const comma = line.indexOf(",");
      if (comma === -1) return { name: line, phone: "" };
      return {
        name: line.slice(0, comma).trim(),
        phone: line.slice(comma + 1).trim(),
      };
    });
}
