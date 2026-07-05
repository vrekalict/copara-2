export function computeBalance(
  expenses: { amount_cents: number; split_pct: number | null; created_by: string }[],
  userId: string,
  partnerId: string | null,
) {
  if (!partnerId) return 0;

  let balance = 0;
  for (const expense of expenses) {
    const split = (expense.split_pct ?? 50) / 100;
    const share = Math.round(expense.amount_cents * split);
    const otherShare = expense.amount_cents - share;

    if (expense.created_by === userId) {
      balance += otherShare;
    } else if (expense.created_by === partnerId) {
      balance -= share;
    }
  }
  return balance;
}

export function formatCents(cents: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export type ExpenseCategory =
  | "medical"
  | "school"
  | "activities"
  | "clothing"
  | "other";

export function computeCategoryTotals(
  expenses: { amount_cents: number; category: string }[],
): { category: ExpenseCategory; totalCents: number; pct: number }[] {
  const totals = new Map<ExpenseCategory, number>();
  let grand = 0;

  for (const expense of expenses) {
    const cat = (expense.category as ExpenseCategory) || "other";
    totals.set(cat, (totals.get(cat) ?? 0) + expense.amount_cents);
    grand += expense.amount_cents;
  }

  if (grand === 0) return [];

  return Array.from(totals.entries())
    .map(([category, totalCents]) => ({
      category,
      totalCents,
      pct: Math.round((totalCents / grand) * 100),
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

export const SPLIT_OPTIONS = [50, 60, 70, 80, 100] as const;
