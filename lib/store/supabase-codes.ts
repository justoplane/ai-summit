import { isMemberId, MEMBER_IDS } from "@/content/members";
import type { Supabase } from "@/lib/supabase";
import { newToken } from "@/lib/tokens";
import type { MemberTally, Store } from "@/lib/types";
import { fail, toCode, toVisit, UUID_RE } from "./supabase-shared";

type CodeMethods = Pick<
  Store,
  | "listCodes"
  | "getCode"
  | "getCodeBySlug"
  | "createCode"
  | "renameCode"
  | "archiveCode"
  | "codeStats"
  | "createVisit"
  | "getVisit"
  | "setVisitStatus"
  | "countPending"
>;

/** Intake codes, visits, and per-code analytics. */
export function codeMethods(sb: Supabase): CodeMethods {
  return {
    async listCodes(opts) {
      let query = sb.from("codes").select("*");
      if (!opts?.includeArchived) query = query.is("archived_at", null);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) fail("listCodes", error);
      return data.map(toCode);
    },

    async getCode(id) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("codes").select("*").eq("id", id).maybeSingle();
      if (error) fail("getCode", error);
      return data ? toCode(data) : null;
    },

    async getCodeBySlug(slug) {
      const { data, error } = await sb.from("codes").select("*").eq("slug", slug).maybeSingle();
      if (error) fail("getCodeBySlug", error);
      return data ? toCode(data) : null;
    },

    async createCode(name) {
      const { data, error } = await sb.from("codes").insert({ slug: newToken(), name }).select("*").single();
      if (error) fail("createCode", error);
      return toCode(data);
    },

    async renameCode(id, name) {
      const { error } = await sb.from("codes").update({ name }).eq("id", id);
      if (error) fail("renameCode", error);
    },

    async archiveCode(id) {
      const { error } = await sb
        .from("codes")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", id)
        .is("archived_at", null);
      if (error) fail("archiveCode", error);
    },

    async codeStats() {
      const [codes, stats, rows] = await Promise.all([
        sb.from("codes").select("*").order("created_at", { ascending: false }),
        sb.rpc("code_stats"),
        // Per-code member tallies: rows are few, so counting in JS beats a second RPC.
        sb.from("results").select("code_id, member_id").not("code_id", "is", null),
      ]);
      if (codes.error) fail("codeStats codes", codes.error);
      if (stats.error) fail("code_stats", stats.error);
      if (rows.error) fail("codeStats results", rows.error);

      const counts = new Map(stats.data.map((s) => [s.code_id, s]));
      const tallies = new Map<string, MemberTally>();
      for (const { code_id, member_id } of rows.data) {
        if (!code_id || !isMemberId(member_id)) continue;
        const tally = tallies.get(code_id) ?? emptyTally();
        tally[member_id] += 1;
        tallies.set(code_id, tally);
      }

      return codes.data.flatMap((row) => {
        const code = toCode(row);
        const counted = counts.get(code.id);
        const submissions = Number(counted?.submissions ?? 0);
        if (code.archivedAt && submissions === 0) return [];
        const scans = Number(counted?.scans ?? 0);
        return [{ code, scans, submissions, byMember: tallies.get(code.id) ?? emptyTally() }];
      });
    },

    async createVisit(codeId) {
      const { data, error } = await sb.from("visits").insert({ code_id: codeId }).select("*").single();
      if (error) fail("createVisit", error);
      return toVisit(data);
    },

    async getVisit(id) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("visits").select("*").eq("id", id).maybeSingle();
      if (error) fail("getVisit", error);
      return data ? toVisit(data) : null;
    },

    async setVisitStatus(id, status) {
      const { error } = await sb
        .from("visits")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) fail("setVisitStatus", error);
    },

    async countPending(filter) {
      let query = sb.from("visits").select("*", { count: "exact", head: true }).eq("status", "processing");
      if (filter?.codeId) query = query.eq("code_id", filter.codeId);
      const { count, error } = await query;
      if (error) fail("countPending", error);
      return count ?? 0;
    },
  };
}

export const emptyTally = (): MemberTally => Object.fromEntries(MEMBER_IDS.map((id) => [id, 0])) as MemberTally;
