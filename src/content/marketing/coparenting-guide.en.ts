export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const GUIDE_INTRO = {
  eyebrow: "Resources",
  title: "Organized co-parenting in Canada",
  subtitle: "A Copara guide for separated and divorced parents",
  description:
    "Co-parenting is not one long conversation about the past. It is hundreds of small logistics — school days, medical forms, activity fees, pickup changes — that need to stay accurate when parents no longer share a kitchen table. This guide explains how Canadian families reduce day-to-day friction with clearer records, not louder arguments.",
};

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "scattered-info",
    title: "Scattered information is what turns logistics into conflict",
    paragraphs: [
      "Most co-parenting disputes are not philosophical. They start when two people remember Tuesday differently: who agreed to the swap, whether camp was paid, which parent has the asthma inhaler.",
      "Text messages, email threads, paper calendars, and verbal agreements each hold part of the picture. When nothing is authoritative, every disagreement reopens every old argument.",
      "A practical first step is choosing one shared system for schedules, messages about the children, and financial records. You do not need to agree on everything — you need to agree on where the facts live.",
    ],
  },
  {
    id: "shared-calendar",
    title: "Build a parenting schedule both adults can see — and update in writing",
    paragraphs: [
      "Parenting time works best when both parents can open the same calendar and see the current plan, not the plan from three arguments ago.",
      "When a change is requested, confirm it in writing with the date, time, and reason. \"Can we swap Friday?\" becomes reliable only after both sides acknowledge the new arrangement.",
      "Children benefit from predictability. Adults benefit from fewer \"you never told me\" exchanges. Copara’s shared calendar is designed to keep those updates visible and timestamped.",
    ],
  },
  {
    id: "messages-as-records",
    title: "Treat co-parenting messages as records, not debates",
    paragraphs: [
      "Messages about your child may be read later by a mediator, parenting coordinator, or lawyer. That does not mean every sentence must sound formal — it means staying on topic.",
      "Lead with what you need: a decision, a date, a document, a reimbursement. Skip character judgments unless a professional has asked for context.",
      "Copara Steady Send offers optional rewrite suggestions when wording feels sharp. You decide what sends. The aim is a thread that documents parenting decisions, not relitigates the relationship.",
    ],
  },
  {
    id: "expense-paper-trail",
    title: "Keep a paper trail for child-related expenses",
    paragraphs: [
      "Money conflicts rarely start as math problems. They start when someone cannot find the receipt, prove approval, or remember who already paid for hockey registration.",
      "At the time of each expense, record the amount, category, receipt, and proposed split. Waiting until someone feels resentful guarantees a worse conversation.",
      "Copara expense tracking lets both parents see proposals, uploads, and history in one place — so reimbursement talks stay about numbers, not narratives.",
    ],
  },
  {
    id: "documents-vault",
    title: "Store school, medical, and activity information where both parents can find it",
    paragraphs: [
      "Insurance cards, vaccination records, teacher emails, and emergency contacts should not live in only one parent's inbox. When the other parent needs them at 8 p.m. on a Sunday, searching through old texts is a failure of organization — not proof of bad intent.",
      "Keep current documents in a shared vault both parents can access. Update them when something changes: new school, new medication, new activity schedule.",
      "Good documentation protects children from becoming repeat messengers for information that adults should share directly.",
    ],
  },
  {
    id: "exports-professionals",
    title: "Know what to export — and when to involve a professional",
    paragraphs: [
      "If you work with a mediator, lawyer, or parenting coordinator, organized records save time and cost. Chronological message history, calendar changes, and expense logs are more useful than a folder of screenshots.",
      "Copara exports are tamper-evident summaries designed for professional review. They are not certified court evidence and they do not replace legal advice — but they are clearer than a shoebox of printouts.",
      "Some situations require more than an app: safety concerns, refusal to communicate, or court orders that need enforcement. In those cases, contact a qualified family-law professional in your province. Copara supports coordination; it does not decide custody or resolve abuse.",
    ],
  },
];

export const GUIDE_CLOSING = {
  title: "Less friction on the logistics leaves more room for parenting",
  paragraphs: [
    "You cannot control how your co-parent communicates. You can control whether schedules, receipts, and school updates live in one reliable place.",
    "Copara helps Canadian families coordinate in English and French — shared calendar, messaging, expenses, document vault, and exports built for separated parents who need clarity more than conflict.",
  ],
  primaryLabel: "Start free trial",
  primaryHref: "/sign-up",
  secondaryLabel: "See features",
  secondaryHref: "/features",
};
