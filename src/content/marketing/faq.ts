import type { FaqItem } from "@/lib/marketing/schema";

export const FAQ_GENERAL: FaqItem[] = [
  {
    question: "What is Copara?",
    answer:
      "Copara is a Canadian co-parenting platform that helps separated parents communicate more neutrally, coordinate custody schedules, track shared expenses, store child information, and export tamper-evident records suitable for review by legal professionals. It works as a progressive web app on iOS, Android, and the web with no app store install required.",
  },
  {
    question: "Who is Copara for?",
    answer:
      "Copara is built for separated and divorced parents who want clearer communication and better-organized records, especially when conversations about pickup times, expenses, or schedules tend to escalate. It is also designed for mediators, family lawyers, and parenting coordinators who need structured access to shared information.",
  },
  {
    question: "Is Copara only for divorced parents?",
    answer:
      "No. Copara is for any co-parenting arrangement where two parents (or caregivers) need a shared, neutral place to coordinate, including separated parents who were never married, parents with interim agreements, and families working with professionals during mediation.",
  },
  {
    question: "Does my co-parent need to join?",
    answer:
      "Copara works best when both parents are in the same circle. Messaging, schedule change requests, expense approvals, and shared records require both sides to participate. One parent can start a circle and invite the other by email; they can respond from the web without installing an app.",
  },
  {
    question: "Can professionals use Copara?",
    answer:
      "Yes. Mediators, family lawyers, and parenting coordinators can apply for design partner access during early access. Professionals can view connected circles where parents grant permission, generate dispute summaries, and export organized records, read-only by default.",
  },
  {
    question: "Is Copara available in Canada?",
    answer:
      "Yes. Copara is Canadian-focused: pricing is in CAD, privacy framing reflects PIPEDA expectations, and the product supports English and French from day one.",
  },
  {
    question: "Does Copara work in English and French?",
    answer:
      "Yes. Copara supports English and French across the app interface. You can switch languages at any time.",
  },
];

export const FAQ_AI: FaqItem[] = [
  {
    question: "Does the AI write messages for me?",
    answer:
      "No. Copara's Steady Send feature offers optional rewrite suggestions before you send. You choose whether to use a suggestion, edit it further, or send your original message as-is. The AI never sends on your behalf.",
  },
  {
    question: "Does the AI take sides?",
    answer:
      "No. Steady Send and dispute summaries are designed to stay neutral. They do not assign blame, predict court outcomes, or advocate for one parent over another.",
  },
  {
    question: "Does Copara provide legal advice?",
    answer:
      "No. Copara is not a law firm and does not provide legal advice. AI summaries and tone suggestions are assistive tools only. Consult a qualified professional for legal questions about your situation.",
  },
  {
    question: "Can I send my original message anyway?",
    answer:
      "Always. Steady Send never blocks sending. If you disagree with a suggestion, tap send and your original draft goes through unchanged.",
  },
  {
    question: "What does the dispute summary include?",
    answer:
      "A dispute summary covers a date range or topic you choose. It includes a timeline of relevant messages and events, each party's stated positions where visible in the record, unresolved items, and citations back to original message IDs. Summaries are clearly marked as AI-generated and are not legal advice.",
  },
];

export const FAQ_RECORDS: FaqItem[] = [
  {
    question: "Are Copara records court-certified?",
    answer:
      "No. Copara does not claim that exports are certified, court-approved, or guaranteed admissible. Exports are tamper-evident, timestamped records suitable for review by legal professionals. Verification details are included so a recipient can check integrity.",
  },
  {
    question: "What does tamper-evident mean?",
    answer:
      "Each message in a thread is linked in a hash chain. When you export records, the PDF includes a verification digest. Anyone with the export can visit the public verification page to confirm the export matches the stored chain and detect if content was altered after export.",
  },
  {
    question: "Can I export messages?",
    answer:
      "Yes. Export message threads by date range to PDF. Exports include server timestamps, participant information, and hash-chain verification instructions.",
  },
  {
    question: "Can I export expenses and schedules?",
    answer:
      "Yes. You can export expense history, calendar and parenting-time records, check-in logs, and schedule change requests alongside messages, depending on what you select in the export wizard.",
  },
  {
    question: "Can a lawyer or mediator review my records?",
    answer:
      "Yes, when you grant access. Parents control whether a professional is connected to a circle. Professionals with permission can view shared threads and records read-only and generate summaries or exports for their workflow.",
  },
];

