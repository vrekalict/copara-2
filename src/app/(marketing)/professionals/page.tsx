import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { ExportsMockup } from "@/components/marketing/mockups/app-mockups";
import { Section, SectionHeader } from "@/components/marketing/section";
import { FAQ_PROFESSIONALS } from "@/content/marketing/faq";
import { pageMetadata } from "@/lib/marketing/metadata";
import { faqSchema, professionalServiceSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "For mediators, family lawyers, and parenting coordinators",
  description:
    "Copara design partner access for legal and mediation professionals: read-only circle access, dispute summaries, organized exports, and dual-parent invites. Free during early access.",
  path: "/professionals",
});

export default function ProfessionalsPage() {
  return (
    <>
      <JsonLd data={[professionalServiceSchema(), faqSchema(FAQ_PROFESSIONALS)]} />
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Design partner program"
          title="A clearer record for the professionals families already trust"
          description="Copara helps mediators, family lawyers, and parenting coordinators spend less time sorting screenshots and more time on substance, with organized tamper-evident records parents control."
          primaryHref="/early-access?role=professional"
          primaryLabel="Apply as a design partner"
          visual={<ExportsMockup variant="desktop" />}
        />
      </Section>

      <Section variant="cream">
        <SectionHeader title="What design partners get" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: "Dual-parent onboarding",
              body: "One invite link brings both parents into the same circle. That reduces the two-sided adoption problem common in every case.",
            },
            {
              title: "Read-only visibility",
              body: "View threads, calendar, and expenses parents choose to share. You cannot message as a parent or alter records.",
            },
            {
              title: "Dispute summaries",
              body: "Generate topic or date-range summaries with citations back to original messages. Clearly marked as AI-assisted, not legal advice.",
            },
            {
              title: "Organized exports",
              body: "PDF exports with hash-chain verification. Suitable for review, not certified or court-approved.",
            },
          ].map((item) => (
            <article key={item.title} className="routine-panel">
              <h2 className="text-lg font-semibold text-slate-heading">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Professional FAQ" align="left" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={FAQ_PROFESSIONALS} />
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/blog/records-mediators-want-to-see" className="font-semibold text-primary hover:underline">
            Read: records mediators want to see first
          </Link>
        </p>
      </Section>

      <Section variant="mist" className="pb-20">
        <CtaBand
          title="Join the design partner program"
          description="Free during early access. Help us build a professional workflow that matches how you actually practice."
          primaryHref="/early-access?role=professional"
          primaryLabel="Apply as a design partner"
        />
      </Section>
    </>
  );
}
