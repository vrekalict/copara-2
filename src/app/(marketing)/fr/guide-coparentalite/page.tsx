import { CoparentingGuideContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  GUIDE_CLOSING,
  GUIDE_INTRO,
  GUIDE_SECTIONS,
} from "@/content/marketing/coparenting-guide.fr";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Guide de coparentalité",
  description:
    "Comment les parents séparés au Canada réduisent les conflits grâce à des calendriers partagés, des messages documentés, des dossiers de dépenses et une information organisée sur l'enfant.",
  path: "/fr/guide-coparentalite",
});

export default function FrenchCoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Guide de coparentalité",
          "/fr/guide-coparentalite",
          "Guide de coparentalité organisée pour les parents séparés au Canada.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl px-1">
          <CoparentingGuideContent
            intro={GUIDE_INTRO}
            sections={GUIDE_SECTIONS}
            closing={GUIDE_CLOSING}
            langSwitch={{ label: "English version", href: "/coparenting-guide" }}
            disclaimer="Copara ne fournit pas de conseils juridiques. Ce guide est une information générale pour les parents, et ne remplace pas le counselling, la médiation ou un avis juridique."
          />
        </div>
      </Section>
    </>
  );
}
