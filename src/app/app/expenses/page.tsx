import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { computeBalance } from "@/lib/expenses";
import { ExpensesView } from "@/components/expenses/expenses-view";

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const { data: members } = await supabase
    .from("circle_members")
    .select("user_id")
    .eq("circle_id", circle.circleId)
    .eq("status", "active")
    .eq("role", "parent")
    .not("user_id", "is", null);

  const partnerId =
    members?.find((m) => m.user_id !== user.id)?.user_id ?? null;

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, amount_cents, currency, category, description, created_by, created_at, split_pct, reimbursement_requests(id, status)")
    .eq("circle_id", circle.circleId)
    .order("created_at", { ascending: false })
    .limit(30);

  const balanceCents = computeBalance(expenses ?? [], user.id, partnerId);

  return (
    <ExpensesView
      circleId={circle.circleId}
      expenses={(expenses ?? []) as unknown as Parameters<typeof ExpensesView>[0]["expenses"]}
      balanceCents={balanceCents}
      currentUserId={user.id}
    />
  );
}
