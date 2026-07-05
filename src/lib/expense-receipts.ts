import { isAllowedAttachment } from "@/lib/attachments";

export const EXPENSE_RECEIPT_BUCKET = "expense-receipts";

export function expenseReceiptStoragePath(circleId: string, file: File) {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const id = crypto.randomUUID();
  return `${circleId}/${id}.${ext}`;
}

export function isAllowedReceipt(file: File) {
  return isAllowedAttachment(file);
}

export function isValidExpenseReceiptPath(path: string, circleId: string) {
  return path.startsWith(`${circleId}/`) && !path.includes("..");
}
