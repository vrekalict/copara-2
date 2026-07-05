import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  PRIVACY_INTRO,
  PRIVACY_PREAMBLE,
  PRIVACY_SECTIONS,
} from "@/content/legal/privacy.en";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/config";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Copara Privacy Policy: personal information, AI processing, Law 25 rights, cross-border transfers, and security for Canadian co-parenting users.",
  path: "/privacy",
  languageAlternates: { en: "/privacy", fr: "/fr/confidentialite" },
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Privacy Policy",
          "/privacy",
          "Copara privacy policy for co-parenting data.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-3xl px-1">
          <LegalPageContent
            title="Privacy Policy"
            lastUpdated={`Last updated: ${LEGAL_LAST_UPDATED}`}
            intro={PRIVACY_INTRO}
            preamble={PRIVACY_PREAMBLE}
            sections={PRIVACY_SECTIONS}
          />
        </div>
      </Section>
    </>
  );
}
