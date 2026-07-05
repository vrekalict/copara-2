import { CoparentingGuideContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  GUIDE_CLOSING,
  GUIDE_INTRO,
  GUIDE_RULES,
} from "@/content/marketing/coparenting-guide.en";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Co-parenting guide",
  description:
    "Ten practical rules for healthy co-parenting in Canada: communication, boundaries, security, and tools that keep children out of the middle.",
  path: "/coparenting-guide",
});

export default function CoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Co-parenting guide",
          "/coparenting-guide",
          "Ten rules for healthy co-parenting for separated parents in Canada.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl px-1">
          <CoparentingGuideContent
            intro={GUIDE_INTRO}
            rules={GUIDE_RULES}
            closing={GUIDE_CLOSING}
            langSwitch={{ label: "Version française", href: "/fr/guide-coparentalite" }}
          />
        </div>
      </Section>
    </>
  );
}
