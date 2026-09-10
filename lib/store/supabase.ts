import { getSupabase } from "@/lib/supabase";
import type { Store } from "@/lib/types";
import { codeMethods } from "./supabase-codes";
import { resultMethods } from "./supabase-results";

/**
 * Production store on Supabase (Postgres + Storage). Schema: supabase/migrations/.
 * Codes and visits live in supabase-codes.ts; the results ledger and settings in
 * supabase-results.ts; photo upload/delete in supabase-photos.ts.
 */
export function createSupabaseStore(): Store {
  const sb = getSupabase();
  return { ...codeMethods(sb), ...resultMethods(sb) };
}
