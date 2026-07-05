/** Professional partner referral program configuration. */

export const PRO_REFERRAL_BONUS = {
  /** Share of the client's first paid invoice (monthly or yearly). */
  firstInvoicePercent: 25,
  currency: "CAD",
  programName: "Copara Partner Referral Program",
  description:
    "Earn a referral bonus when referred families subscribe through your partner link. One bonus per household — terms in your partner dashboard.",
} as const;

export function formatReferralBonusDescription() {
  return `${PRO_REFERRAL_BONUS.firstInvoicePercent}% of the first paid invoice, one bonus per household.`;
}

export const PRO_PARTNER_BENEFITS = [
  {
    title: "Read-only case access",
    description:
      "View messages, calendar, and expenses in circles where parents grant access. Monitor communication without altering records or messaging as a parent.",
    icon: "eye",
  },
  {
    title: "Easy client follow-up",
    description:
      "Manage cases from one dashboard. Create dual-parent invite links, track membership status, and stay current through web or mobile.",
    icon: "users",
  },
  {
    title: "Professional materials",
    description:
      "Download handouts, email templates, and brand assets from your partner dashboard.",
    icon: "file",
  },
  {
    title: "Referral rewards",
    description:
      "Refer client families with your partner link and earn a bonus when they subscribe. Track referrals and payout status in your dashboard.",
    icon: "gift",
  },
] as const;

export const PRO_WHY_COPARA = [
  {
    title: "Calendar",
    description:
      "A shared schedule for custody, exchanges, and change requests — so both parents and professionals see the same timeline.",
    href: "/features/calendar",
  },
  {
    title: "Finance",
    description:
      "Track shared expenses, receipts, and reimbursement requests with a clear running balance both parents can review.",
    href: "/features/expenses",
  },
  {
    title: "Messages",
    description:
      "Append-only messaging with optional tone review. A calmer channel that creates an organized record over time.",
    href: "/features/steady-send",
  },
  {
    title: "Journal",
    description:
      "Share family updates, photos, and milestones in a circle journal — a quick window into day-to-day parenting.",
    href: "/features/journal",
  },
] as const;
