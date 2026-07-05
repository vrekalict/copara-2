import { createHash } from "crypto";

export type ChainRecord = {
  id: string;
  hash: string;
};

/** Aggregate digest over ordered message hashes for tamper-evident exports. */
export function computeChainDigest(records: ChainRecord[]): string {
  const payload = records.map((r) => r.hash).join("");
  return createHash("sha256").update(payload).digest("hex");
}

export function verifyChainDigest(
  records: ChainRecord[],
  expectedDigest: string,
): boolean {
  if (!expectedDigest || records.length === 0) return false;
  return computeChainDigest(records) === expectedDigest;
}
