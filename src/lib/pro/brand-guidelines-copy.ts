import { BRAND } from "@/lib/brand";

export type BrandGuidelinesCopy = {
  title: string;
  subtitle: string;
  logoTitle: string;
  logoBody: string;
  logoDarkLabel: string;
  logoLightLabel: string;
  colorsTitle: string;
  colors: { name: string; hex: string; usage: string }[];
  usageDoTitle: string;
  usageDo: string[];
  usageDontTitle: string;
  usageDont: string[];
  cobrandTitle: string;
  cobrandBody: string;
  assetsTitle: string;
  assetsBody: string;
  contactTitle: string;
  contactBody: string;
  footer: string;
};

export function getBrandGuidelinesCopy(locale: string): BrandGuidelinesCopy {
  const email = BRAND.emails.hello;

  if (locale.startsWith("fr")) {
    return {
      title: "Guide de marque Copara",
      subtitle: "Utilisation du logo, couleurs et co-marque pour les partenaires.",
      logoTitle: "Variantes du logo",
      logoBody:
        "Utilisez le logo navy sur fond clair (sites web, dépliants, présentations). Utilisez le logo blanc sur fond navy ou foncé (pied de page, panneaux sombres).",
      logoDarkLabel: "Logo navy — fonds clairs",
      logoLightLabel: "Logo blanc — fonds foncés",
      colorsTitle: "Couleurs de marque",
      colors: [
        { name: "Navy", hex: "#111439", usage: "Texte principal, titres, fonds foncés" },
        { name: "Accent", hex: "#635BFF", usage: "Liens, accents, éléments interactifs" },
        { name: "Crème", hex: "#F8F8F9", usage: "Arrière-plans, zones de contenu" },
        { name: "Ardoise", hex: "#555566", usage: "Texte secondaire, légendes" },
      ],
      usageDoTitle: "À faire",
      usageDo: [
        "Conserver les proportions du logo — ne pas l'étirer",
        "Laisser un espace libre autour du logo (au moins la hauteur du symbole)",
        "Utiliser les fichiers PNG fournis dans le pack logos",
        "Placer « Copara » comme marque de service, pas comme votre nom de cabinet",
      ],
      usageDontTitle: "À éviter",
      usageDont: [
        "Modifier les couleurs du logo ou ajouter des effets (ombre, dégradé)",
        "Placer le logo navy sur un fond sombre (ou blanc sur fond clair)",
        "Utiliser le logo comme icône d'application sans autorisation",
        "Impliquer un partenariat juridique ou une approbation de Copara Inc.",
      ],
      cobrandTitle: "Co-marque partenaire",
      cobrandBody:
        "Vous pouvez afficher le logo Copara à côté du vôtre sur votre site, vos dépliants ou vos courriels pour indiquer que vous utilisez Copara avec vos clients. Ne remplacez pas votre identité visuelle par celle de Copara.",
      assetsTitle: "Fichiers disponibles",
      assetsBody:
        "Téléchargez le pack logos (ZIP) depuis la section Matériel marketing de votre tableau de bord partenaire. Inclut les variantes desktop et mobile.",
      contactTitle: "Questions",
      contactBody: `Pour toute question sur l'utilisation de la marque, écrivez à ${email}.`,
      footer: "copara.ca · copara.ca/professionals",
    };
  }

  return {
    title: "Copara Brand Guidelines",
    subtitle: "Logo usage, colours, and co-branding for partners.",
    logoTitle: "Logo variants",
    logoBody:
      "Use the navy logo on light backgrounds (websites, handouts, slide decks). Use the white logo on navy or dark backgrounds (footer, dark panels).",
    logoDarkLabel: "Navy logo — light backgrounds",
    logoLightLabel: "White logo — dark backgrounds",
    colorsTitle: "Brand colours",
    colors: [
      { name: "Navy", hex: "#111439", usage: "Primary text, headings, dark backgrounds" },
      { name: "Accent", hex: "#635BFF", usage: "Links, accents, interactive elements" },
      { name: "Cream", hex: "#F8F8F9", usage: "Backgrounds, content areas" },
      { name: "Slate", hex: "#555566", usage: "Secondary text, captions" },
    ],
    usageDoTitle: "Do",
    usageDo: [
      "Keep logo proportions — do not stretch or distort",
      "Leave clear space around the logo (at least the mark height)",
      "Use the PNG files from the logo pack download",
      "Present Copara as a service you use, not as your firm name",
    ],
    usageDontTitle: "Don't",
    usageDont: [
      "Change logo colours or add effects (shadows, gradients)",
      "Place the navy logo on a dark background (or white on light)",
      "Use the logo as an app icon without permission",
      "Imply a legal partnership or endorsement by Copara Inc.",
    ],
    cobrandTitle: "Partner co-branding",
    cobrandBody:
      "You may display the Copara logo alongside yours on your website, handouts, or emails to show you use Copara with clients. Do not replace your own brand identity with Copara's.",
    assetsTitle: "Available files",
    assetsBody:
      "Download the logo pack (ZIP) from the Marketing materials section of your partner dashboard. Includes desktop and mobile variants.",
    contactTitle: "Questions",
    contactBody: `For brand usage questions, contact ${email}.`,
    footer: "copara.ca · copara.ca/professionals",
  };
}
