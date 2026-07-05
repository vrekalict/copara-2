import type { LegalSection } from "./types";

export const PRIVACY_INTRO =
  'La présente Politique de confidentialité décrit la manière dont Copara (« nous », « notre », « nos ») collecte, utilise, communique, conserve et protège les renseignements personnels lorsque vous utilisez notre plateforme de coordination en coparentalité, notre site Web et les services connexes.';

export const PRIVACY_PREAMBLE = [
  "Copara est conçu pour les utilisateurs canadiens, y compris les utilisateurs du Québec. La présente politique explique nos pratiques en langage clair et identifie vos droits en matière de protection de la vie privée en vertu des lois canadiennes applicables.",
  "La présente Politique de confidentialité fait partie intégrante de nos Conditions générales. En utilisant Copara, vous reconnaissez les pratiques décrites ici.",
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "privacy-officer",
    title: "Responsable de la protection des renseignements personnels et coordonnées",
    paragraphs: [
      "Copara a désigné un responsable de la protection des renseignements personnels chargé d'assurer la conformité aux lois applicables en matière de protection de la vie privée et de répondre aux demandes relatives à la vie privée.",
      "Responsable de la protection des renseignements personnels et demandes relatives à la vie privée : legal@copara.ca",
      "Assistance générale : support@copara.ca",
      "Adresse postale : disponible sur demande par courriel à legal@copara.ca.",
    ],
  },
  {
    id: "scope",
    title: "Portée et application",
    paragraphs: [
      "La présente Politique de confidentialité s'applique aux renseignements personnels que nous collectons par l'entremise de Copara, y compris notre site Web, notre application Web, notre application Web progressive, nos communications, nos exportations, nos outils de vérification et nos canaux d'assistance à la clientèle.",
      "Pour les utilisateurs du Québec, nous traitons les renseignements personnels conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25), le cas échéant.",
      "Pour les utilisateurs ailleurs au Canada, nous traitons les renseignements personnels conformément à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) et aux lois provinciales applicables en matière de protection de la vie privée.",
    ],
  },
  {
    id: "categories",
    title: "Catégories de renseignements personnels que nous collectons",
    paragraphs: ["Nous pouvons collecter les catégories de renseignements personnels suivantes :"],
    bullets: [
      "Renseignements d'identité et de compte : nom, adresse courriel, hachage de mot de passe, préférence linguistique, province ou territoire, paramètres de notification et identifiants de compte.",
      "Renseignements sur les cercles et l'appartenance : noms de cercles, rôles, statut d'invitation, permissions et relations entre les utilisateurs d'un cercle partagé.",
      "Communications en coparentalité : contenu des messages, pièces jointes, horodatages de livraison et de lecture, appartenance aux fils de discussion et métadonnées en ajout seulement, y compris les valeurs de chaîne de hachage utilisées pour les exportations inviolables.",
      "Renseignements concernant les enfants : noms, dates de naissance, détails scolaires, notes médicales, contacts d'urgence et documents téléversés dans le coffre-fort d'information, sous réserve des paramètres de partage que vous contrôlez.",
      "Renseignements sur la planification et l'activité : horaires parentaux, événements de calendrier, rappels d'échange, résultats de vérification de présence et horodatages connexes.",
      "Renseignements financiers : dépenses partagées, pourcentages de répartition, demandes de remboursement, images de reçus, notes de différend et identifiants liés au paiement lorsque vous vous abonnez à un forfait payant.",
      "Documents et fichiers : documents, photos et autres fichiers que vous téléversez dans Copara, y compris les éléments du coffre-fort, les pièces jointes aux messages, les entrées de journal et le contenu d'albums.",
      "Données de traitement par IA : brouillons soumis pour révision de ton ou réécriture, conversations sélectionnées pour résumés, résultats d'IA, acceptation ou rejet de suggestions et métadonnées d'audit connexes.",
      "Dossiers d'accès professionnel : renseignements sur les professionnels connectés aux cercles et permissions accordées par les parents.",
      "Renseignements techniques et d'utilisation : adresse IP, type de navigateur, renseignements sur l'appareil, données de journal, identifiants de session, témoins nécessaires à l'authentification, témoins de langue et événements d'analytique facultatifs.",
      "Renseignements d'assistance et de liste d'attente : renseignements que vous fournissez lorsque vous communiquez avec l'assistance, demandez un accès anticipé ou vous inscrivez sur une liste d'attente.",
    ],
  },
  {
    id: "purposes",
    title: "Fins de collecte et d'utilisation",
    paragraphs: ["Nous utilisons les renseignements personnels aux fins suivantes :"],
    bullets: [
      "Créer et gérer votre compte et vous authentifier de manière sécurisée.",
      "Exploiter Copara, y compris la messagerie, la planification, le suivi des dépenses, le stockage de documents, les exportations et la fonctionnalité de cercle partagé.",
      "Transmettre les notifications, rappels et communications liées au service que vous attendez du produit.",
      "Fournir les fonctionnalités assistées par l'IA que vous demandez, comme la révision de ton, les réécritures et les résumés.",
      "Générer des exportations inviolables et des fonctionnalités de vérification.",
      "Traiter les abonnements, la facturation et les transactions liées au paiement.",
      "Fournir l'assistance à la clientèle et répondre aux demandes.",
      "Sécuriser le service, détecter les abus, prévenir la fraude et maintenir l'intégrité du système.",
      "Respecter les obligations juridiques et répondre aux demandes licites.",
      "Améliorer Copara, diagnostiquer les erreurs et développer de nouvelles fonctionnalités, en utilisant des données agrégées ou anonymisées lorsque cela est possible.",
    ],
  },
  {
    id: "legal-bases",
    title: "Consentement et fondements juridiques",
    paragraphs: [
      "Nous collectons et utilisons les renseignements personnels en fonction de votre consentement, de notre besoin contractuel de fournir le service, du respect des obligations juridiques et de nos intérêts légitimes à exploiter une plateforme de coparentalité sécurisée et fiable, pondérés par rapport à vos droits en matière de protection de la vie privée.",
      "Vous pouvez retirer votre consentement pour un traitement non essentiel lorsque la loi le permet. Le retrait peut limiter votre capacité à utiliser certaines fonctionnalités. Certains traitements sont nécessaires pour maintenir les dossiers partagés, la sécurité, la facturation ou la conformité juridique.",
    ],
  },
  {
    id: "ai-processing",
    title: "Traitement par intelligence artificielle",
    paragraphs: [
      "Copara peut utiliser des systèmes automatisés, y compris des modèles d'IA tiers, pour fournir la révision de ton, la réécriture de messages, les résumés, les résumés de différends et les fonctionnalités d'assistance connexes.",
      "Lorsque vous soumettez du contenu pour un examen assisté par l'IA, nous traitons le contenu que vous fournissez pour cette demande précise. Les résultats d'IA ne sont que des suggestions et ne sont pas automatiquement ajoutés à votre dossier partagé de coparentalité, sauf si vous choisissez de les envoyer, de les enregistrer ou de les exporter.",
      "Nous tenons des journaux d'audit des demandes assistées par l'IA à des fins de responsabilité, de limitation du débit et d'amélioration du service. Les journaux peuvent inclure des identifiants hachés des entrées, des métadonnées de sortie, des renseignements sur le modèle et des horodatages.",
      "Le traitement par IA peut avoir lieu par l'entremise de fournisseurs de services situés à l'extérieur du Canada. Lorsque la loi l'exige, nous évaluons ce traitement et appliquons des mesures contractuelles et techniques.",
      "Selon la loi applicable, vous pouvez détenir des droits concernant le traitement automatisé, y compris le droit de demander des renseignements sur les décisions automatisées, de vous opposer à certains traitements ou de demander un examen humain. Communiquez avec legal@copara.ca pour exercer ces droits.",
    ],
  },
  {
    id: "sharing",
    title: "Comment nous communiquons les renseignements personnels",
    paragraphs: [
      "Nous ne vendons pas vos renseignements personnels. Nous pouvons communiquer des renseignements personnels dans les circonstances suivantes :",
    ],
    bullets: [
      "Au sein de votre cercle : avec les autres membres autorisés du cercle selon votre rôle, vos permissions et les paramètres du produit.",
      "Avec des professionnels : lorsque les parents accordent un accès en lecture seule ou tout autre accès permis à un utilisateur professionnel.",
      "Avec des fournisseurs de services : qui traitent les données en notre nom sous des mesures contractuelles de protection (voir Fournisseurs de services ci-dessous).",
      "Pour des raisons juridiques et de sécurité : lorsque la loi l'exige ou le permet, pour protéger la sécurité, ou pour enquêter sur des abus, de la fraude ou des incidents de sécurité.",
      "Dans le cadre d'une transaction commerciale : comme une fusion, une acquisition ou une vente d'actifs, sous réserve de la loi applicable et de mesures de protection appropriées.",
    ],
  },
  {
    id: "service-providers",
    title: "Fournisseurs de services",
    paragraphs: [
      "Nous nous appuyons sur des fournisseurs de services de confiance pour exploiter Copara. Ces fournisseurs traitent les renseignements personnels en notre nom et sont contractuellement tenus de les protéger. Les catégories actuelles de fournisseurs comprennent :",
    ],
    bullets: [
      "Supabase — base de données, authentification, stockage de fichiers et infrastructure en temps réel.",
      "Vercel — hébergement du site Web et de l'application.",
      "OpenAI — traitement par IA côté serveur pour les fonctionnalités d'assistance que vous demandez.",
      "Resend — livraison de courriels transactionnels.",
      "Processeurs de paiement — abonnement et facturation lorsque vous achetez un forfait payant.",
    ],
  },
  {
    id: "cross-border",
    title: "Transferts transfrontaliers",
    paragraphs: [
      "Les renseignements personnels peuvent être stockés ou traités au Canada, aux États-Unis ou dans d'autres juridictions où nos fournisseurs de services exercent leurs activités.",
      "Lorsque des renseignements personnels sont transférés à l'extérieur de votre province ou à l'extérieur du Canada, nous évaluons le transfert et mettons en œuvre des mesures visant à protéger les renseignements, y compris des protections contractuelles, le chiffrement en transit et des contrôles d'accès.",
      "Pour les utilisateurs du Québec, les transferts transfrontaliers sont traités conformément aux exigences de la Loi 25, y compris les évaluations des facteurs relatifs à la vie privée et les mesures contractuelles de protection lorsque requis.",
    ],
  },
  {
    id: "retention",
    title: "Conservation",
    paragraphs: [
      "Nous conservons les renseignements personnels aussi longtemps que nécessaire pour fournir Copara, maintenir les dossiers partagés de coparentalité, respecter les obligations juridiques, résoudre les différends, faire respecter nos Conditions et maintenir la sécurité.",
      "Étant donné que Copara est conçu pour des dossiers partagés et horodatés, certains renseignements — y compris les messages envoyés et les journaux financiers — peuvent être conservés même après la fermeture de votre compte lorsque la conservation est nécessaire pour l'intégrité des dossiers, les autres membres du cercle, la conformité juridique ou la résolution de différends.",
      "Les journaux d'audit d'IA, les journaux de sécurité, les dossiers de facturation et les dossiers d'acceptation juridique sont conservés conformément à nos exigences opérationnelles et de conformité.",
      "Lorsque la conservation n'est plus requise et que la suppression est permise, nous supprimons ou anonymisons les renseignements personnels au moyen de mesures techniques et organisationnelles raisonnables.",
    ],
  },
  {
    id: "rights-canada",
    title: "Vos droits en matière de protection de la vie privée au Canada",
    paragraphs: [
      "Selon votre province ou territoire, vous pouvez détenir les droits suivants, sous réserve des limites juridiques et contractuelles :",
    ],
    bullets: [
      "Accès — demander des renseignements sur les renseignements personnels que nous détenons à votre sujet.",
      "Rectification — demander la correction de renseignements personnels inexacts ou incomplets.",
      "Retrait du consentement — retirer votre consentement pour un traitement non essentiel, le cas échéant.",
      "Suppression — demander la suppression de renseignements personnels lorsque la loi le permet.",
      "Portabilité — demander une copie de certains renseignements personnels dans un format utilisable, le cas échéant.",
      "Plainte — déposer une plainte auprès de nous ou auprès d'un organisme de réglementation compétent en matière de protection de la vie privée.",
    ],
  },
  {
    id: "rights-quebec",
    title: "Droits en vertu de la Loi 25 du Québec",
    paragraphs: [
      "Si vous êtes au Québec, vous détenez des droits additionnels en vertu de la Loi 25, qui peuvent inclure :",
    ],
    bullets: [
      "Le droit d'être informé de la collecte, de l'utilisation et de la communication de vos renseignements personnels.",
      "Le droit d'accéder à vos renseignements personnels et d'obtenir des renseignements sur la manière dont ils sont utilisés.",
      "Le droit de demander la rectification de renseignements personnels inexacts, incomplets ou équivoques.",
      "Le droit de retirer votre consentement à la collecte, à l'utilisation ou à la communication de renseignements personnels, sous réserve des limites juridiques et contractuelles.",
      "Le droit de demander la cessation de la diffusion de renseignements personnels ou la désindexation dans certaines circonstances.",
      "Le droit à la portabilité des renseignements personnels dans certaines circonstances.",
      "Le droit d'être informé des décisions automatisées et, le cas échéant, de demander un examen humain.",
      "Le droit de désigner une personne pour exercer certains droits en matière de protection de la vie privée en votre nom dans certaines circonstances.",
    ],
  },
  {
    id: "exercising-rights",
    title: "Exercice de vos droits",
    paragraphs: [
      "Pour exercer vos droits en matière de protection de la vie privée, communiquez avec legal@copara.ca en fournissant suffisamment de renseignements pour vérifier votre identité et décrire votre demande. Nous répondrons dans le délai exigé par la loi applicable.",
      "Étant donné que Copara maintient des dossiers partagés, certaines demandes de suppression ou de rectification peuvent être limitées lorsque la conservation est nécessaire pour les autres membres du cercle, l'intégrité des dossiers, la conformité juridique ou la résolution de différends.",
    ],
  },
  {
    id: "children",
    title: "Renseignements concernant les enfants",
    paragraphs: [
      "Copara ne s'adresse pas aux enfants pour qu'ils créent leurs propres comptes. Les enfants ne peuvent pas s'inscrire à Copara de manière autonome.",
      "Les parents, tuteurs légaux et adultes autorisés peuvent saisir des renseignements concernant des enfants à des fins de coordination en coparentalité. En saisissant des renseignements concernant un enfant, vous déclarez que vous avez l'autorité légale de fournir ces renseignements et de les partager selon les paramètres de votre cercle.",
      "Si vous croyez que nous avons collecté des renseignements personnels d'un enfant de manière inappropriée, communiquez avec legal@copara.ca.",
    ],
  },
  {
    id: "security",
    title: "Sécurité",
    paragraphs: [
      "Nous utilisons des mesures administratives, techniques et organisationnelles raisonnables conçues pour protéger les renseignements personnels, y compris le chiffrement en transit, les contrôles d'accès et les politiques de sécurité au niveau des lignes qui limitent l'accès à la base de données aux membres autorisés du cercle.",
      "Aucune méthode de transmission ou de stockage n'est totalement sécurisée. Nous ne pouvons garantir qu'un accès non autorisé, une communication, une perte, une utilisation abusive ou une altération ne se produira jamais.",
      "Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion et de l'activité effectuée sous votre compte.",
    ],
  },
  {
    id: "breaches",
    title: "Incidents de confidentialité et atteintes",
    paragraphs: [
      "Si nous apprenons qu'un incident de confidentialité, une atteinte à la vie privée ou un incident de sécurité impliquant des renseignements personnels exigeant un avis en vertu de la loi applicable s'est produit, nous prendrons les mesures exigées par la loi.",
      "Selon les circonstances et la loi applicable, cela peut inclure l'avis aux personnes touchées, au Commissariat à la protection de la vie privée du Canada, à la Commission d'accès à l'information du Québec ou à d'autres parties requises.",
      "Nous maintenons des procédures internes pour évaluer, contenir, enquêter sur les incidents impliquant des renseignements personnels et y répondre.",
    ],
  },
  {
    id: "casl",
    title: "Communications et LCAP",
    paragraphs: [
      "Nous envoyons des communications liées au service parce que vous utilisez Copara, y compris des avis de compte, des alertes de sécurité, des avis d'abonnement, des alertes de messages, des rappels d'horaire, des avis d'exportation et des réponses d'assistance. Il ne s'agit pas de messages promotionnels.",
      "Lorsque nous envoyons des communications promotionnelles ou de marketing, nous le faisons conformément à la Loi canadienne anti-pourriel (LCAP), le cas échéant. Les messages de marketing identifient l'expéditeur, fournissent des coordonnées et incluent un mécanisme de désabonnement.",
      "Vous pouvez gérer vos préférences de notification dans les paramètres de votre compte, lorsque disponible.",
    ],
  },
  {
    id: "cookies",
    title: "Témoins et technologies similaires",
    paragraphs: [
      "Nous utilisons des témoins et des technologies similaires nécessaires à l'authentification, à la gestion de session et aux préférences linguistiques.",
      "Des témoins d'analytique facultatifs peuvent être utilisés pour comprendre l'utilisation du produit s'ils sont activés. Vous pouvez gérer vos préférences de témoins par les paramètres de votre navigateur.",
    ],
  },
  {
    id: "changes",
    title: "Modifications à la présente Politique de confidentialité",
    paragraphs: [
      "Nous pouvons mettre à jour la présente Politique de confidentialité de temps à autre. Lorsque nous apportons des modifications importantes, nous vous en informerons par l'application, par courriel ou par tout autre moyen raisonnable. La politique mise à jour indiquera une nouvelle date de dernière mise à jour.",
      "Lorsque la loi l'exige, les modifications importantes n'entreront en vigueur qu'après tout délai de préavis ou processus de consentement requis.",
    ],
  },
  {
    id: "contact",
    title: "Nous joindre",
    paragraphs: [
      "Responsable de la protection des renseignements personnels et demandes relatives à la vie privée : legal@copara.ca",
      "Assistance générale : support@copara.ca",
      "Demandes juridiques : legal@copara.ca",
    ],
  },
];
