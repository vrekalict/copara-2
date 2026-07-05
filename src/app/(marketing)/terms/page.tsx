import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  TERMS_INTRO,
  TERMS_PREAMBLE,
  TERMS_SECTIONS,
} from "@/content/legal/terms.en";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/config";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description:
    "Copara Terms and Conditions: account use, co-parenting records, AI limitations, subscriptions, Quebec language rights, and disclaimers.",
  path: "/terms",
  languageAlternates: { en: "/terms", fr: "/fr/conditions" },
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Terms and Conditions",
          "/terms",
          "Copara terms of service for Canadian co-parenting users.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-3xl px-1">
          <LegalPageContent
            title="Terms and Conditions"
            lastUpdated={`Last updated: ${LEGAL_LAST_UPDATED}`}
            intro={TERMS_INTRO}
            preamble={TERMS_PREAMBLE}
            sections={TERMS_SECTIONS}
          />
        </div>
      </Section>
    </>
  );
}
