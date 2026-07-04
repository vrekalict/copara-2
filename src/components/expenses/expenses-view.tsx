"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  createExpense,
  requestReimbursement,
  respondToReimbursement,
} from "@/actions/expenses";
import { formatCents } from "@/lib/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ExpenseRow = {
  id: string;
  amount_cents: number;
  currency: string;
  category: string;
  description: string | null;
  created_by: string;
  created_at: string;
  reimbursement_requests: { id: string; status: string }[];
};

type ActionState = { error?: string; success?: boolean } | null;

export function ExpensesView({
  circleId,
  expenses,
  balanceCents,
  currentUserId,
}: {
  circleId: string;
  expenses: ExpenseRow[];
  balanceCents: number;
  currentUserId: string;
}) {
  const t = useTranslations("expenses");

  const [expenseState, expenseAction, expensePending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await createExpense(formData)) ?? null,
    null,
  );

  const [, reimbursementAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await requestReimbursement(formData);
      return null;
    },
    null,
  );

  const [, respondReimbursementAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await respondToReimbursement(formData);
      return null;
    },
    null,
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-lg font-semibold">{t("title")}</h1>

      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">{t("balanceLabel")}</p>
        <p className="text-2xl font-semibold">
          {balanceCents >= 0 ? t("owedToYou", { amount: formatCents(balanceCents) }) : t("youOwe", { amount: formatCents(Math.abs(balanceCents)) })}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("recent")}</h2>
        {expenses.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}
        <ul className="flex flex-col divide-y divide-border">
          {expenses.map((expense) => {
            const reimbursement = expense.reimbursement_requests[0];
            const mine = expense.created_by === currentUserId;
            return (
              <li key={expense.id} className="flex flex-col gap-2 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{formatCents(expense.amount_cents, expense.currency)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(`category.${expense.category}`)} · {expense.description ?? t("noDescription")}
                    </p>
                    {reimbursement && (
                      <p className="text-xs capitalize text-muted-foreground">
                        {t("reimbursement")}: {reimbursement.status}
                      </p>
                    )}
                  </div>
                  {mine && !reimbursement && (
                    <form action={reimbursementAction}>
                      <input type="hidden" name="expenseId" value={expense.id} />
                      <Button type="submit" size="sm" variant="outline">
                        {t("requestReimbursement")}
                      </Button>
                    </form>
                  )}
                  {!mine && reimbursement?.status === "pending" && (
                    <div className="flex gap-2">
                      <form action={respondReimbursementAction}>
                        <input type="hidden" name="requestId" value={reimbursement.id} />
                        <input type="hidden" name="decision" value="approved" />
                        <Button type="submit" size="sm">{t("approve")}</Button>
                      </form>
                      <form action={respondReimbursementAction}>
                        <input type="hidden" name="requestId" value={reimbursement.id} />
                        <input type="hidden" name="decision" value="declined" />
                        <Button type="submit" size="sm" variant="outline">{t("decline")}</Button>
                      </form>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-lg border border-border p-4">
        <h2 className="mb-3 font-medium">{t("addExpense")}</h2>
        <form action={expenseAction} className="flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input id="amount" name="amount" type="number" min="0.01" step="0.01" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">{t("categoryLabel")}</Label>
            <select id="category" name="category" className="h-8 rounded-lg border border-border bg-background px-2 text-sm">
              <option value="medical">{t("category.medical")}</option>
              <option value="school">{t("category.school")}</option>
              <option value="activities">{t("category.activities")}</option>
              <option value="clothing">{t("category.clothing")}</option>
              <option value="other">{t("category.other")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">{t("description")}</Label>
            <Input id="description" name="description" />
          </div>
          {expenseState?.error && <p className="text-sm text-destructive">{expenseState.error}</p>}
          <Button type="submit" disabled={expensePending}>{t("addExpense")}</Button>
        </form>
      </section>
    </div>
  );
}
