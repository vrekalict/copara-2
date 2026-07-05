import type { GuideHighlight, GuideMistake, GuideSection } from "./coparenting-guide.en";

export const GUIDE_INTRO = {
  eyebrow: "Ressources",
  title: "Le guide pratique de coparentalité",
  subtitle: "Pour les parents séparés au Canada",
  description:
    "La coparentalité se joue dans les petits moments : un texto de cueillette manqué, un reçu perdu, un avis scolaire jamais transmis. Ce guide explique comment garder horaires, messages, dépenses et renseignements sur l'enfant organisés — pour que la logistique reste factuelle et que les enfants restent à l'écart des conflits d'adultes.",
  primaryLabel: "Commencer l'essai gratuit",
  primaryHref: "/sign-up",
  secondaryLabel: "Découvrir les fonctionnalités",
  secondaryHref: "/features",
};

export const GUIDE_HIGHLIGHTS: GuideHighlight[] = [
  { value: "6", label: "Flux de travail couverts dans ce guide" },
  { value: "1 lieu", label: "Pour horaires, messages et reçus" },
  { value: "FR · EN", label: "Familles canadiennes, deux langues officielles" },
];

export const GUIDE_QUICK_WINS: string[] = [
  "Confirmez les changements d'horaire par écrit — pas par l'intermédiaire de votre enfant.",
  "Téléversez les reçus au moment du paiement, pas des mois plus tard.",
  "Gardez cartes d'assurance et contacts scolaires dans un coffre-fort partagé.",
  "Rédigez vos messages comme si un médiateur pouvait les lire plus tard.",
  "Utilisez un calendrier que les deux parents peuvent consulter avant de débattre de qui a dit quoi.",
];

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "scattered-info",
    title: "Pourquoi l'information éparpillée crée des conflits",
    summary:
      "La plupart des disputes portent sur des faits manquants, pas sur de mauvaises compétences parentales. Quand horaires et reçus vivent à cinq endroits, chaque désaccord rouvre de vieilles blessures.",
    paragraphs: [
      "Les parents séparés gèrent souvent la coparentalité entre fils de textos, courriels, notes papier et mémoire. Chaque canal ne montre qu'une partie de la vérité. Aucun parent n'a nécessairement tort — ils s'appuient sur des dossiers différents.",
      "Le schéma est prévisible : une petite question logistique devient une dispute personnelle parce qu'il n'existe pas de source commune fiable. Vendredi était-il convenu? As-tu approuvé la facture dentaire? Qui a l'EpiPen cette semaine?",
      "La solution est moins une question d'entente parfaite que d'organisation. Choisissez un système pour les horaires, les messages concernant les enfants, les dépenses et les documents clés.",
    ],
    bullets: [
      "Choisissez un calendrier partagé et considérez-le comme le plan officiel.",
      "Déplacez les conversations sur l'enfant hors des SMS personnels lorsque possible.",
      "Conservez reçus et approbations au moment de l'achat.",
      "Rangez documents scolaires et médicaux où les deux parents peuvent y accéder.",
    ],
    tip: "Si vous n'êtes pas d'accord sur ce qui s'est passé, consultez le dossier d'abord — puis discutez de la suite.",
    relatedLink: { href: "/features", label: "Comment Copara organise la coparentalité" },
  },
  {
    id: "shared-calendar",
    title: "Des horaires parentaux que les deux parents peuvent consulter",
    summary:
      "Les enfants ont besoin de prévisibilité. Les adultes ont besoin d'un calendrier qui montre le plan actuel — pas celui de la dispute du mois dernier.",
    paragraphs: [
      "La garde, les congés scolaires et les activités devraient être visibles aux deux parents dans la même vue. Quand un seul parent détient le calendrier maître, l'autre réagit toujours — et les enfants ressentent la tension aux échanges.",
      "Les demandes de changement fonctionnent mieux avec une habitude simple : proposer par écrit, inclure date/heure/raison, et attendre une confirmation explicite.",
      "Le calendrier partagé de Copara prend en charge les blocs de garde, les demandes de changement et les confirmations d'échange sans partage de GPS brut entre parents.",
    ],
    bullets: [
      "Entrez d'abord l'horaire de base (semaine/semaine, 2-2-3, fins de semaine alternées, etc.).",
      "Proposez les échanges comme demandes; confirmez par écrit avant d'en parler à l'enfant.",
      "Ajoutez événements scolaires, rendez-vous médicaux et voyages dès que vous les connaissez.",
      "Passez en revue la semaine à venir chaque dimanche — cinq minutes évitent le chaos du vendredi.",
    ],
    tip: "Parlez à votre enfant seulement après que les deux parents ont confirmé un changement d'horaire.",
    relatedLink: { href: "/features/calendar", label: "Calendrier et échanges" },
  },
  {
    id: "messages-as-records",
    title: "Des messages qui documentent les décisions",
    summary:
      "Les fils de coparentalité peuvent être lus par des médiateurs ou des avocats. Écrivez pour la clarté, pas pour « gagner ».",
    paragraphs: [
      "Un message utile répond à quatre questions : Quel est le problème? De quoi ai-je besoin? Pour quand? Quels documents sont joints?",
      "Steady Send de Copara peut suggérer une formulation plus calme lorsque vous le souhaitez. Vous choisissez toujours ce qui est envoyé.",
      "La messagerie en ajout seulement signifie qu'aucun message ne peut être modifié ou supprimé après l'envoi — ce qui protège les deux parents.",
    ],
    bullets: [
      "Commencez par la demande liée à l'enfant, pas par un rappel du passé.",
      "Un sujet par message lorsque la tension est élevée.",
      "Joignez des documents au lieu de les décrire de mémoire.",
      "Pausez avant de répondre à un texto provocateur.",
    ],
    tip: "Demandez-vous : « Si un professionnel neutre lisait ceci demain, saurait-il ce que je demande? »",
    relatedLink: { href: "/features/steady-send", label: "Relecture Steady Send" },
  },
  {
    id: "expense-paper-trail",
    title: "Dépenses pour enfants avec reçus et partages clairs",
    summary:
      "Les conflits d'argent sont d'abord des problèmes de documentation. Enregistrez les dépenses au moment où elles se produisent.",
    paragraphs: [
      "Sports, frais médicaux, école et vêtements s'accumulent vite. Le conflit commence quand le montant, l'approbation ou le moment est flou.",
      "Au moment de chaque dépense, capturez le reçu, la catégorie, le montant et le partage proposé. Attendre que la rancune s'installe transforme le remboursement en procès sur la mémoire.",
    ],
    bullets: [
      "Convenez des catégories à l'avance (médical, éducation, activités, vêtements, autre).",
      "Photographiez ou téléversez les reçus le jour même lorsque possible.",
      "Demandez approbation pour les dépenses importantes ou inhabituelles si votre entente l'exige.",
      "Passez en revue les soldes en suspens chaque mois.",
    ],
    tip: "Une demande de remboursement avec reçu joint est un calcul. Sans reçu, c'est une dispute de crédibilité.",
    relatedLink: { href: "/features/expenses", label: "Suivi des dépenses" },
  },
  {
    id: "documents-vault",
    title: "Renseignements scolaires et médicaux accessibles aux deux parents",
    summary:
      "Quand un seul parent a la carte d'assurance, l'enfant devient messager par défaut.",
    paragraphs: [
      "Cartes d'assurance, carnets de vaccination, plans d'allergie, horaires de médication et contacts d'urgence devraient vivre dans un endroit partagé.",
      "Mettez à jour le coffre-fort quand quelque chose change : nouvelle école, nouveau médicament, nouvel entraîneur.",
    ],
    bullets: [
      "Maintenez une liste de médication à jour avec dosages et pharmacie.",
      "Conservez les numéros de l'école et des enseignants pour les deux foyers.",
      "Gardez copies des ordonnances ou ententes parentales si applicable.",
      "Revoyez le contenu au début de chaque trimestre scolaire.",
    ],
    tip: "Si votre co-parent demande un document un dimanche soir, l'accès partagé vaut mieux qu'une recherche paniquée dans les textos.",
    relatedLink: { href: "/features/vault", label: "Coffre-fort documentaire" },
  },
  {
    id: "exports-professionals",
    title: "Exportations, professionnels et limites de l'application",
    summary:
      "Des dossiers organisés font gagner du temps en médiation. Certaines situations exigent une intervention professionnelle.",
    paragraphs: [
      "Historique chronologique, changements de calendrier et journaux de dépenses valent mieux qu'un dossier de captures d'écran.",
      "Les exportations Copara sont inviolables avec digests de vérification. Ce ne sont pas des preuves judiciaires certifiées et elles ne remplacent pas un avis juridique.",
      "Consultez un professionnel qualifié pour les préoccupations de sécurité, le harcèlement ou le refus de communiquer au sujet des enfants.",
    ],
    bullets: [
      "Exportez les dossiers avant les séances de médiation — pas la veille d'une audience.",
      "Apportez des fils chronologiques, pas des messages choisis à la carte.",
      "Dites à votre professionnel ce dont vous avez besoin : clarté d'horaire, totaux de dépenses ou tendances de messages.",
      "Suivez les ressources provinciales pour les urgences impliquant des enfants.",
    ],
    tip: "Une tenue de dossiers calme et constante est plus convaincante que d'annoncer que vous « montez un dossier » dans chaque message.",
    relatedLink: { href: "/features/records", label: "Exportations inviolables" },
  },
];

