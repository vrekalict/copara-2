import type { GuideSection } from "./coparenting-guide.en";

export const GUIDE_INTRO = {
  eyebrow: "Ressources",
  title: "Une coparentalité organisée au Canada",
  subtitle: "Un guide Copara pour parents séparés ou divorcés",
  description:
    "La coparentalité n'est pas une longue conversation sur le passé. Ce sont des centaines de petits détails — école, formulaires médicaux, frais d'activités, changements de cueillette — qui doivent rester exacts lorsque les parents ne partagent plus le même quotidien. Ce guide explique comment les familles canadiennes réduisent les frictions du quotidien grâce à des dossiers plus clairs, pas des disputes plus bruyantes.",
};

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "scattered-info",
    title: "L'information éparpillée transforme la logistique en conflit",
    paragraphs: [
      "La plupart des disputes de coparentalité ne sont pas philosophiques. Elles commencent quand deux personnes se souviennent différemment du mardi : qui a accepté l'échange, si le camp de jour a été payé, quel parent a l'inhalateur.",
      "Textos, courriels, calendriers papier et ententes verbales ne montrent chacun qu'une partie de la réalité. Quand rien n'est officiel, chaque désaccord rouvre de vieilles querelles.",
      "Une première étape pratique : choisir un système partagé pour les horaires, les messages concernant les enfants et les dossiers financiers. Vous n'avez pas besoin de tout approuver — vous devez savoir où se trouvent les faits.",
    ],
  },
  {
    id: "shared-calendar",
    title: "Construisez un horaire parental visible et modifiable par écrit",
    paragraphs: [
      "La garde fonctionne mieux lorsque les deux parents ouvrent le même calendrier et voient le plan actuel — pas celui d'il y a trois disputes.",
      "Quand un changement est demandé, confirmez-le par écrit avec la date, l'heure et la raison. « Peut-on échanger vendredi? » devient fiable seulement lorsque les deux parties reconnaissent la nouvelle entente.",
      "Les enfants ont besoin de prévisibilité. Les adultes ont besoin de moins d'échanges du type « tu ne m'as jamais dit ». Le calendrier partagé de Copara garde ces mises à jour visibles et horodatées.",
    ],
  },
  {
    id: "messages-as-records",
    title: "Traitez les messages de coparentalité comme des dossiers, pas comme des débats",
    paragraphs: [
      "Les messages au sujet de votre enfant peuvent être lus plus tard par un médiateur, un coordonnateur parental ou un avocat. Cela ne signifie pas que chaque phrase doit être formelle — cela signifie rester dans le sujet.",
      "Commencez par ce dont vous avez besoin : une décision, une date, un document, un remboursement. Évitez les jugements de personnalité, sauf si un professionnel en a besoin.",
      "Steady Send de Copara propose des suggestions de reformulation lorsque le ton est vif. Vous décidez de ce qui est envoyé. L'objectif est un fil qui documente les décisions parentales.",
    ],
  },
  {
    id: "expense-paper-trail",
    title: "Conservez une trace écrite pour les dépenses liées aux enfants",
    paragraphs: [
      "Les conflits d'argent commencent rarement par des chiffres. Ils commencent quand un reçu est introuvable, qu'une approbation est contestée ou qu'on oublie qui a payé l'inscription au hockey.",
      "Au moment de chaque dépense, notez le montant, la catégorie, le reçu et le partage proposé. Attendre que la rancune s'installe garantit une pire conversation.",
      "Le suivi des dépenses de Copara permet aux deux parents de voir propositions, téléversements et historique au même endroit.",
    ],
  },
  {
    id: "documents-vault",
    title: "Rangez les documents scolaires et médicaux où les deux parents peuvent les trouver",
    paragraphs: [
      "Cartes d'assurance, carnets de vaccination, courriels des enseignants et contacts d'urgence ne devraient pas vivre dans la boîte courriel d'un seul parent. Quand l'autre en a besoin un dimanche soir, fouiller de vieux textos est un problème d'organisation — pas une preuve de mauvaise foi.",
      "Gardez les documents à jour dans un coffre-fort partagé. Mettez-les à jour quand quelque chose change : nouvelle école, nouveau médicament, nouvelle activité.",
      "Une bonne documentation empêche les enfants de devenir des messagers répétés pour des renseignements que les adultes devraient partager directement.",
    ],
  },
  {
    id: "exports-professionals",
    title: "Sachez quoi exporter — et quand consulter un professionnel",
    paragraphs: [
      "Si vous travaillez avec un médiateur, un avocat ou un coordonnateur parental, des dossiers organisés économisent temps et frais. Un historique chronologique vaut mieux qu'un dossier de captures d'écran.",
      "Les exportations Copara sont des résumés inviolables conçus pour une revue professionnelle. Ce ne sont pas des preuves judiciaires certifiées et elles ne remplacent pas un avis juridique — mais elles sont plus claires qu'une boîte de documents imprimés.",
      "Certaines situations exigent plus qu'une application : sécurité, refus de communiquer ou ordonnances à faire respecter. Consultez alors un professionnel du droit familial dans votre province. Copara soutient la coordination; il ne décide pas de la garde ni ne résout la violence.",
    ],
  },
];

export const GUIDE_CLOSING = {
  title: "Moins de friction sur la logistique, plus d'espace pour parent",
  paragraphs: [
    "Vous ne contrôlez pas la façon dont votre co-parent communique. Vous pouvez contrôler si horaires, reçus et avis scolaires vivent au même endroit fiable.",
    "Copara aide les familles canadiennes à coordonner en anglais et en français — calendrier partagé, messagerie, dépenses, coffre-fort documentaire et exportations pour les parents séparés qui ont besoin de clarté plus que de conflit.",
  ],
  primaryLabel: "Commencer l'essai gratuit",
  primaryHref: "/sign-up",
  secondaryLabel: "Voir les fonctionnalités",
  secondaryHref: "/features",
};
