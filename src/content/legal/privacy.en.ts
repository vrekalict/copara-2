import type { LegalSection } from "./types";

export const PRIVACY_INTRO =
  'This Privacy Policy describes how Copara ("we", "us", "our") collects, uses, discloses, retains, and protects personal information when you use our co-parenting coordination platform, website, and related services.';

export const PRIVACY_PREAMBLE = [
  "Copara is designed for Canadian users, including users in Quebec. This policy explains our practices in plain language and identifies your privacy rights under applicable Canadian law.",
  "This Privacy Policy forms part of our Terms and Conditions. By using Copara, you acknowledge the practices described here.",
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "privacy-officer",
    title: "Privacy officer and contact",
    paragraphs: [
      "Copara has designated a privacy officer responsible for ensuring compliance with applicable privacy laws and responding to privacy inquiries.",
      "Privacy officer and privacy inquiries: legal@copara.ca",
      "General support: support@copara.ca",
      "Mailing address: Available upon request by email to legal@copara.ca.",
    ],
  },
  {
    id: "scope",
    title: "Scope and application",
    paragraphs: [
      "This Privacy Policy applies to personal information we collect through Copara, including our website, web application, progressive web app, communications, exports, verification tools, and customer support channels.",
      "For users in Quebec, we handle personal information in accordance with Quebec's Act respecting the protection of personal information in the private sector (Law 25), where applicable.",
      "For users elsewhere in Canada, we handle personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws.",
    ],
  },
  {
    id: "categories",
    title: "Categories of personal information we collect",
    paragraphs: ["We may collect the following categories of personal information:"],
    bullets: [
      "Identity and account information: name, email address, password hash, locale preference, province or territory, notification settings, and account identifiers.",
      "Circle and membership information: circle names, roles, invite status, permissions, and relationships between users in a shared circle.",
      "Co-parenting communications: message content, attachments, delivery and read timestamps, thread membership, and append-only metadata including hash-chain values used for tamper-evident exports.",
      "Child-related information: names, dates of birth, school details, medical notes, emergency contacts, and documents uploaded to the Info Vault, subject to sharing settings you control.",
      "Scheduling and activity information: parenting schedules, calendar events, exchange reminders, check-in verification results, and related timestamps.",
      "Financial information: shared expenses, split percentages, reimbursement requests, receipt images, dispute notes, and payment-related identifiers when you subscribe to a paid plan.",
      "Documents and files: documents, photos, and other files you upload to Copara, including vault items, message attachments, journal entries, and album content.",
      "AI processing data: drafts submitted for tone review or rewriting, selected conversations for summaries, AI outputs, acceptance or rejection of suggestions, and related audit metadata.",
      "Professional access records: information about professionals connected to circles and permissions granted by parents.",
      "Technical and usage information: IP address, browser type, device information, log data, session identifiers, cookies required for authentication, locale cookies, and optional analytics events.",
      "Support and waitlist information: information you provide when contacting support, requesting early access, or joining a waitlist.",
    ],
  },
  {
    id: "purposes",
    title: "Purposes of collection and use",
    paragraphs: ["We use personal information for the following purposes:"],
    bullets: [
      "To create and manage your account and authenticate you securely.",
      "To operate Copara, including messaging, scheduling, expense tracking, document storage, exports, and shared circle functionality.",
      "To deliver notifications, reminders, and service-related communications you expect from the product.",
      "To provide AI-assisted features you request, such as tone review, rewrites, and summaries.",
      "To generate tamper-evident exports and verification features.",
      "To process subscriptions, billing, and payment-related transactions.",
      "To provide customer support and respond to inquiries.",
      "To secure the service, detect abuse, prevent fraud, and maintain system integrity.",
      "To comply with legal obligations and respond to lawful requests.",
      "To improve Copara, diagnose errors, and develop new features, using aggregated or de-identified data where practicable.",
    ],
  },
  {
    id: "legal-bases",
    title: "Consent and legal bases",
    paragraphs: [
      "We collect and use personal information based on your consent, our contractual need to provide the service, compliance with legal obligations, and our legitimate interests in operating a secure and reliable co-parenting platform, balanced against your privacy rights.",
      "You may withdraw consent for non-essential processing where permitted by law. Withdrawal may limit your ability to use certain features. Some processing is necessary to maintain shared records, security, billing, or legal compliance.",
    ],
  },
  {
    id: "ai-processing",
    title: "AI processing",
    paragraphs: [
      "Copara may use automated systems, including third-party AI models, to provide tone review, message rewriting, summaries, dispute summaries, and related assistive features.",
      "When you submit content for AI-assisted review, we process the content you provide for that specific request. AI outputs are suggestions only and are not automatically added to your shared co-parenting record unless you choose to send, save, or export them.",
      "We maintain audit logs of AI-assisted requests for accountability, rate limiting, and service improvement. Logs may include hashed input identifiers, output metadata, model information, and timestamps.",
      "AI processing may occur through service providers located outside Canada. Where required by law, we assess such processing and apply contractual and technical safeguards.",
      "Depending on applicable law, you may have rights regarding automated processing, including the right to request information about automated decisions, object to certain processing, or request human review. Contact legal@copara.ca to exercise these rights.",
    ],
  },
  {
    id: "sharing",
    title: "How we share personal information",
    paragraphs: ["We do not sell your personal information. We may share personal information in the following circumstances:"],
    bullets: [
      "Within your circle: with other authorized circle members according to your role, permissions, and product settings.",
      "With professionals: when parents grant read-only or other permitted access to a professional user.",
      "With service providers: who process data on our behalf under contractual safeguards (see Service providers below).",
      "For legal and safety reasons: when required or permitted by law, to protect safety, or to investigate abuse, fraud, or security incidents.",
      "In connection with a business transaction: such as a merger, acquisition, or asset sale, subject to applicable law and appropriate safeguards.",
    ],
  },
  {
    id: "service-providers",
    title: "Service providers",
    paragraphs: [
      "We rely on trusted service providers to operate Copara. These providers process personal information on our behalf and are contractually required to protect it. Current categories of providers include:",
    ],
    bullets: [
      "Supabase — database, authentication, file storage, and realtime infrastructure.",
      "Vercel — website and application hosting.",
      "OpenAI — server-side AI processing for assistive features you request.",
      "Resend — transactional email delivery.",
      "Payment processors — subscription and billing when you purchase a paid plan.",
    ],
  },
  {
    id: "cross-border",
    title: "Cross-border transfers",
    paragraphs: [
      "Personal information may be stored or processed in Canada, the United States, or other jurisdictions where our service providers operate.",
      "When personal information is transferred outside your province or outside Canada, we assess the transfer and implement safeguards intended to protect the information, including contractual protections, encryption in transit, and access controls.",
      "For Quebec users, cross-border transfers are handled in accordance with Law 25 requirements, including privacy impact assessments and contractual safeguards where required.",
    ],
  },
  {
    id: "retention",
    title: "Retention",
    paragraphs: [
      "We retain personal information for as long as necessary to provide Copara, maintain shared co-parenting records, comply with legal obligations, resolve disputes, enforce our Terms, and maintain security.",
      "Because Copara is designed for shared, timestamped records, certain information — including sent messages and financial logs — may be retained even after you close your account where retention is necessary for record integrity, other circle members, legal compliance, or dispute resolution.",
      "AI audit logs, security logs, billing records, and legal acceptance records are retained according to our operational and compliance requirements.",
      "When retention is no longer required and deletion is permitted, we delete or de-identify personal information using reasonable technical and organizational measures.",
    ],
  },
  {
    id: "rights-canada",
    title: "Your privacy rights in Canada",
    paragraphs: [
      "Depending on your province or territory, you may have the following rights, subject to legal and contractual limits:",
    ],
    bullets: [
      "Access — request information about the personal information we hold about you.",
      "Correction — request correction of inaccurate or incomplete personal information.",
      "Withdrawal of consent — withdraw consent for non-essential processing where applicable.",
      "Deletion — request deletion of personal information where permitted by law.",
      "Portability — request a copy of certain personal information in a usable format where applicable.",
      "Complaint — lodge a complaint with us or with a relevant privacy regulator.",
    ],
  },
  {
    id: "rights-quebec",
    title: "Quebec Law 25 rights",
    paragraphs: [
      "If you are in Quebec, you have additional rights under Law 25, which may include:",
    ],
    bullets: [
      "The right to be informed about the collection, use, and communication of your personal information.",
      "The right to access your personal information and obtain information about how it is used.",
      "The right to request correction of inaccurate, incomplete, or ambiguous personal information.",
      "The right to withdraw consent to the collection, use, or communication of personal information, subject to legal and contractual limits.",
      "The right to request cessation of dissemination of personal information or de-indexation in certain circumstances.",
      "The right to data portability in certain circumstances.",
      "The right to be informed about automated decisions and, where applicable, request human review.",
      "The right to designate a person to exercise certain privacy rights on your behalf in certain circumstances.",
    ],
  },
  {
    id: "exercising-rights",
    title: "Exercising your rights",
    paragraphs: [
      "To exercise your privacy rights, contact legal@copara.ca with sufficient information to verify your identity and describe your request. We will respond within the timeframe required by applicable law.",
      "Because Copara maintains shared records, some deletion or correction requests may be limited where retention is necessary for other circle members, record integrity, legal compliance, or dispute resolution.",
    ],
  },
  {
    id: "children",
    title: "Children's information",
    paragraphs: [
      "Copara is not directed at children to create their own accounts. Children may not register for Copara independently.",
      "Parents, legal guardians, and authorized adults may enter information about children for co-parenting coordination purposes. By entering information about a child, you represent that you have the legal authority to provide that information and to share it according to your circle settings.",
      "If you believe we have collected a child's personal information improperly, contact legal@copara.ca.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information, including encryption in transit, access controls, and row-level security policies that limit database access to authorized circle members.",
      "No method of transmission or storage is completely secure. We cannot guarantee that unauthorized access, disclosure, loss, misuse, or alteration will never occur.",
      "You are responsible for maintaining the confidentiality of your login credentials and for activity under your account.",
    ],
  },
  {
    id: "breaches",
    title: "Confidentiality incidents and breaches",
    paragraphs: [
      "If we become aware of a confidentiality incident, privacy breach, or security incident involving personal information that requires notice under applicable law, we will take steps required by law.",
      "Depending on the circumstances and applicable law, this may include notifying affected individuals, the Office of the Privacy Commissioner of Canada, the Commission d'accès à l'information du Québec, or other required parties.",
      "We maintain internal procedures to assess, contain, investigate, and respond to incidents involving personal information.",
    ],
  },
  {
    id: "casl",
    title: "Communications and CASL",
    paragraphs: [
      "We send service-related communications because you use Copara, including account notices, security alerts, subscription notices, message alerts, schedule reminders, export notices, and support replies. These are not promotional messages.",
      "Where we send promotional or marketing communications, we do so in accordance with Canada's Anti-Spam Legislation (CASL), where applicable. Marketing messages identify the sender, provide contact information, and include an unsubscribe mechanism.",
      "You may manage notification preferences in your account settings where available.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    paragraphs: [
      "We use cookies and similar technologies necessary for authentication, session management, and locale preferences.",
      "Optional analytics cookies may be used to understand product usage if enabled. You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. When we make material changes, we will provide notice through the app, by email, or by another reasonable method. The updated policy will state a new last updated date.",
      "Where required by law, material changes will take effect only after any required notice period or consent process.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      "Privacy officer and privacy inquiries: legal@copara.ca",
      "General support: support@copara.ca",
      "Legal inquiries: legal@copara.ca",
    ],
  },
];