export const GUIDE_MISTAKES: GuideMistake[] = [
  {
    title: "Utiliser les enfants comme messagers",
    body: "Changements d'horaire, demandes d'argent et plaintes appartiennent aux adultes. Demander à un enfant de « dire à maman » le place entre deux personnes qu'il aime.",
  },
  {
    title: "Débattre de mémoire",
    body: "Sans dossier partagé, chaque conversation repart de zéro. La confirmation écrite évite les disputes répétées sur le même mardi.",
  },
  {
    title: "Mélanger logistique et griefs",
    body: "Un message sur l'heure de cueillette n'est pas l'endroit pour rouvrir la dispute de l'an dernier.",
  },
  {
    title: "Accumuler les documents dans une seule boîte courriel",
    body: "Quand l'info médicale ou scolaire n'existe que chez un parent, l'autre paraît désorganisé alors qu'il est simplement mal informé.",
  },
];

export const GUIDE_CLOSING = {
  title: "Moins de chaos logistique, plus d'espace pour parent",
  description:
    "Vous ne contrôlez pas la façon dont votre co-parent communique. Vous pouvez contrôler si horaires, reçus et avis scolaires vivent au même endroit fiable.",
  primaryLabel: "Commencer l'essai gratuit",
  primaryHref: "/sign-up",
  secondaryLabel: "Voir les tarifs",
  secondaryHref: "/pricing",
};
