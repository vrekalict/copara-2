import type { GuideRule } from "./coparenting-guide.en";

export const GUIDE_INTRO = {
  eyebrow: "Ressources",
  title: "Dix règles pour une coparentalité saine",
  subtitle: "La coparentalité, comment ça marche",
  description:
    "Un mini-guide pratique pour les parents séparés au Canada qui souhaitent une communication plus calme, des dossiers plus clairs et un environnement stable pour leurs enfants.",
};

export const GUIDE_RULES: GuideRule[] = [
  {
    number: 1,
    title: "Ne forcez pas vos enfants à choisir un camp",
    pullQuote:
      "Encouragez vos enfants à maintenir des liens avec grands-parents, oncles, tantes et cousins des deux côtés.",
    paragraphs: [
      "Demander aux enfants de couper les ponts avec la belle-famille crée souvent la première fracture durable après la séparation.",
      "Encouragez les liens avec la parenté des deux côtés. Ces relations peuvent soutenir l'estime de soi et le sentiment d'appartenance de l'enfant.",
      "Quand un enfant revient d'un séjour chez l'autre parent ou sa famille, évitez les comparaisons. Les enfants ont besoin du parent qui aide aux devoirs et du parent qui prépare un bon repas — les deux comptent.",
    ],
  },
  {
    number: 2,
    title: "Parlez de votre co-parent sur un ton positif",
    paragraphs: [
      "La séparation fait mal. Pourtant, vos enfants ont besoin de respecter leurs deux parents. Ce respect les aide à respecter l'autorité en général et à grandir en étant respectés eux-mêmes.",
      "Même si votre co-parent parle négativement de vous, évitez les répliques. L'hostilité constante érode davantage le respect de votre enfant que le silence.",
      "Vous êtes l'adulte. Montrez l'exemple d'une communication calme et respectueuse.",
    ],
  },
  {
    number: 3,
    title: "Épargnez-leur les détails d'adultes",
    paragraphs: [
      "Raconter à vos enfants à quel point votre vie est difficile crée de la confusion et leur impose un fardeau qu'ils ne devraient pas porter.",
      "Plutôt que de longues explications sur l'argent ou les conflits, restez simple : « Nous devons être prudents avec nos dépenses en ce moment. »",
      "En tant qu'adulte, vous devez trouver des solutions. Vos enfants ne devraient pas être vos messagers ni vos conseillers.",
    ],
  },
  {
    number: 4,
    title: "N'utilisez pas vos enfants comme messagers",
    pullQuote:
      "Copara offre un canal partagé pour les horaires, les dépenses et les messages — sans mettre les enfants au milieu.",
    paragraphs: [
      "Le téléphone, le courriel et les outils sécurisés de coparentalité sont de bien meilleures options que de demander à un enfant de transmettre un message ou une plainte.",
      "Copara est conçu pour cela : communication organisée sur les horaires, les dépenses, les documents et les messages — dans un dossier qui reste entre adultes.",
      "Les règles peuvent différer d'une maison à l'autre. C'est normal. Si vous assumez vos choix avec calme, vos enfants accepteront plus facilement les deux environnements.",
    ],
  },
  {
    number: 5,
    title: "Détachez-vous du conflit avec votre co-parent",
    paragraphs: [
      "Vous êtes séparés. Certaines personnes restent prisonnières d'une relation de haine longtemps après la fin du mariage.",
      "Plus tôt vous acceptez la séparation, plus tôt vous pouvez cesser de revivre le combat. Copara aide en séparant la coordination pratique du débat émotionnel.",
    ],
  },
  {
    number: 6,
    title: "Fixez des limites et des attentes claires",
    paragraphs: [
      "Établissez des limites saines à la maison. En cas de doute, consultez un professionnel de confiance.",
      "Certains enfants savent très bien jouer un parent contre l'autre. Partagez des attentes claires sur l'école, les devoirs, les corvées, le coucher et le respect.",
    ],
  },
  {
    number: 7,
    title: "Restez ouverts à la communication avec vos enfants",
    paragraphs: [
      "Écoutez sans juger. N'imposez pas ce qu'ils devraient ressentir.",
      "Accueillez leurs émotions du moment tout en leur rappelant que les sentiments évoluent. Évitez les questions qui les incitent à se plaindre de l'autre parent.",
    ],
  },
  {
    number: 8,
    title: "Soyez l'adulte responsable",
    paragraphs: [
      "Choisissez qui vous voulez devenir après cette séparation. Fixez des objectifs à court, moyen et long terme.",
      "Des dossiers organisés, un calendrier partagé et des messages calmes montrent à vos enfants que les adultes peuvent traverser les périodes difficiles.",
    ],
  },
  {
    number: 9,
    title: "Aidez vos enfants à se sentir en sécurité",
    paragraphs: [
      "Faites de votre foyer un lieu de respect, de prévisibilité et de soin.",
      "La sécurité ne dépend pas d'un accord parfait entre parents, mais du fait que l'enfant sait qu'il est aimé et que les adultes sont fiables.",
    ],
  },
  {
    number: 10,
    title: "Apprenez à rebondir ensemble",
    pullQuote:
      "Montrez à vos enfants que les périodes difficiles peuvent être traversées sans s'effondrer.",
    paragraphs: [
      "La résilience est l'un des plus beaux cadeaux qu'un parent puisse offrir. Montrez l'exemple après un contretemps — un échange manqué, un message tendu, un horaire modifié.",
      "Copara ne répare pas votre relation de coparentalité, mais il peut réduire les frictions du quotidien.",
    ],
  },
];

export const GUIDE_CLOSING = {
  title: "Une communication constructive commence par les bons outils",
  paragraphs: [
    "Les enfants doivent sentir que leurs deux parents sont attentifs à l'école, aux activités, à la santé et au quotidien.",
    "Copara offre calendrier partagé, messagerie, suivi des dépenses, coffre-fort documentaire et exportations inviolables pour les familles canadiennes. En anglais et en français.",
  ],
  primaryLabel: "Demander l'accès anticipé",
  primaryHref: "/sign-up",
  secondaryLabel: "Découvrir Copara",
  secondaryHref: "/features",
};
