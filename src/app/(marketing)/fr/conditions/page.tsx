import Link from "next/link";
import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  TERMS_INTRO,
  TERMS_PREAMBLE,
  TERMS_SECTIONS,
} from "@/content/legal/terms.fr";
import { LEGAL_LAST_UPDATED_FR, LEGAL_LINKS } from "@/lib/legal/config";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Conditions d'utilisation",
  description:
    "Conditions d'utilisation de Copara : compte, dossiers de coparentalité, fonctionnalités d'IA, abonnements et droits des consommateurs québécois.",
  path: "/fr/conditions",
  locale: "fr",
  languageAlternates: { en: "/terms", fr: "/fr/conditions" },
});

export default function FrenchTermsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Conditions d'utilisation",
          "/fr/conditions",
          "Conditions d'utilisation de Copara pour les utilisateurs canadiens.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-3xl px-1">
          <p className="mb-6 text-sm text-muted-foreground">
            <Link href={LEGAL_LINKS.termsEn} className="text-primary underline-offset-4 hover:underline">
              English version
            </Link>
            {" · "}
            <Link href={LEGAL_LINKS.hub} className="text-primary underline-offset-4 hover:underline">
              Documents juridiques
            </Link>
          </p>
          <LegalPageContent
            title="Conditions d'utilisation"
            lastUpdated={`Dernière mise à jour : ${LEGAL_LAST_UPDATED_FR}`}
            intro={TERMS_INTRO}
            preamble={TERMS_PREAMBLE}
            sections={TERMS_SECTIONS}
          />
        </div>
      </Section>
    </>
  );
}
