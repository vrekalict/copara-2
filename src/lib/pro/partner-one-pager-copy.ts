import { PRO_REFERRAL_BONUS } from "@/lib/pro/config";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";

export type PartnerOnePagerCopy = {
  title: string;
  subtitle: string;
  overviewTitle: string;
  overviewBody: string;
  benefitsTitle: string;
  benefits: string[];
  toolsTitle: string;
  caseInviteTitle: string;
  caseInvitePoints: string[];
  referralLinkTitle: string;
  referralLinkPoints: string[];
  billingTitle: string;
  billingBody: string;
  referralTitle: string;
  referralBody: string;
  gettingStartedTitle: string;
  gettingStartedSteps: string[];
  footer: string;
  disclaimer: string;
};

export function getPartnerOnePagerCopy(locale: string): PartnerOnePagerCopy {
  const bonus = PRO_REFERRAL_BONUS.firstInvoicePercent;
  const trialDays = STRIPE_TRIAL_DAYS;

  if (locale.startsWith("fr")) {
    return {
      title: "Programme partenaire Copara",
      subtitle: "Pour avocats en droit familial, médiateurs et coordonnateurs parentaux.",
      overviewTitle: "Aperçu",
      overviewBody:
        "Copara aide les parents séparés à communiquer plus sereinement, coordonner les horaires et conserver des dossiers organisés. Le programme partenaire est gratuit pour les professionnels approuvés.",
      benefitsTitle: "Avantages partenaire",
      benefits: [
        "Accès en lecture seule aux dossiers clients (messages, calendrier, dépenses)",
        "Tableau de bord pour suivre les dossiers et le statut des membres",
        "Invitations aux deux parents avec un seul lien",
        "Exportations organisées pour le suivi professionnel",
        "Matériel marketing et ressources de marque",
        "Bonus de parrainage lorsque les familles s'abonnent",
      ],
      toolsTitle: "Deux outils distincts",
      caseInviteTitle: "Invitation de dossier",
      caseInvitePoints: [
        "Crée un cercle partagé et envoie un courriel aux deux parents",
        "Vous donne un accès en lecture seule aux dossiers autorisés",
        "Ne suit pas automatiquement les bonus de parrainage",
      ],
      referralLinkTitle: "Lien de parrainage (/r/votre-slug)",
      referralLinkPoints: [
        "Pour les familles qui s'inscrivent seules",
        "Attribue les inscriptions à votre compte partenaire",
        `Bonus de ${bonus} % sur la première facture payée (un par foyer)`,
      ],
      billingTitle: "Qui paie",
      billingBody: `Votre compte partenaire est gratuit. Les parents s'abonnent après avoir rejoint — essai gratuit de ${trialDays} jours d'abord. Un forfait Cercle familial peut couvrir les deux parents.`,
      referralTitle: "Programme de parrainage",
      referralBody: `Partagez votre lien /r/ personnalisé. Gagnez ${bonus} % de la première facture payée lorsqu'une famille parrainée s'abonne. Suivez le statut dans votre tableau de bord.`,
      gettingStartedTitle: "Pour commencer",
      gettingStartedSteps: [
        "Demandez l'accès sur copara.ca/professionals",
        "Une fois approuvé, connectez-vous sur copara.ca/pro",
        "Créez un dossier client ou partagez votre lien /r/",
        "Téléchargez les dépliants et modèles de courriel depuis le tableau de bord",
      ],
      footer: "copara.ca/professionals · copara.ca/pro",
      disclaimer: "Copara n'est pas un cabinet juridique et ne fournit pas de conseils juridiques.",
    };
  }

  return {
    title: "Copara Partner Program",
    subtitle: "For family lawyers, mediators, and parenting coordinators.",
    overviewTitle: "Overview",
    overviewBody:
      "Copara helps separated parents communicate more calmly, coordinate schedules, and keep organized records. The partner program is free for approved professionals.",
    benefitsTitle: "Partner benefits",
    benefits: [
      "Read-only access to client cases (messages, calendar, expenses)",
      "Dashboard to manage cases and track member status",
      "Dual-parent invite links from one case setup",
      "Organized exports for professional follow-up",
      "Marketing handouts, email templates, and brand assets",
      "Referral bonuses when referred families subscribe",
    ],
    toolsTitle: "Two separate tools",
    caseInviteTitle: "Case invite",
    caseInvitePoints: [
      "Creates a shared circle and emails both parents",
      "Gives you read-only access to permitted records",
      "Does not automatically track referral bonuses",
    ],
    referralLinkTitle: "Referral link (/r/your-slug)",
    referralLinkPoints: [
      "For families signing up on their own",
      "Attributes sign-ups to your partner account",
      `${bonus}% of the first paid invoice (one bonus per household)`,
    ],
    billingTitle: "Who pays",
    billingBody: `Your partner account is free. Parents subscribe after joining — ${trialDays}-day free trial first. A Family Circle plan can cover both parents in one subscription.`,
    referralTitle: "Referral program",
    referralBody: `Share your personalized /r/ link. Earn ${bonus}% of the first paid invoice when a referred family subscribes. Track status in your partner dashboard.`,
    gettingStartedTitle: "Getting started",
    gettingStartedSteps: [
      "Request access at copara.ca/professionals",
      "Once approved, sign in at copara.ca/pro",
      "Create a client case or share your /r/ link",
      "Download handouts and email templates from your dashboard",
    ],
    footer: "copara.ca/professionals · copara.ca/pro",
    disclaimer: "Copara is not a law firm and does not provide legal advice.",
  };
}
