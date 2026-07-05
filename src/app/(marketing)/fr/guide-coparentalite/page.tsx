import { CoparentingGuidePageContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import {
  GUIDE_CLOSING,
  GUIDE_HIGHLIGHTS,
  GUIDE_INTRO,
  GUIDE_MISTAKES,
  GUIDE_QUICK_WINS,
  GUIDE_SECTIONS,
} from "@/content/marketing/coparenting-guide.fr";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Guide de coparentalité",
  description:
    "Guide pratique pour parents séparés au Canada : calendriers partagés, messages documentés, dépenses, coffre-fort documentaire, exportations et habitudes qui protègent les enfants.",
  path: "/fr/guide-coparentalite",
});

export default function FrenchCoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Guide de coparentalité",
          "/fr/guide-coparentalite",
          "Guide pratique de coparentalité pour les parents séparés au Canada.",
        )}
      />
      <CoparentingGuidePageContent
        intro={GUIDE_INTRO}
        highlights={GUIDE_HIGHLIGHTS}
        quickWins={GUIDE_QUICK_WINS}
        sections={GUIDE_SECTIONS}
        mistakes={GUIDE_MISTAKES}
        closing={GUIDE_CLOSING}
        langSwitch={{ label: "English version", href: "/coparenting-guide" }}
        quickWinsTitle="Commencez ici : cinq actions rapides"
        mistakesTitle="Erreurs fréquentes à éviter"
        tocTitle="Dans ce guide"
        checklistTitle="Quoi faire"
        disclaimer="Copara ne fournit pas de conseils juridiques. Ce guide est une information générale pour les parents, et ne remplace pas le counselling, la médiation ou un avis juridique."
      />
    </>
  );
}
