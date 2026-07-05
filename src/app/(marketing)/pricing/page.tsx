import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Section, SectionHeader } from "@/components/marketing/section";
import { FAQ_PRICING_PAGE } from "@/content/marketing/faq";
import { pageMetadata } from "@/lib/marketing/metadata";
import { faqSchema, pricingProductSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Pricing in CAD",
  description:
    "Simple CAD pricing for Copara: parent monthly and yearly plans, family circle subscriptions, and free design partner access for professionals during early access.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[pricingProductSchema(), faqSchema(FAQ_PRICING_PAGE)]} />
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Pricing"
          title="Simple plans in Canadian dollars"
          description="Co-parenting tools should not cost hundreds per year. Copara is intentionally affordable, priced below many established co-parenting tools, with exports included during early access."
        />
        <div className="mt-10">
          <PricingPlans />
        </div>
      </Section>
      <Section variant="cream" className="pb-20">
        <SectionHeader title="Pricing questions" align="left" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={FAQ_PRICING_PAGE} />
        </div>
      </Section>
    </>
  );
}
