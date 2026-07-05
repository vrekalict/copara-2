export type GuideRule = {
  number: number;
  title: string;
  pullQuote?: string;
  paragraphs: string[];
};

export const GUIDE_INTRO = {
  eyebrow: "Resources",
  title: "Ten rules for healthy co-parenting",
  subtitle: "Co-parenting, how it works",
  description:
    "A practical mini-guide for separated parents in Canada who want calmer communication, clearer records, and a stable environment for their children.",
};

export const GUIDE_RULES: GuideRule[] = [
  {
    number: 1,
    title: "Don't force your children to choose sides",
    pullQuote:
      "Allow and encourage your children to maintain relationships with grandparents, aunts, uncles, and cousins on both sides.",
    paragraphs: [
      "Asking children to cut ties with your former in-laws often creates the first lasting fracture after separation.",
      "Encourage relationships with extended family on both the mother's and the father's side. Those connections can support a child's self-esteem and sense of belonging.",
      "When a child returns from time with the other parent or their family, avoid comparisons and competition. Children need the parent who helps with homework and the parent who makes great spaghetti — both matter.",
    ],
  },
  {
    number: 2,
    title: "Use a positive tone when you talk to your children about your co-parent",
    paragraphs: [
      "Separation is painful. You may feel wounded, disappointed, or angry. Still, your children need to respect both parents. That respect supports their ability to respect authority in general and to grow up feeling respected themselves.",
      "Even if your co-parent speaks negatively about you, resist tit-for-tat. Constant hostility erodes your child's respect for you more than silence does.",
      "You are the adult. Model the calm, respectful communication you want your children to carry into adulthood.",
    ],
  },
  {
    number: 3,
    title: "Spare them the adult details",
    paragraphs: [
      "Telling children how hard your life has become creates confusion and puts weight on shoulders that should not carry it. Sharing too much can subtly ask them to take care of you emotionally.",
      "Rather than lengthy explanations about finances or conflict, keep it simple: \"We need to be smart about how we spend our money now.\"",
      "As an adult, you are responsible for finding solutions — whether that means budgeting, seeking support, or adjusting your plans. Your children should not be your messengers or your counsellors.",
    ],
  },
  {
    number: 4,
    title: "Don't use your children as messengers",
    pullQuote:
      "Copara gives you a shared channel for schedules, expenses, and messages — without putting children in the middle.",
    paragraphs: [
      "Phone calls, email, and secure co-parenting tools are all better options than asking a child to relay a message, a schedule change, or a complaint.",
      "Copara is designed for exactly this: organized communication about parenting schedules, expenses, documents, and messages — in a record that stays between adults.",
      "Rules may differ in each home. That is normal. If you are comfortable with your choices — \"That is how things work at the other home; here we do it differently\" — your children are more likely to accept both environments.",
    ],
  },
  {
    number: 5,
    title: "Detach yourself from conflict with your co-parent",
    paragraphs: [
      "You are separated. Some people stay locked in a relationship of hostility long after the marriage ends. Ask yourself honestly: do you want to remain entangled with someone who does not treat you with respect?",
      "The sooner you accept the separation as a fact, the sooner you can stop re-living the fight. Suffering endlessly rarely brings the other person back — and even if it did, that is not the foundation of a healthy family.",
      "Copara helps by keeping practical coordination separate from emotional debate. Use the tool for facts, schedules, and records — not for reopening old wounds.",
    ],
  },
  {
    number: 6,
    title: "Set clear limits and expectations for your children",
    paragraphs: [
      "Set healthy behavioural limits in your home. If you are unsure during separation, ask a trusted professional — a therapist, social worker, or parenting coordinator — for guidance.",
      "Some children are skilled at playing one parent against the other. Do not fall into that trap. Share clear expectations about waking up, school, homework, chores, screen time, bedtime, and respect.",
      "Expectations should be reasonable and consistent. Children feel safer when they know what comes next.",
    ],
  },
  {
    number: 7,
    title: "Stay open to communication with your children",
    paragraphs: [
      "Listen without judging. Do not tell children how they should feel.",
      "Accept their feelings in the moment while reassuring them that feelings change with time. Help them understand you will be there for them.",
      "Avoid questions designed to make them report on your co-parent. If they need to talk about difficult feelings, a neutral adult — a therapist, school counsellor, or family friend — may be a better listener.",
    ],
  },
  {
    number: 8,
    title: "Be the responsible adult",
    paragraphs: [
      "Choose who you want to become after this separation. Set short-, medium-, and long-term goals for yourself and your family.",
      "You can start again. Leave blame and complaint in the past when you can. The present is where your children need you.",
      "Organized records, shared calendars, and calm messaging are not just app features — they are habits that show your children that adults can handle hard seasons without falling apart.",
    ],
  },
  {
    number: 9,
    title: "Help your children feel secure",
    paragraphs: [
      "However often they see you, make your home a place of respect, predictability, and care.",
      "Security is not about perfect agreement between parents. It is about your child knowing they are loved, their needs matter, and the adults in charge are reliable.",
      "Even when the other home feels less stable, the safety you create still matters enormously.",
    ],
  },
  {
    number: 10,
    title: "Learn to rebound together",
    pullQuote:
      "Show your children that tough times can be handled without falling apart.",
    paragraphs: [
      "Resilience is one of the most valuable gifts a parent can offer. Model getting back up after setbacks — a missed handoff, a tense message, a changed plan.",
      "Teach children that difficult periods pass. Help them notice what is still good, what still works, and who still shows up for them.",
      "Copara cannot fix your co-parenting relationship. It can help you communicate more clearly, keep better records, and reduce the daily friction that wears everyone down.",
    ],
  },
];

export const GUIDE_CLOSING = {
  title: "Constructive communication starts with the right tools",
  paragraphs: [
    "Children should feel that both parents are attentive to school, activities, health, and daily life — even when parents no longer live together.",
    "Copara offers shared calendars, messaging with optional tone review, expense tracking, document storage, and tamper-evident exports designed for Canadian families. English and French.",
  ],
  primaryLabel: "Join early access",
  primaryHref: "/early-access",
  secondaryLabel: "See how Copara works",
  secondaryHref: "/features",
};
