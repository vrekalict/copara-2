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
