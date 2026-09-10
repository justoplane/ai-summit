import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { MatchResult, VisitStatus } from "@/lib/types";

export type CodeRow = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  archived_at: string | null;
};

export type VisitRow = {
  id: string;
  code_id: string;
  status: VisitStatus;
  created_at: string;
  updated_at: string;
};

export type ResultRow = {
  id: string;
  /** Legacy QR id from before intake codes. Null for new rows. */
  token: string | null;
  submitter_name: string;
  member_id: string;
  score: number;
  model: string;
  payload: MatchResult;
  created_at: string;
  code_id: string | null;
  visit_id: string | null;
};

export type SettingRow = { key: string; value: string; updated_at: string };

/** Hand-maintained mirror of supabase/migrations/*.sql. Change both together. */
export type Database = {
  public: {
    Tables: {
      codes: {
        Row: CodeRow;
        Insert: Pick<CodeRow, "slug" | "name"> & Partial<CodeRow>;
        Update: Partial<CodeRow>;
        Relationships: [];
      };
      visits: {
        Row: VisitRow;
        Insert: Pick<VisitRow, "code_id"> & Partial<VisitRow>;
        Update: Partial<VisitRow>;
        Relationships: [];
      };
      results: {
        Row: ResultRow;
        Insert: Omit<ResultRow, "created_at" | "token"> & Partial<Pick<ResultRow, "created_at" | "token">>;
        Update: Partial<ResultRow>;
        Relationships: [];
      };
      settings: {
        Row: SettingRow;
        Insert: Pick<SettingRow, "key" | "value"> & Partial<SettingRow>;
        Update: Partial<SettingRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      count_by_member: { Args: { p_code_id?: string | null }; Returns: { member_id: string; n: number }[] };
      code_stats: { Args: Record<PropertyKey, never>; Returns: { code_id: string; scans: number; submissions: number }[] };
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
