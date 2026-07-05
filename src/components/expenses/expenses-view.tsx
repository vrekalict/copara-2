"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileText, Receipt, X } from "lucide-react";
import {
  createExpense,
  requestReimbursement,
  respondToReimbursement,
} from "@/actions/expenses";
import {
  computeCategoryTotals,
  formatCents,
  SPLIT_OPTIONS,
} from "@/lib/expenses";
import {
  EXPENSE_RECEIPT_BUCKET,
  expenseReceiptStoragePath,
  isAllowedReceipt,
} from "@/lib/expense-receipts";
import { createClient } from "@/lib/supabase/client";
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
  split_pct: number | null;
  child_id: string | null;
  receipt_url: string | null;
  incurred_on: string | null;
  reimbursement_requests: { id: string; status: string }[];
};

type Child = { id: string; first_name: string };

type ActionState = { error?: string; success?: boolean } | null;

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function ExpenseReceiptLink({ path }: { path: string }) {
  const t = useTranslations("expenses");
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.storage
      .from(EXPENSE_RECEIPT_BUCKET)
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  const isPdf = path.toLowerCase().endsWith(".pdf");

  if (!url) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Receipt className="size-3" />
        {t("receiptLoading")}
      </span>
    );
  }

  if (!isPdf) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={t("receipt")}
          className="mt-1 max-h-24 rounded-md border border-border object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-1 inline-flex items-center gap-1 text-xs text-primary underline"
    >
      <FileText className="size-3" />
      {t("viewReceipt")}
    </a>
  );
}

export function ExpensesView({
  circleId,
  expenses,
  balanceCents,
  currentUserId,
  children,
}: {
  circleId: string;
  expenses: ExpenseRow[];
  balanceCents: number;
  currentUserId: string;
  children: Child[];
}) {
  const t = useTranslations("expenses");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPath, setReceiptPath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const categoryTotals = computeCategoryTotals(expenses);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount_cents, 0);

  const [expenseState, expenseAction, expensePending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await createExpense(formData)) ?? null;
      if (result?.success) {
        setReceiptFile(null);
        setReceiptPath(null);
        setUploadError(null);
      }
      return result;
    },
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

  async function handleReceiptSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadError(null);

    const allowed = isAllowedReceipt(file);
    if (!allowed.ok) {
      setUploadError(
        allowed.reason === "too_large" ? t("receiptTooLarge") : t("receiptType"),
      );
      return;
    }

    setUploading(true);
    setReceiptFile(file);

    try {
      const path = expenseReceiptStoragePath(circleId, file);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(EXPENSE_RECEIPT_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadError(error.message);
        setReceiptFile(null);
        setReceiptPath(null);
        return;
      }

      setReceiptPath(path);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearReceipt() {
    setReceiptFile(null);
    setReceiptPath(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const childName = (id: string | null) =>
    children.find((c) => c.id === id)?.first_name ?? null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <Link
          href="/app/exports"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          {t("exportPdf")}
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">{t("balanceLabel")}</p>
        <p className="text-2xl font-semibold">
          {balanceCents >= 0
            ? t("owedToYou", { amount: formatCents(balanceCents) })
            : t("youOwe", { amount: formatCents(Math.abs(balanceCents)) })}
        </p>
        {totalSpent > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("totalLogged", { amount: formatCents(totalSpent) })}
          </p>
        )}
      </div>

      {categoryTotals.length > 0 && (
        <section className="rounded-xl border border-border p-4">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("byCategory")}
          </h2>
          <ul className="flex flex-col gap-2">
            {categoryTotals.map(({ category, totalCents, pct }) => (
              <li key={category} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{t(`category.${category}`)}</span>
                  <span className="font-medium">
                    {formatCents(totalCents)} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("recent")}</h2>
        {expenses.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}
        <ul className="flex flex-col gap-3">
          {expenses.map((expense) => {
            const reimbursement = expense.reimbursement_requests[0];
            const mine = expense.created_by === currentUserId;
            const child = childName(expense.child_id);
            const displayDate = expense.incurred_on ?? expense.created_at;

            return (
              <li
                key={expense.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="text-lg font-semibold">
                        {formatCents(expense.amount_cents, expense.currency)}
                      </p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                        {t(`category.${expense.category}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {expense.description ?? t("noDescription")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(displayDate)}
                      {child && ` · ${child}`}
                      {expense.split_pct != null &&
                        ` · ${t("splitLabel", { pct: expense.split_pct })}`}
                    </p>
                    {reimbursement && (
                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {t("reimbursement")}: {reimbursement.status}
                      </p>
                    )}
                    {expense.receipt_url && (
                      <ExpenseReceiptLink path={expense.receipt_url} />
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {mine && !reimbursement && (
                      <form action={reimbursementAction}>
                        <input type="hidden" name="expenseId" value={expense.id} />
                        <Button type="submit" size="sm" variant="outline">
                          {t("requestReimbursement")}
                        </Button>
                      </form>
                    )}
                    {!mine && reimbursement?.status === "pending" && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <form action={respondReimbursementAction}>
                          <input type="hidden" name="requestId" value={reimbursement.id} />
                          <input type="hidden" name="decision" value="approved" />
                          <Button type="submit" size="sm">{t("approve")}</Button>
                        </form>
                        <form action={respondReimbursementAction}>
                          <input type="hidden" name="requestId" value={reimbursement.id} />
                          <input type="hidden" name="decision" value="declined" />
                          <Button type="submit" size="sm" variant="outline">
                            {t("decline")}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-border p-4">
        <h2 className="mb-3 font-medium">{t("addExpense")}</h2>
        <form action={expenseAction} className="flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <input type="hidden" name="receiptPath" value={receiptPath ?? ""} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">{t("amount")}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="incurredOn">{t("date")}</Label>
              <Input
                id="incurredOn"
                name="incurredOn"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">{t("categoryLabel")}</Label>
              <select
                id="category"
                name="category"
                className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option value="medical">{t("category.medical")}</option>
                <option value="school">{t("category.school")}</option>
                <option value="activities">{t("category.activities")}</option>
                <option value="clothing">{t("category.clothing")}</option>
                <option value="other">{t("category.other")}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="splitPct">{t("splitPct")}</Label>
              <select
                id="splitPct"
                name="splitPct"
                defaultValue="50"
                className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
              >
                {SPLIT_OPTIONS.map((pct) => (
                  <option key={pct} value={pct}>
                    {t("splitOption", { pct })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {children.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="childId">{t("child")}</Label>
              <select
                id="childId"
                name="childId"
                className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option value="">{t("noChild")}</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.first_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">{t("description")}</Label>
            <Input id="description" name="description" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="receipt">{t("receipt")}</Label>
            <input
              ref={fileInputRef}
              id="receipt"
              type="file"
              accept="image/*,application/pdf"
              className="text-sm"
              onChange={(e) => void handleReceiptSelect(e.target.files)}
              disabled={uploading}
            />
            {receiptFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Receipt className="size-4 shrink-0" />
                <span className="truncate">{receiptFile.name}</span>
                <button
                  type="button"
                  onClick={clearReceipt}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                  aria-label={t("removeReceipt")}
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
          </div>

          {expenseState?.error && (
            <p className="text-sm text-destructive">{expenseState.error}</p>
          )}
          {expenseState?.success && (
            <p className="text-sm text-green-600">{t("saved")}</p>
          )}

          <Button
            type="submit"
            disabled={expensePending || uploading || (receiptFile !== null && !receiptPath)}
          >
            {expensePending ? t("saving") : t("addExpense")}
          </Button>
        </form>
      </section>
    </div>
  );
}
