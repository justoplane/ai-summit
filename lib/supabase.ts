import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { MatchResult, TokenStatus } from "@/lib/types";

type TokenRow = { token: string; status: TokenStatus; created_at: string; updated_at: string };

type ResultRow = {
  id: string;
  token: string;
  submitter_name: string;
  member_id: string;
  score: number;
  model: string;
  payload: MatchResult;
  created_at: string;
};

/** Hand-maintained mirror of supabase/migrations/0001_init.sql. Change both together. */
export type Database = {
  public: {
    Tables: {
      tokens: {
        Row: TokenRow;
        Insert: Pick<TokenRow, "token" | "status"> & Partial<TokenRow>;
        Update: Partial<TokenRow>;
        Relationships: [];
      };
      results: {
        Row: ResultRow;
        Insert: Omit<ResultRow, "created_at"> & Partial<Pick<ResultRow, "created_at">>;
        Update: Partial<ResultRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      ensure_active_token: { Args: { p_candidate: string }; Returns: string };
      // The CHECK constraint on tokens.status guarantees the narrower type.
      claim_token: { Args: { p_token: string; p_next: string }; Returns: TokenStatus | null };
      count_by_member: { Args: Record<PropertyKey, never>; Returns: { member_id: string; n: number }[] };
    };
  };
};

export type Supabase = SupabaseClient<Database>;

declare global {
  // Survives hot reloads in `next dev` so each reload doesn't open a fresh client.
  var __durfSupabase: Supabase | undefined;
}

/**
 * Server-only. Uses the service role key, which bypasses RLS: never import this from a client
 * component. Throws if the env vars are missing; callers should check `hasSupabase` first.
 */
export function getSupabase(): Supabase {
  if (!globalThis.__durfSupabase) {
    const { supabaseUrl, supabaseServiceRoleKey } = env;
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("[supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set");
    }
    globalThis.__durfSupabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return globalThis.__durfSupabase;
}
