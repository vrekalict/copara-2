import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { LegalDisclaimer, PageHero } from "@/components/marketing/page-hero";
import { ExportsMockup } from "@/components/marketing/mockups/app-mockups";
import { Section, SectionHeader } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { SITE } from "@/lib/marketing/site";

export const metadata = pageMetadata({
  title: "Tamper-evident record exports",
  description:
    "Export Copara messages, schedules, and expenses as tamper-evident PDFs with hash-chain verification. Suitable for review by legal professionals. Not certified or court-approved.",
  path: "/features/records",
});

export default function RecordsPage() {
  return (
    <>
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Records and exports"
          title="Organized records you can verify, not just print"
          description={`${SITE.name} exports are tamper-evident records suitable for review by legal professionals. Each export includes server timestamps and a hash-chain verification digest. Copara does not claim exports are certified, court-approved, or guaranteed admissible.`}
          visual={<ExportsMockup variant="desktop" />}
        />
      </Section>
      <Section variant="cream">
        <SectionHeader title="What you can export" align="left" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            "Message threads by date range",
            "Expense history and reimbursement status",
            "Calendar events and parenting-time blocks",
            "Schedule change requests and decisions",
            "Exchange check-in logs (verification only, no raw GPS)",
            "Dispute summaries with message citations",
          ].map((item) => (
            <li key={item} className="routine-panel text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionHeader
          title="Hash-chain verification"
          description="Every message links to the previous one cryptographically. If content changes after export, verification fails."
        />
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--marketing-border)] bg-mist p-6 font-mono text-sm">
          <p className="text-muted-foreground">Public verification</p>
          <p className="mt-2 break-all text-foreground">copara.ca/verify/[export-id]</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Anyone with the export file can confirm integrity. Verification confirms the
            chain matches stored records. It does not determine legal validity or court
            acceptance.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <LegalDisclaimer />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No per-export fees during early access.{" "}
          <Link href="/pricing" className="font-medium text-primary hover:underline">
            See pricing
          </Link>
        </p>
      </Section>
      <Section variant="mist" className="pb-20">
        <CtaBand title="Export with confidence in early access" />
      </Section>
    </>
  );
}
