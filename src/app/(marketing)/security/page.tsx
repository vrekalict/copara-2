import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";
import { SITE } from "@/lib/marketing/site";

export const metadata = pageMetadata({
  title: "Security and records",
  description:
    "How Copara protects co-parenting records: append-only messages, hash-chain exports, row-level security, and privacy-conscious check-ins without raw GPS sharing.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Security and records",
          "/security",
          "Copara security overview for messages, exports, and location verification.",
        )}
      />
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Security"
          title="Built for sensitive family records"
          description={`${SITE.name} handles co-parenting information with clear limits on tracking, sharing, and export claims.`}
        />
      </Section>
      <Section variant="cream" className="pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="routine-panel">
            <h2 className="text-xl font-semibold text-slate-heading">Message integrity</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Messages are append-only. No edit or delete after send.</li>
              <li>Server-side timestamps for sent, delivered, and read receipts</li>
              <li>SHA-256 hash chain links each message to the previous one</li>
              <li>Exports include verification digest and public check URL</li>
            </ul>
          </article>
          <article className="routine-panel">
            <h2 className="text-xl font-semibold text-slate-heading">Access control</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Row-level security restricts data to circle members</li>
              <li>Professionals receive read-only access only when parents permit</li>
              <li>Parents control vault sharing and professional connections</li>
              <li>Authentication via Supabase Auth with secure session handling</li>
            </ul>
          </article>
          <article className="routine-panel">
            <h2 className="text-xl font-semibold text-slate-heading">Location and check-ins</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>No continuous GPS tracking between parents</li>
              <li>Check-ins verify arrival with a boolean result, not a shared map pin</li>
              <li>Raw GPS coordinates are not visible to your co-parent</li>
              <li>Designed for exchange verification, not surveillance</li>
            </ul>
          </article>
          <article className="routine-panel">
            <h2 className="text-xl font-semibold text-slate-heading">What we do not claim</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Exports are not certified, notarized, or court-approved</li>
              <li>Verification confirms integrity, not legal admissibility</li>
              <li>{SITE.name} is not legal advice. Consult qualified professionals.</li>
              <li>
                See{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                for data handling details
              </li>
            </ul>
          </article>
        </div>
      </Section>
      <Section className="pb-20">
        <CtaBand
          title="Questions about security?"
          description="Read our FAQ or contact us directly."
          primaryHref="/faq"
          primaryLabel="View FAQ"
          secondaryHref="/contact"
          secondaryLabel="Contact us"
        />
      </Section>
    </>
  );
}
