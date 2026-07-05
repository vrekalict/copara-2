import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { VaultView } from "@/components/vault/vault-view";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const { data: children } = await supabase
    .from("children")
    .select("id, first_name, notes_medical, notes_school, emergency_contacts")
    .eq("circle_id", circle.circleId)
    .order("first_name");

  const { data: vaultItems } = await supabase
    .from("vault_items")
    .select("id, child_id, title, file_url, visibility, created_at")
    .eq("circle_id", circle.circleId)
    .order("created_at", { ascending: false });

  return (
    <VaultView
      circleId={circle.circleId}
      children={children ?? []}
      vaultItems={(vaultItems ?? []) as Parameters<typeof VaultView>[0]["vaultItems"]}
    />
  );
}
