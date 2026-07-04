"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createExpense(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "other");
  const description = String(formData.get("description") ?? "").trim();

  if (!circleId || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid amount." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const amountCents = Math.round(amount * 100);

  const { error } = await supabase.from("expenses").insert({
    circle_id: circleId,
    created_by: user.id,
    amount_cents: amountCents,
    category,
    description: description || null,
    split_pct: 50,
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
    .select("status_history")
    .eq("id", requestId)
    .single();

  const history = Array.isArray(existing?.status_history)
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
