import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Bypasses RLS. Only import from server-only code (API routes, cron jobs)
 * that has already validated the caller's membership/permissions itself.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
