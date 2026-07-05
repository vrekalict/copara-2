import type { LegalSection } from "./types";

export const TERMS_INTRO =
  'These Terms and Conditions ("Terms") govern your access to and use of Copara, including our website, web application, mobile experiences, communications, exports, verification tools, and related services.';

export const TERMS_PREAMBLE = [
  "By creating an account, subscribing, accepting an invitation, accessing a shared circle, or otherwise using Copara, you agree to these Terms and to our Privacy Policy.",
  "If you do not agree to these Terms, do not use Copara.",
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "about-copara",
    title: "About Copara",
    paragraphs: [
      "Copara is a co-parenting coordination and recordkeeping platform designed to help parents, guardians, and authorized professionals organize parenting-related information, communications, schedules, documents, reminders, expenses, exports, and related records.",
      "Copara is intended to support better organization and communication. Copara is not a law firm, mediator, arbitrator, court, medical provider, therapist, counsellor, child-protection agency, or emergency service.",
    ],
  },
  {
    id: "language-quebec",
    title: "Language availability for Quebec users",
    paragraphs: [
      "If you are a consumer located in Quebec, these Terms and related consumer contract documents are available in French.",
      "Before agreeing to be bound by the English version of these Terms, you will be given access to the French version. You may choose to continue in English only after the French version has been made available to you.",
      "By selecting the English version, creating an account, subscribing, or continuing to use Copara after being given access to the French version, you confirm that you have chosen to be bound by the English version of these Terms, to the extent permitted by applicable Quebec law.",
      "If you do not wish to proceed in English, you may use the French version of these Terms.",
      "Nothing in this section limits any right you may have under Quebec's Charter of the French Language, Quebec's Consumer Protection Act, or any other applicable Quebec law.",
    ],
  },
  {
    id: "acceptance",
    title: "Acceptance of these Terms",
    paragraphs: [
      "You accept these Terms when you create an account, subscribe to a paid plan, accept an invitation to a Copara circle, click an acceptance button, or use Copara.",
      "If you use Copara on behalf of another person, organization, professional practice, or legal entity, you represent that you have authority to accept these Terms on their behalf.",
      'Copara may update these Terms from time to time. When we make material changes, we will provide notice through the app, by email, or by another reasonable method. The updated Terms will state the new "Last updated" date.',
      "Where required by law, material changes will take effect only after any required notice period or consent process. Continued use of Copara after updated Terms take effect means you accept the updated Terms, to the extent permitted by applicable law.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "You must be at least the age of majority in your province or territory of residence to create a Copara account.",
      "The age of majority is 18 in Alberta, Manitoba, Ontario, Prince Edward Island, Quebec, and Saskatchewan.",
      "The age of majority is 19 in British Columbia, New Brunswick, Newfoundland and Labrador, Nova Scotia, the Northwest Territories, Nunavut, and Yukon.",
      "Copara is not directed at children. Children may not create their own Copara accounts.",
      "Information about children may be entered into Copara by a parent, legal guardian, or other authorized adult. By entering information about a child, you represent that you have the legal authority to provide that information and to use Copara in connection with that child.",
    ],
  },
  {
    id: "account-responsibilities",
    title: "Account responsibilities",
    paragraphs: [
      "You are responsible for providing accurate account information and keeping it up to date.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "You must notify us promptly if you believe your account has been accessed without authorization or if your login credentials have been compromised.",
      "You may not share your account login with another person or allow another person to impersonate you.",
    ],
  },
  {
    id: "circles-invitations",
    title: "Circles, invitations, and shared access",
    paragraphs: [
      "Copara may allow users to create or join shared parenting circles, professional circles, or other collaborative spaces.",
      "When you invite another person to a circle, you are responsible for ensuring that the invitation is appropriate and lawful.",
      "When you join a circle, certain information may be visible to other circle members depending on your role, permissions, and product settings.",
      "You understand that information shared in a circle may be viewed by other authorized circle members and may form part of the shared co-parenting record.",
    ],
  },
  {
    id: "co-parenting-records",
    title: "Co-parenting records",
    paragraphs: [
      "Copara is designed to create organized, timestamped records among authorized circle members.",
      "Certain records, including sent messages, may be append-only. This means they cannot be edited or deleted after they are sent.",
      "Append-only records are intended to preserve the integrity of the shared record. They do not guarantee that a statement is accurate, complete, lawful, appropriate, or accepted by any court, tribunal, lawyer, mediator, professional, or government agency.",
      "Only the content actually entered, sent, uploaded, scheduled, confirmed, or recorded in Copara forms part of the Copara record.",
      "Drafts, AI suggestions, tone-review suggestions, summaries, and other generated content do not become part of the co-parenting record unless you choose to send, save, export, or otherwise use them in a way that creates a record.",
    ],
  },
  {
    id: "exports-verification",
    title: "Exports and verification",
    paragraphs: [
      "Copara may allow users to generate exports of certain records, subject to subscription status, permissions, product availability, and technical limitations.",
      "Exports may include messages, timestamps, schedules, expenses, documents, activity logs, or other records depending on the selected export type.",
      "Some exports may include tamper-evident verification features, including cryptographic hashes or hash-chain verification. These features are intended to help confirm that an exported file matches the data recorded at the time of export.",
      "Verification confirms data integrity only. Verification does not confirm the truthfulness, accuracy, completeness, legality, relevance, admissibility, or evidentiary weight of the underlying content.",
      "Copara exports are not certified, notarized, court-approved, court-filed, or guaranteed to be accepted in any legal proceeding.",
      "Whether a court, tribunal, mediator, arbitrator, lawyer, professional, agency, or other decision-maker accepts or relies on a Copara export is determined by that person or body under their own rules and discretion.",
      "Public or shareable verification links are intended to expose only the information necessary to verify the integrity of an export. They are not intended to disclose message content or personal information to anyone who does not already possess the export file.",
    ],
  },
  {
    id: "ai-features",
    title: "AI-assisted features",
    paragraphs: [
      "Copara may include AI-assisted features, including tone review, message rewriting, summaries, dispute summaries, communication suggestions, organization tools, or other automated assistance.",
      "AI-assisted features are drafting and organization aids only. They are not legal advice, parenting advice, mental-health advice, medical advice, mediation, arbitration, counselling, child-protection advice, or professional judgment.",
      "AI outputs may be inaccurate, incomplete, biased, outdated, inappropriate, or unsuitable for your situation.",
      "You are solely responsible for reviewing any AI output before using it, sending it, relying on it, or sharing it.",
      "AI features do not verify the truth of anything you or another user writes. AI features do not take sides, determine fault, determine parenting rights, determine legal obligations, or decide what is in a child's best interests.",
      "To provide AI-assisted features, Copara may process the content you submit for review, such as draft messages, selected conversations, notes, or records. This processing may involve third-party service providers, as described in our Privacy Policy.",
      "If applicable privacy law gives you the right to request information about automated processing, object to certain automated decisions, or request human review of a decision based exclusively on automated processing, those rights are described in our Privacy Policy.",
    ],
  },
  {
    id: "no-advice",
    title: "No legal, professional, or emergency advice",
    paragraphs: [
      "Copara does not provide legal advice.",
      "Nothing in Copara, including templates, summaries, tone review, message suggestions, exports, verification tools, or support communications, creates a lawyer-client, mediator-client, therapist-client, doctor-patient, fiduciary, or other professional relationship.",
      "You should consult a qualified lawyer, mediator, parenting coordinator, medical professional, mental-health professional, or other appropriate professional for advice about your specific situation.",
      "Copara is not an emergency service. If you believe a child, parent, guardian, or any other person is in immediate danger, contact emergency services or the appropriate local authority.",
    ],
  },
  {
    id: "professional-users",
    title: "Professional users",
    paragraphs: [
      "Lawyers, mediators, parenting coordinators, therapists, counsellors, social workers, court workers, and other professionals who use Copara are responsible for complying with their own professional, ethical, confidentiality, conflict-of-interest, supervision, billing, and record-retention obligations.",
      "Copara does not modify, replace, or override any professional obligation that applies to a professional user.",
      "Professional access may be read-only unless the product expressly provides otherwise.",
      "Professional users must not represent Copara exports as certified, notarized, court-approved, or guaranteed to be legally admissible.",
    ],
  },
  {
    id: "user-content",
    title: "User content",
    paragraphs: [
      "You retain ownership of the content you submit to Copara, including messages, notes, schedules, documents, child-related information, expense information, uploaded files, and other records.",
      "You grant Copara a limited licence to host, store, process, reproduce, display, transmit, format, back up, analyze, and use your content as necessary to provide, secure, maintain, improve, and support Copara.",
      "This licence is limited to operating and improving Copara and does not give Copara ownership of your content.",
      "You represent that you have the rights and authority necessary to submit the content you provide to Copara.",
      "You are responsible for the accuracy, legality, appropriateness, and completeness of the content you submit.",
    ],
  },
  {
    id: "sensitive-information",
    title: "Sensitive information",
    paragraphs: [
      "Copara may process sensitive personal information, including information about children, parenting schedules, school details, medical details, expenses, family circumstances, messages, and co-parenting records.",
      "You should only enter sensitive information when it is necessary and appropriate for your use of Copara.",
      "You should not enter information that you are not legally permitted to share.",
      "You should not use Copara to unlawfully monitor, harass, threaten, intimidate, impersonate, pressure, or control another person.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Our collection, use, disclosure, retention, transfer, and protection of personal information is described in our Privacy Policy, which forms part of these Terms.",
      "By using Copara, you acknowledge that your personal information will be handled as described in our Privacy Policy.",
      "For users located in Quebec, Copara handles personal information in accordance with Quebec's Act respecting the protection of personal information in the private sector, commonly referred to as Law 25, where applicable.",
      "For users outside Quebec, Copara handles personal information in accordance with the Personal Information Protection and Electronic Documents Act, known as PIPEDA, and other applicable Canadian privacy laws.",
      "Some personal information may be processed by service providers located outside your province, outside Quebec, or outside Canada. Where required by applicable law, Copara will assess such transfers and use contractual, technical, and organizational safeguards intended to protect the information.",
    ],
  },
  {
    id: "security-incidents",
    title: "Confidentiality incidents and security",
    paragraphs: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information.",
      "No system can be guaranteed to be completely secure. We cannot guarantee that unauthorized access, disclosure, loss, misuse, or alteration will never occur.",
      "If we become aware of a confidentiality incident, privacy breach, or security incident that requires notice under applicable law, we will take steps required by law, which may include notifying affected individuals, regulators, or other required parties.",
    ],
  },
  {
    id: "safety-disclosures",
    title: "Safety-related disclosures",
    paragraphs: [
      "Copara is designed for private co-parenting coordination, but privacy and confidentiality are not absolute.",
      "Where we reasonably believe there is an imminent risk of harm to a child, user, or another person, or where disclosure is required or permitted by law, we may preserve, use, or disclose information to appropriate authorities, emergency services, legal representatives, regulators, or other relevant parties.",
      "We may also preserve or disclose information when necessary to investigate abuse, fraud, security threats, illegal activity, violations of these Terms, or risks to the safety of any person.",
    ],
  },
  {
    id: "casl",
    title: "Emails, texts, push notifications, and CASL",
    paragraphs: [
      "Copara may send you service-related communications, including account notices, security alerts, subscription notices, new-message alerts, schedule reminders, exchange reminders, export notices, support replies, and important product updates.",
      "These account and service communications are sent because you use Copara and are not promotional messages.",
      "Where Copara sends promotional or marketing messages, we will do so in accordance with Canada's Anti-Spam Legislation, known as CASL, where applicable.",
      "Marketing messages will identify the sender, provide contact information, and include a working unsubscribe mechanism. We will honour unsubscribe requests within the time required by law.",
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions, billing, and payment",
    paragraphs: [
      "Copara may offer free plans, paid plans, early-access plans, trials, monthly subscriptions, annual subscriptions, add-ons, professional plans, or other paid features.",
      "Paid plans are billed in Canadian dollars unless otherwise stated at checkout.",
      "Pricing, features, limits, renewal terms, taxes, and billing frequency are described on the pricing page, checkout page, order form, or in-app purchase flow presented to you at the time of purchase.",
      "By subscribing to a paid plan, you authorize Copara and its payment processor to charge the applicable fees, taxes, and recurring amounts using your selected payment method.",
      "Subscriptions renew automatically unless cancelled before the renewal date according to the cancellation process presented at purchase or in your account settings.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancellations and refunds",
    paragraphs: [
      "You may cancel your subscription according to the cancellation process available in your account settings or through the payment platform used for your purchase.",
      "Cancelling a subscription stops future renewal charges. It does not automatically delete your account or remove records from shared circles.",
      "Refunds are handled according to the refund policy presented at purchase or published by Copara.",
      "Nothing in these Terms limits any statutory cancellation, refund, chargeback, or consumer-protection right that cannot be waived under the laws of your province or territory.",
    ],
  },
  {
    id: "early-access",
    title: "Sign up and beta features",
    paragraphs: [
      "Copara may offer early-access, beta, preview, experimental, or limited-release features.",
      "Early-access and beta features may be incomplete, unstable, unavailable, changed, suspended, removed, or modified at any time.",
      "Early-access pricing, discounts, limits, and features are not guaranteed to continue after general availability unless expressly stated in writing.",
      "We will provide reasonable advance notice before a material price increase takes effect for an existing paid subscription, where required by applicable law.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["You agree to use Copara lawfully, respectfully, and only for its intended purposes.", "You may not:"],
    bullets: [
      "harass, threaten, intimidate, abuse, defame, impersonate, exploit, or harm another person;",
      "use Copara to facilitate coercive control, stalking, surveillance, harassment, or family violence;",
      "upload unlawful, harmful, fraudulent, misleading, defamatory, hateful, exploitative, or abusive content;",
      "submit content that violates another person's privacy, confidentiality, intellectual property, or legal rights;",
      "attempt to access another user's account or data without authorization;",
      "scrape, crawl, copy, harvest, or extract data from Copara except through features we provide;",
      "reverse engineer, interfere with, overload, disrupt, or compromise Copara or its security;",
      "use Copara to send spam, malware, phishing messages, or malicious content;",
      "misrepresent Copara exports, verification results, AI outputs, or records;",
      "use Copara in a way that violates applicable law, court orders, parenting orders, restraining orders, protection orders, professional obligations, or these Terms.",
    ],
  },
  {
    id: "enforcement",
    title: "Enforcement",
    paragraphs: [
      "We may suspend, restrict, or terminate access to Copara if we reasonably believe that you have violated these Terms, failed to pay required fees, created legal risk, created a security risk, misused the service, or created a credible risk of harm to a child, user, or another person.",
      "Where practicable, we will provide notice before suspension or termination. We may act without prior notice where we reasonably believe notice would create a safety risk, security risk, legal risk, or risk of further harm.",
    ],
  },
  {
    id: "service-availability",
    title: "Service availability and changes",
    paragraphs: [
      "We may modify, update, suspend, discontinue, replace, or limit any part of Copara at any time.",
      "We may perform maintenance, updates, or security work that temporarily affects availability.",
      "We do not guarantee uninterrupted access, error-free operation, permanent availability of any feature, or compatibility with every device, browser, operating system, or third-party platform.",
    ],
  },
  {
    id: "third-party",
    title: "Third-party services",
    paragraphs: [
      "Copara may rely on third-party service providers for hosting, storage, analytics, payments, email, text messaging, push notifications, AI processing, customer support, security, and other functions.",
      "Third-party services may have their own terms, privacy notices, fees, limitations, and availability issues.",
      "Copara is not responsible for third-party services that we do not control, except to the extent required by applicable law.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      "Copara, including its software, design, branding, trademarks, logos, workflows, documentation, templates, verification tools, and other materials, is owned by Copara or its licensors.",
      "These Terms do not transfer any ownership rights in Copara to you.",
      "You may not copy, modify, distribute, sell, lease, sublicense, reverse engineer, or create derivative works based on Copara except as expressly permitted by law or by written permission from Copara.",
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    paragraphs: [
      "If you provide feedback, suggestions, ideas, bug reports, feature requests, or other comments about Copara, you grant Copara permission to use that feedback without restriction or compensation to you.",
      "We are not required to use, implement, respond to, or keep confidential any feedback you provide.",
    ],
  },
  {
    id: "account-closure",
    title: "Account closure and retention",
    paragraphs: [
      "You may stop using Copara at any time.",
      "You may request account closure according to the process described in the app or Privacy Policy.",
      "Closing your account may not delete all records immediately. Some records may be retained where necessary to preserve the shared co-parenting record for other circle members, comply with legal obligations, resolve disputes, prevent fraud or abuse, enforce these Terms, maintain security, or comply with our Privacy Policy.",
      "Because Copara is designed for shared records, one user's account closure may not remove records that are also part of another user's circle, export, audit trail, or shared parenting record.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      'Copara is provided "as is" and "as available," to the fullest extent permitted by applicable law.',
      "We do not guarantee that Copara will be uninterrupted, secure, error-free, accurate, complete, current, admissible in court, suitable for your legal situation, or suitable for your family circumstances.",
      "We do not guarantee that AI outputs will be accurate, neutral, complete, appropriate, or accepted by any person or authority.",
      "We do not guarantee that exports, verification tools, records, reminders, schedules, expense tools, or summaries will achieve any particular legal, parenting, financial, professional, or practical outcome.",
      "Nothing in these Terms excludes, restricts, or modifies any condition, warranty, legal guarantee, or consumer right that applicable law does not permit us to exclude, restrict, or modify.",
    ],
  },
  {
    id: "limitation-liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by applicable law, Copara and its operators, directors, officers, employees, contractors, service providers, and licensors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, goodwill, data, records, opportunities, or business, arising from or related to your use of Copara.",
      "To the fullest extent permitted by applicable law, Copara's total aggregate liability for all claims relating to the service is limited to the greater of: the amount you paid to Copara in the twelve months before the event giving rise to the claim; or CAD $100.",
      "These limitations apply whether the claim is based in contract, tort, negligence, strict liability, statute, equity, or any other legal theory.",
      "These limitations do not apply to liability that cannot be limited or excluded under applicable law, including liability for gross negligence, wilful misconduct, fraud, or death or personal injury caused by negligence.",
      "Nothing in this section limits any non-waivable right you may have under applicable Canadian federal, provincial, or territorial consumer protection, privacy, or civil law, including Quebec's Consumer Protection Act or Quebec privacy law.",
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    paragraphs: [
      "To the fullest extent permitted by applicable law, you agree to indemnify and hold Copara harmless from claims, losses, liabilities, damages, costs, and expenses, including reasonable legal fees, arising from: your misuse of Copara; your violation of these Terms; your violation of applicable law; content you submit to Copara; your violation of another person's rights; your improper invitation of another person to a circle; or your misuse or misrepresentation of exports, verification results, AI outputs, or Copara records.",
      "This section does not apply to the extent prohibited by applicable consumer protection law.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: [
      "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable in Ontario, without regard to conflict-of-law principles.",
      "Subject to the consumer-protection carve-outs below, disputes relating to these Terms or Copara will be brought in the courts of Ontario, Canada.",
      "If you are a consumer resident in Quebec, nothing in these Terms deprives you of the right to bring a claim in the courts of your place of residence or otherwise limits any protection provided by Quebec's Consumer Protection Act, Quebec's Charter of the French Language, Quebec privacy law, or any other applicable Quebec law.",
      "Nothing in these Terms limits any right you may have under the mandatory laws of your province or territory of residence.",
    ],
  },
  {
    id: "severability",
    title: "Severability",
    paragraphs: [
      "If any part of these Terms is found to be invalid, illegal, or unenforceable, the remaining parts will continue in effect to the fullest extent permitted by law.",
    ],
  },
  {
    id: "no-waiver",
    title: "No waiver",
    paragraphs: [
      "If Copara does not enforce a provision of these Terms, that does not mean Copara has waived the right to enforce that provision later.",
    ],
  },
  {
    id: "assignment",
    title: "Assignment",
    paragraphs: [
      "You may not assign or transfer your rights or obligations under these Terms without Copara's prior written consent.",
      "Copara may assign or transfer these Terms in connection with a merger, acquisition, financing, corporate reorganization, sale of assets, or transfer of the service, provided that the transfer is handled in accordance with applicable law.",
    ],
  },
  {
    id: "entire-agreement",
    title: "Entire agreement",
    paragraphs: [
      "These Terms, together with the Privacy Policy and any additional terms presented to you for specific features or purchases, form the entire agreement between you and Copara regarding your use of the service.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "For legal inquiries: legal@copara.ca",
      "For privacy inquiries: legal@copara.ca",
      "For support: support@copara.ca",
    ],
  },
];
