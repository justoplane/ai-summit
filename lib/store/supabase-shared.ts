import type { CodeRow, VisitRow } from "@/lib/supabase";
import type { IntakeCode, Visit } from "@/lib/types";

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function fail(op: string, error: { message: string }): never {
  throw new Error(`[store:supabase] ${op} failed: ${error.message}`);
}

export const toCode = (row: CodeRow): IntakeCode => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  createdAt: row.created_at,
  archivedAt: row.archived_at,
});

export const toVisit = (row: VisitRow): Visit => ({
  id: row.id,
  codeId: row.code_id,
  status: row.status,
  createdAt: row.created_at,
});
