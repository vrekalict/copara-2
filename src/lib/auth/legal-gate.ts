import type { SupabaseClient } from "@supabase/supabase-js";

export async function userHasLegalAcceptance(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("legal_acceptances")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  return Boolean(data);
}

export function pathRequiresLegalAcceptance(pathname: string): boolean {
  return (
    pathname.startsWith("/app") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/subscribe") ||
    pathname.startsWith("/account")
  );
}
