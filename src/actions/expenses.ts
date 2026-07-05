"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidExpenseReceiptPath } from "@/lib/expense-receipts";

const CATEGORIES = new Set([
  "medical",
  "school",
  "activities",
  "clothing",
  "other",
]);

export async function createExpense(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "other");
  const description = String(formData.get("description") ?? "").trim();
  const splitPct = Number(formData.get("splitPct") ?? 50);
  const childId = String(formData.get("childId") ?? "").trim() || null;
  const receiptPath = String(formData.get("receiptPath") ?? "").trim() || null;
  const incurredOn = String(formData.get("incurredOn") ?? "").trim() || null;

  if (!circleId || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid amount." };
  }

  if (!CATEGORIES.has(category)) {
    return { error: "Invalid category." };
  }

  if (!Number.isFinite(splitPct) || splitPct <= 0 || splitPct > 100) {
    return { error: "Split must be between 1 and 100." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  if (receiptPath && !isValidExpenseReceiptPath(receiptPath, circleId)) {
    return { error: "Invalid receipt path." };
  }

  if (receiptPath) {
    const { data, error: receiptError } = await supabase.storage
      .from("expense-receipts")
      .createSignedUrl(receiptPath, 60);
    if (receiptError || !data?.signedUrl) {
      return { error: "Receipt file not found. Upload again." };
    }
  }

  if (childId) {
    const { data: child } = await supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("circle_id", circleId)
      .maybeSingle();
    if (!child) return { error: "Invalid child." };
  }

  const amountCents = Math.round(amount * 100);

  const { error } = await supabase.from("expenses").insert({
    circle_id: circleId,
    created_by: user.id,
    amount_cents: amountCents,
    category,
    description: description || null,
    split_pct: splitPct,
    child_id: childId,
    receipt_url: receiptPath,
    incurred_on: incurredOn ?? undefined,
  });

  if (error) return { error: error.message };

  revalidatePath("/app/expenses");
  return { success: true };
}

export async function requestReimbursement(formData: FormData) {
  const expenseId = String(formData.get("expenseId") ?? "");
  if (!expenseId) return { error: "Missing expense." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: expense } = await supabase
    .from("expenses")
    .select("created_by")
    .eq("id", expenseId)
    .single();

  if (!expense || expense.created_by !== user.id) {
    return { error: "Only the person who logged the expense can request reimbursement." };
  }

  const { error } = await supabase.from("reimbursement_requests").insert({
    expense_id: expenseId,
    requested_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/app/expenses");
  return { success: true };
}

export async function respondToReimbursement(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!requestId || !["approved", "declined", "disputed"].includes(decision)) {
    return { error: "Invalid request." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: existing } = await supabase
    .from("reimbursement_requests")
    .select("status_history, expense_id, expenses(created_by)")
    .eq("id", requestId)
    .single();

  if (!existing) return { error: "Request not found." };

  const expense = Array.isArray(existing.expenses)
    ? existing.expenses[0]
    : existing.expenses;

  if (expense?.created_by === user.id) {
    return { error: "You cannot respond to your own reimbursement request." };
  }

  const history = Array.isArray(existing.status_history)
    ? existing.status_history
    : [];

  const { error } = await supabase
    .from("reimbursement_requests")
    .update({
      status: decision,
      status_history: [
        ...history,
        { status: decision, by: user.id, at: new Date().toISOString() },
      ],
    })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/app/expenses");
  return { success: true };
}
