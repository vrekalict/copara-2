import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import {
  FAQ_AI,
  FAQ_ALL,
  FAQ_GENERAL,
  FAQ_PRICING,
  FAQ_PRIVACY,
  FAQ_RECORDS,
} from "@/content/marketing/faq";
import { pageMetadata } from "@/lib/marketing/metadata";
import { faqSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "Answers about Copara: co-parenting messaging, AI Steady Send, tamper-evident exports, pricing in CAD, privacy, and professional access for mediators and lawyers.",
  path: "/faq",
});

function FaqGroup({ title, items }: { title: string; items: typeof FAQ_GENERAL }) {
  return (
    <div className="mb-12">
      <h2 className="mb-4 text-xl font-semibold text-slate-heading">{title}</h2>
      <FaqAccordion items={items} />
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ_ALL)} />
      <PageHero
        title="Frequently asked questions"
        description="Clear answers about Copara for parents and professionals. Not legal advice."
      />
      <Section variant="cream" className="pt-0 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <FaqGroup title="General" items={FAQ_GENERAL} />
          <FaqGroup title="AI & Steady Send" items={FAQ_AI} />
          <FaqGroup title="Records & exports" items={FAQ_RECORDS} />
          <FaqGroup title="Privacy & location" items={FAQ_PRIVACY} />
          <FaqGroup title="Pricing" items={FAQ_PRICING} />
        </div>
      </Section>
    </>
  );
}
