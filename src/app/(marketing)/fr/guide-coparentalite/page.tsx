import { CoparentingGuideContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  GUIDE_CLOSING,
  GUIDE_INTRO,
  GUIDE_RULES,
} from "@/content/marketing/coparenting-guide.fr";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Guide de coparentalité",
  description:
    "Dix règles pratiques pour une coparentalité saine au Canada : communication, limites, sécurité et outils qui évitent de mettre les enfants au milieu.",
  path: "/fr/guide-coparentalite",
});

export default function FrenchCoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Guide de coparentalité",
          "/fr/guide-coparentalite",
          "Dix règles pour une coparentalité saine pour les parents séparés au Canada.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl px-1">
          <CoparentingGuideContent
            intro={GUIDE_INTRO}
            rules={GUIDE_RULES}
            closing={GUIDE_CLOSING}
            langSwitch={{ label: "English version", href: "/coparenting-guide" }}
            disclaimer="Copara ne fournit pas de conseils juridiques. Ce guide est une information générale pour les parents, et ne remplace pas le counselling, la médiation ou un avis juridique."
          />
        </div>
      </Section>
    </>
  );
}
