import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";

export type ClientHandoutCopy = {
  title: string;
  subtitle: string;
  whatTitle: string;
  whatBody: string;
  linkTitle: string;
  linkHint: string;
  qrScanHint: string;
  stepsTitle: string;
  steps: string[];
  subscriptionTitle: string;
  subscriptionBody: string;
  featuresTitle: string;
  features: string[];
  footer: string;
  disclaimer: string;
};

export function getClientHandoutCopy(locale: string, caseName: string): ClientHandoutCopy {
  const trialDays = STRIPE_TRIAL_DAYS;

  if (locale.startsWith("fr")) {
    return {
      title: "Vous êtes invité à Copara",
      subtitle: `Dossier : ${caseName}`,
      whatTitle: "Qu'est-ce qui se passe?",
      whatBody:
        "Votre professionnel a configuré un dossier de coparentalité pour vous sur Copara — un espace partagé pour les messages, le calendrier, les dépenses et des dossiers organisés.",
      linkTitle: "Votre lien d'invitation",
      linkHint: "Les deux parents utilisent ce lien. Connectez-vous avec le courriel qui a reçu l'invitation.",
      qrScanHint: "Ou scannez le code QR pour ouvrir le lien sur votre téléphone.",
      stepsTitle: "Prochaines étapes",
      steps: [
        "Ouvrez le lien ci-dessous (ou scannez le code QR).",
        "Créez un compte ou connectez-vous avec le courriel invité.",
        "Acceptez l'invitation au dossier.",
        `Commencez votre essai gratuit de ${trialDays} jours, puis choisissez un forfait.`,
      ],
      subscriptionTitle: "Abonnement",
      subscriptionBody: `L'invitation au dossier n'exempte pas de l'abonnement. Un forfait Cercle familial peut couvrir les deux parents.`,
      featuresTitle: "Copara aide avec",
      features: [
        "Messagerie plus sereine",
        "Calendrier de coparentalité partagé",
        "Suivi des dépenses partagées",
        "Journal familial et coffre-fort d'information",
      ],
      footer: "copara.ca",
      disclaimer: "Copara n'est pas un cabinet juridique et ne fournit pas de conseils juridiques.",
    };
  }

  return {
    title: "You've been invited to Copara",
    subtitle: `Case: ${caseName}`,
    whatTitle: "What happened?",
    whatBody:
      "Your professional set up a co-parenting case for you on Copara — a shared space for messages, calendar, shared expenses, and organized records.",
    linkTitle: "Your case invite link",
    linkHint: "Both parents use this link. Sign in with the email address that received the invite.",
    qrScanHint: "Or scan the QR code to open the link on your phone.",
    stepsTitle: "What to do next",
    steps: [
      "Open the link below (or scan the QR code).",
      "Create an account or sign in with the invited email address.",
      "Accept the case invitation.",
      `Start your ${trialDays}-day free trial, then choose a subscription.`,
    ],
    subscriptionTitle: "Subscription",
    subscriptionBody:
      "Joining the case does not waive billing. A Family Circle plan can cover both parents in one subscription.",
    featuresTitle: "Copara helps with",
    features: [
      "Calmer messaging",
      "Shared parenting calendar",
      "Shared expense tracking",
      "Family journal and child information vault",
    ],
    footer: "copara.ca",
    disclaimer: "Copara is not a law firm and does not provide legal advice.",
  };
}
