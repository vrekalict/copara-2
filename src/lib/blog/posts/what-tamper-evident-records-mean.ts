import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "what-tamper-evident-records-mean",
  title: "What tamper-evident records mean (and what they do not mean)",
  excerpt:
    "Tamper-evident exports help professionals verify that a record matches the stored chain. That is different from certification, court approval, or legal advice.",
  category: "Records",
  publishedAt: "2026-07-01",
  featured: true,
  author: "Copara Editorial",
  seoDescription:
    "Plain-language explanation of Copara tamper-evident exports, hash-chain verification, and careful limits on legal claims.",
  body: `Families and professionals often ask whether Copara exports are "official" or "court-ready." The careful answer requires separating integrity from legal status.

## What tamper-evident means

In Copara, messages in a thread link together in a hash chain. When you export records, the PDF includes a verification digest. Anyone with the export can visit the public verification page to confirm the export matches the stored chain. If content were altered after export, verification would fail.

That is integrity checking: did this export change after it was generated?

## What it does not mean

Tamper-evident exports are suitable for review by legal professionals. They are not:
- Certified or notarized records
- Court-approved documents
- Guaranteed admissible in any proceeding
- Legal advice about what a judge will accept

Copara states those limits plainly because overclaiming erodes trust with both parents and professionals.

## Why integrity still matters

Mediators and lawyers often receive incomplete screenshots. A structured export with server timestamps and verification instructions saves time and reduces ambiguity about whether the text matches the source system.

## AI summaries are separate

Dispute summaries organize records by topic or date range with citations to message IDs. They are assistive and clearly marked as AI-generated. They are not substitutes for the underlying messages or for legal counsel.

## Questions for your professional

If you plan to share exports, ask your mediator or lawyer how they prefer records formatted and what else they need from you. Copara supports organization; your professional guides strategy.`,
};
