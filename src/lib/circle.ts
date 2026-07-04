import { createClient } from "@/lib/supabase/server";

export async function getActiveCircleForUser(userId: string) {
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("circle_members")
    .select("circle_id, circles(name)")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  const circles = membership.circles as { name: string } | { name: string }[] | null;
  const circle = Array.isArray(circles) ? circles[0] : circles;
  return {
    circleId: membership.circle_id as string,
    circleName: circle?.name ?? "Accord",
  };
}
