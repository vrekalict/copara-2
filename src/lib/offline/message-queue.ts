import type { MessageAttachment } from "@/lib/attachments";
import { BRAND } from "@/lib/brand";

export type QueuedMessage = {
  id: string;
  threadId: string;
  body: string;
  attachments: MessageAttachment[];
  queuedAt: string;
};

const DB_NAME = BRAND.offlineDbName;
const DB_VERSION = 1;
const STORE = "messages";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const request = fn(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

export async function enqueueMessage(
  message: Omit<QueuedMessage, "id" | "queuedAt">,
): Promise<QueuedMessage> {
  const entry: QueuedMessage = {
    ...message,
    id: crypto.randomUUID(),
    queuedAt: new Date().toISOString(),
  };
  await runTransaction("readwrite", (store) => store.add(entry));
  return entry;
}

export async function listQueuedMessages(threadId?: string): Promise<QueuedMessage[]> {
  const all = await runTransaction<QueuedMessage[]>("readonly", (store) => store.getAll());
  if (!threadId) return all;
  return all.filter((m) => m.threadId === threadId);
}

export async function removeQueuedMessage(id: string): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(id));
}

export async function countQueuedMessages(): Promise<number> {
  const all = await listQueuedMessages();
  return all.length;
}
