import { CoparentingGuideContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  GUIDE_CLOSING,
  GUIDE_INTRO,
  GUIDE_SECTIONS,
} from "@/content/marketing/coparenting-guide.en";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Co-parenting guide",
  description:
    "How Canadian separated parents reduce co-parenting conflict with shared calendars, documented messages, expense records, and organized child information.",
  path: "/coparenting-guide",
});

export default function CoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Co-parenting guide",
          "/coparenting-guide",
          "Organized co-parenting guide for separated parents in Canada.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl px-1">
          <CoparentingGuideContent
            intro={GUIDE_INTRO}
            sections={GUIDE_SECTIONS}
            closing={GUIDE_CLOSING}
            langSwitch={{ label: "Version française", href: "/fr/guide-coparentalite" }}
          />
        </div>
      </Section>
    </>
  );
}
