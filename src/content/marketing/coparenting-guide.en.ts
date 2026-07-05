export type GuideHighlight = {
  value: string;
  label: string;
};

export type GuideSection = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets: string[];
  tip?: string;
  relatedLink?: { href: string; label: string };
};

export type GuideMistake = {
  title: string;
  body: string;
};

export const GUIDE_INTRO = {
  eyebrow: "Resources",
  title: "The practical co-parenting guide",
  subtitle: "For separated parents in Canada",
  description:
    "Co-parenting succeeds or fails in the small moments: a missed pickup text, a lost receipt, a school notice that never got forwarded. This guide explains how to keep schedules, messages, expenses, and child information organized — so logistics stay factual and children stay out of the middle.",
  primaryLabel: "Start free trial",
  primaryHref: "/sign-up",
  secondaryLabel: "Explore features",
  secondaryHref: "/features",
};

export const GUIDE_HIGHLIGHTS: GuideHighlight[] = [
  { value: "6", label: "Workflows covered in this guide" },
  { value: "1 place", label: "For schedules, messages, and receipts" },
  { value: "EN · FR", label: "Canadian families, both official languages" },
];

export const GUIDE_QUICK_WINS: string[] = [
  "Confirm schedule changes in writing — not through your child.",
  "Upload expense receipts when you pay, not months later.",
  "Keep insurance cards and school contacts in a shared vault.",
  "Write messages as if a mediator may read them later.",
  "Use one calendar both parents can open before arguing about who said what.",
];

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "scattered-info",
    title: "Why scattered information creates conflict",
    summary:
      "Most fights are about missing facts, not bad parenting. When schedules and receipts live in five places, every disagreement reopens old wounds.",
    paragraphs: [
      "Separated parents often manage co-parenting across text threads, email, paper notes, and memory. Each channel holds part of the truth. Neither parent is necessarily wrong — they are working from different records.",
      "The pattern is predictable: a small logistics question becomes a character argument because there is no shared source both people trust. Was Friday agreed to? Did you approve the dental bill? Who has the EpiPen this week?",
      "Fixing this is less about getting along and more about getting organized. Choose one system for parenting schedules, child-related messages, expense records, and key documents. You do not need identical parenting styles — you need identical facts.",
    ],
    bullets: [
      "Pick one shared calendar and treat it as the current plan.",
      "Move child-related conversations off personal SMS when possible.",
      "Save receipts and approvals at the time of purchase.",
      "Store school and medical documents where both parents can access them.",
    ],
    tip: "If you disagree about what happened, check the record first — then discuss what to do next.",
    relatedLink: { href: "/features", label: "See how Copara organizes co-parenting" },
  },
  {
    id: "shared-calendar",
    title: "Shared parenting schedules that both parents can trust",
    summary:
      "Children need predictability. Adults need a calendar that shows the current plan — not the plan from last month's argument.",
    paragraphs: [
      "Parenting time, holidays, school breaks, and activity pickups should be visible to both parents in the same view. When only one parent holds the master calendar, the other parent is always reacting — and children feel the tension at handoffs.",
      "Change requests work best with a simple habit: propose in writing, include date/time/reason, and wait for explicit confirmation before assuming the swap is agreed. \"I thought you knew\" is how custody weekends go sideways.",
      "Copara's shared calendar supports parenting-time blocks, change requests, and exchange check-ins. Check-ins can record whether GPS was provided at handoff time without storing or sharing raw coordinates between parents — useful when handoffs need documentation without surveillance.",
    ],
    bullets: [
      "Enter the baseline schedule first (week-on/week-off, 2-2-3, alternating weekends, etc.).",
      "Propose swaps as requests; confirm in writing before telling the child it's final.",
      "Add school events, medical appointments, and travel dates as soon as you know them.",
      "Review the upcoming week every Sunday — five minutes prevents Friday chaos.",
    ],
    tip: "Tell your child only after both parents have confirmed a schedule change. It avoids painful reversals.",
    relatedLink: { href: "/features/calendar", label: "Calendar & exchange check-ins" },
  },
  {
    id: "messages-as-records",
    title: "Messages that document decisions — not relitigate the relationship",
    summary:
      "Co-parenting threads may be reviewed by mediators, parenting coordinators, or lawyers. Write for clarity, not victory.",
    paragraphs: [
      "A useful co-parenting message answers four questions: What is the issue? What do you need? By when? What information is attached? Everything else is optional.",
      "Sarcasm, name-calling, and rehashing the marriage rarely help resolve today's problem — but they do persist in the record. Steady Send in Copara can suggest calmer wording when you want help. You always choose what sends.",
      "Append-only messaging means messages cannot be edited or deleted after send. That protects both parents: neither side can silently rewrite history.",
    ],
    bullets: [
      "Lead with the child-related request, not a history lesson.",
      "One topic per message when tension is high.",
      "Attach documents instead of describing them from memory.",
      "Pause before replying to provocative texts — respond to the logistics, not the bait.",
    ],
    tip: "Ask yourself: \"If a neutral professional read this tomorrow, would they know what I am asking for?\"",
    relatedLink: { href: "/features/steady-send", label: "Steady Send tone review" },
  },
  {
    id: "expense-paper-trail",
    title: "Child expenses with receipts, categories, and clear splits",
    summary:
      "Money disputes are documentation problems before they are trust problems. Record expenses when they happen.",
    paragraphs: [
      "Child-related costs — sports, medical copays, school fees, clothing — add up quickly. Conflict starts when approval, amount, or timing is unclear. \"You never pay your share\" is impossible to resolve without a paper trail.",
      "At the time of each expense, capture the receipt, category, amount, and proposed split. Note whether the other parent pre-approved unusual costs. Waiting until resentment builds turns reimbursement into a trial about memory.",
      "Copara expense tracking keeps proposals, uploads, and history in one place so conversations stay about numbers.",
    ],
    bullets: [
      "Agree on categories upfront (medical, education, activities, clothing, other).",
      "Photograph or upload receipts the same day when possible.",
      "Flag large or unusual expenses for approval before purchase when your plan requires it.",
      "Review outstanding balances monthly — small drift is easier to fix early.",
    ],
    tip: "A reimbursement request with a receipt attached is a math problem. Without a receipt, it becomes a credibility fight.",
    relatedLink: { href: "/features/expenses", label: "Expense tracking" },
  },
  {
    id: "documents-vault",
    title: "School, medical, and emergency information both parents can reach",
    summary:
      "When only one parent has the insurance card or teacher's email, the child becomes the messenger by default.",
    paragraphs: [
      "Insurance cards, vaccination records, allergy plans, medication schedules, teacher contact details, and activity waivers should live in a shared location — not buried in one person's inbox from two years ago.",
      "Update the vault when something changes: new school, new prescription, new coach, new emergency contact. Outdated information is how missed doses and missed pickups happen.",
      "Copara's Info Vault keeps child-related documents organized and accessible to circle members you authorize. Albums separately handle full-resolution photos in a private family space.",
    ],
    bullets: [
      "Maintain a current medication list with dosages and pharmacy contact.",
      "Store teacher and school office numbers for both households.",
      "Keep copies of court orders or parenting plans in the vault if applicable.",
      "Review vault contents at the start of each school term.",
    ],
    tip: "If your co-parent asks for a document at 8 p.m. on a Sunday, shared access beats a frantic text search.",
    relatedLink: { href: "/features/vault", label: "Info Vault" },
  },
  {
    id: "exports-professionals",
    title: "Exports, professionals, and when you need more than an app",
    summary:
      "Organized records save time with mediators and lawyers. Some situations require professional intervention — know the difference.",
    paragraphs: [
      "If you work with a mediator, parenting coordinator, or family lawyer, chronological message history, calendar changes, and expense logs are far more useful than screenshots scattered across folders.",
      "Copara exports are tamper-evident summaries with verification digests. They demonstrate record integrity — they are not certified court evidence and do not replace legal advice. Admissibility depends on your jurisdiction and the presiding professional.",
      "Seek qualified help for safety concerns, harassment, refusal to communicate about children, or enforcing court orders. Copara supports coordination; it does not decide custody, award support, or resolve abuse.",
    ],
    bullets: [
      "Export records before mediation sessions — not the night before court.",
      "Bring chronological threads, not cherry-picked messages.",
      "Tell your professional what you need: schedule clarity, expense totals, or message patterns.",
      "Follow provincial resources for urgent safety issues involving children.",
    ],
    tip: "Quiet, consistent recordkeeping is more persuasive than announcing that you are \"building a case\" in every message.",
    relatedLink: { href: "/features/records", label: "Tamper-evident exports" },
  },
];

export const GUIDE_MISTAKES: GuideMistake[] = [
  {
    title: "Using children as messengers",
    body: "Schedule changes, money requests, and complaints belong in adult channels. Asking a child to \"tell Mom\" puts them between two people they love.",
  },
  {
    title: "Arguing from memory",
    body: "Without a shared record, every conversation starts at zero. Written confirmation prevents repeat disputes about the same Tuesday.",
  },
  {
    title: "Mixing logistics with grievances",
    body: "A message about pickup time is not the place to reopen last year's fight. Separate threads — or separate sentences — keep logistics moving.",
  },
  {
    title: "Hoarding documents in one inbox",
    body: "When medical or school info lives with one parent only, the other parent looks disorganized when they are actually uninformed.",
  },
];

export const GUIDE_CLOSING = {
  title: "Less chaos on logistics leaves more room for parenting",
  description:
    "You cannot control how your co-parent communicates. You can control whether schedules, receipts, and school updates live in one reliable place.",
  primaryLabel: "Start free trial",
  primaryHref: "/sign-up",
  secondaryLabel: "See pricing",
  secondaryHref: "/pricing",
};
