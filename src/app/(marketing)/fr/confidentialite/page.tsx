import Link from "next/link";
import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section } from "@/components/marketing/section";
import {
  PRIVACY_INTRO,
  PRIVACY_PREAMBLE,
  PRIVACY_SECTIONS,
} from "@/content/legal/privacy.fr";
import { LEGAL_LAST_UPDATED_FR, LEGAL_LINKS } from "@/lib/legal/config";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de Copara : renseignements personnels, traitement par IA, droits en vertu de la Loi 25 et sécurité pour les utilisateurs canadiens.",
  path: "/fr/confidentialite",
  locale: "fr",
  languageAlternates: { en: "/privacy", fr: "/fr/confidentialite" },
});

export default function FrenchPrivacyPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Politique de confidentialité",
          "/fr/confidentialite",
          "Politique de confidentialité de Copara pour les données de coparentalité.",
        )}
      />
      <Section className="pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-3xl px-1">
          <p className="mb-6 text-sm text-muted-foreground">
            <Link href={LEGAL_LINKS.privacyEn} className="text-primary underline-offset-4 hover:underline">
              English version
            </Link>
            {" · "}
            <Link href={LEGAL_LINKS.hub} className="text-primary underline-offset-4 hover:underline">
              Documents juridiques
            </Link>
          </p>
          <LegalPageContent
            title="Politique de confidentialité"
            lastUpdated={`Dernière mise à jour : ${LEGAL_LAST_UPDATED_FR}`}
            intro={PRIVACY_INTRO}
            preamble={PRIVACY_PREAMBLE}
            sections={PRIVACY_SECTIONS}
          />
        </div>
      </Section>
    </>
  );
}
