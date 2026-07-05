import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";

export type ReferralHandoutCopy = {
  title: string;
  subtitle: string;
  whatTitle: string;
  whatBody: string;
  linkTitle: string;
  linkHint: string;
  qrScanHint: string;
  signupTitle: string;
  signupBody: string;
  distinctionTitle: string;
  distinctionBody: string;
  subscriptionTitle: string;
  subscriptionBody: string;
  featuresTitle: string;
  features: string[];
  footer: string;
  disclaimer: string;
};

const EN: ReferralHandoutCopy = {
  title: "Copara for co-parenting",
  subtitle: "Co-parenting communication, made calmer and clearer.",
  whatTitle: "What is Copara?",
  whatBody:
    "Copara helps separated parents communicate more calmly, coordinate schedules, track shared expenses, and keep organized records in one place.",
  linkTitle: "Your sign-up link",
  linkHint: "Share this link with client families. It attributes sign-ups to your partner account.",
  qrScanHint: "Or scan the QR code to sign up on your phone.",
  signupTitle: "How to sign up",
  signupBody:
    "Visit the link below to create an account. Both parents can share one Family Circle subscription.",
  distinctionTitle: "Case invite vs this link",
  distinctionBody:
    "This referral link is for general sign-up. If your professional creates an active case for you, you will receive a separate case invite email — use that email address to join the shared circle.",
  subscriptionTitle: "Subscription",
  subscriptionBody: `${STRIPE_TRIAL_DAYS}-day free trial for parents, then a monthly or yearly plan.`,
  featuresTitle: "Key features",
  features: [
    "Calmer messaging with organized records",
    "Shared parenting calendar",
    "Expense tracking and reimbursements",
    "Family journal and child information vault",
    "Exportable records for professionals",
  ],
  footer: "copara.ca · copara.ca/professionals",
  disclaimer: "Copara is not a law firm and does not provide legal advice.",
};

const FR: ReferralHandoutCopy = {
  title: "Copara pour la coparentalité",
  subtitle: "La coparentalité, sans le conflit.",
  whatTitle: "Qu'est-ce que Copara?",
  whatBody:
    "Copara aide les parents séparés à communiquer plus sereinement, coordonner les horaires, suivre les dépenses partagées et conserver des dossiers organisés.",
  linkTitle: "Votre lien d'inscription",
  linkHint:
    "Partagez ce lien avec les familles clientes. Il attribue les inscriptions à votre compte partenaire.",
  qrScanHint: "Ou scannez le code QR pour vous inscrire sur votre téléphone.",
  signupTitle: "Comment s'inscrire",
  signupBody:
    "Visitez le lien ci-dessous pour créer un compte. Les deux parents peuvent partager un abonnement Cercle familial.",
  distinctionTitle: "Invitation de dossier vs ce lien",
  distinctionBody:
    "Ce lien de parrainage sert à une inscription générale. Si votre professionnel crée un dossier actif pour vous, vous recevrez une invitation distincte — utilisez le courriel invité pour rejoindre le cercle.",
  subscriptionTitle: "Abonnement",
  subscriptionBody: `Essai gratuit de ${STRIPE_TRIAL_DAYS} jours pour les parents, puis forfait mensuel ou annuel.`,
  featuresTitle: "Fonctionnalités clés",
  features: [
    "Messagerie plus sereine et dossiers organisés",
    "Calendrier de coparentalité partagé",
    "Suivi des dépenses et remboursements",
    "Journal familial et coffre-fort d'information",
    "Exportations pour les professionnels",
  ],
  footer: "copara.ca · copara.ca/professionals",
  disclaimer: "Copara n'est pas un cabinet juridique et ne fournit pas de conseils juridiques.",
};

export function getReferralHandoutCopy(locale: string): ReferralHandoutCopy {
  return locale.startsWith("fr") ? FR : EN;
}