export const FAQ_PRIVACY: FaqItem[] = [
  {
    question: "Can my co-parent see my private notes?",
    answer:
      "Copara is built around shared circle records: messages, approved calendar changes, and logged expenses are visible to circle members according to role. There is no hidden messaging channel between parents. Vault sharing for child information is controlled by parents.",
  },
  {
    question: "Does Copara track my location?",
    answer:
      "Exchange check-ins use location only to verify arrival at an expected exchange point. Copara does not provide continuous GPS tracking or a live location map between parents.",
  },
  {
    question: "Are raw GPS coordinates shared?",
    answer:
      "No. Raw GPS coordinates are not shared between parents. Check-ins store a verified or not verified result and timestamp, not a sharable map pin the other parent can browse.",
  },
  {
    question: "How is child information stored?",
    answer:
      "Child profiles, medical notes, school details, and documents live in the Info Vault per circle. Parents choose what third parties or professionals can see. Data is protected by row-level security in our database.",
  },
  {
    question: "Can I remove a professional from my circle?",
    answer:
      "Yes. Parents control professional access. You can revoke a professional's connection to your circle when they no longer need access.",
  },
];

export const FAQ_PRICING: FaqItem[] = [
  {
    question: "How much does Copara cost?",
    answer:
      "During early access: Parent Monthly is CAD $8/month per parent; Parent Yearly is CAD $72/year (CAD $6/month equivalent); Family Circle is CAD $12/month or CAD $108/year for both parents in one circle.",
  },
  {
    question: "Is there monthly and yearly billing?",
    answer:
      "Yes. Every parent plan is available month-to-month or yearly. Yearly billing saves compared to paying monthly for twelve months.",
  },
  {
    question: "Is there a family plan?",
    answer:
      "Yes. Family Circle covers both parents in one circle at CAD $12/month or CAD $108/year, one lower shared cost instead of two separate subscriptions.",
  },
  {
    question: "Do professionals pay?",
    answer:
      "Design partner access for mediators, family lawyers, and parenting coordinators is free during early access while we refine the professional dashboard with real practitioners.",
  },
  {
    question: "Is early access pricing permanent?",
    answer:
      "Early access pricing may change before general availability. We will give active users reasonable notice before any price increase. Joining during early access helps shape the product and locks in current published rates for your billing term.",
  },
  {
    question: "Are exports included?",
    answer:
      "Yes. Exports are included with no per-export fees during early access. We believe organized records should not be nickel-and-dimed.",
  },
  {
    question: "Do both parents need to pay?",
    answer:
      "Not necessarily. Each parent can subscribe individually (Parent Monthly or Yearly), or you can choose Family Circle so one subscription covers both parents in the circle. Only one paying parent is required for Family Circle.",
  },
];

export const FAQ_ALL: FaqItem[] = [
  ...FAQ_GENERAL,
  ...FAQ_AI,
  ...FAQ_RECORDS,
  ...FAQ_PRIVACY,
  ...FAQ_PRICING,
];

export const FAQ_PRICING_PAGE: FaqItem[] = [
  FAQ_PRICING[0]!,
  FAQ_PRICING[6]!,
  FAQ_PRICING[2]!,
  FAQ_PRICING[3]!,
  FAQ_PRICING[4]!,
  FAQ_PRICING[5]!,
  FAQ_PRICING[1]!,
];

export const FAQ_PROFESSIONALS: FaqItem[] = [
  {
    question: "Who qualifies as a design partner?",
    answer:
      "Licensed or practicing mediators, family lawyers, and parenting coordinators working with separated families in Canada. We prioritize professionals who will use Copara with real cases and give structured feedback.",
  },
  {
    question: "What can professionals see?",
    answer:
      "Read-only access to threads, calendar, and expenses parents choose to share with the circle. Professionals cannot message as a parent or edit records.",
  },
  {
    question: "Can I invite both parents at once?",
    answer:
      "Yes. The professional dashboard includes a dual-parent invite link so you can onboard both sides to the same circle, reducing the two-sided adoption problem.",
  },
  {
    question: "Is design partner access really free?",
    answer:
      "Yes during early access. We are not charging professionals while the dashboard is in active development with design partners.",
  },
];

export const HOME_FAQ: FaqItem[] = [
  FAQ_GENERAL[0]!,
  FAQ_RECORDS[1]!,
  FAQ_PRICING[6]!,
  FAQ_AI[2]!,
];
