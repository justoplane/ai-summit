import { isMemberId } from "@/content/members";
import type { Supabase } from "@/lib/supabase";
import type { Store } from "@/lib/types";
import { emptyTally } from "./supabase-codes";
import { deletePhoto, uploadPhoto } from "./supabase-photos";
import { fail, UUID_RE } from "./supabase-shared";

type ResultMethods = Pick<
  Store,
  | "savePhoto"
  | "saveResult"
  | "getLatestResult"
  | "getResult"
  | "listResults"
  | "countByMember"
  | "deleteResult"
  | "getSetting"
  | "setSetting"
>;

/** The results ledger and operator settings. */
export function resultMethods(sb: Supabase): ResultMethods {
  return {
    savePhoto(resultId, dataUrl) {
      return uploadPhoto(sb, resultId, dataUrl);
    },

    async saveResult(result) {
      const { error } = await sb.from("results").insert({
        id: result.id,
        code_id: result.codeId,
        visit_id: result.visitId,
        submitter_name: result.submitter.name,
        member_id: result.verdict.memberId,
        score: result.verdict.score,
        model: result.model,
        payload: result,
        // Same instant as payload.createdAt, which listResults hands out as the cursor.
        created_at: result.createdAt,
      });
      if (error) fail("saveResult", error);
    },

    async getLatestResult(filter) {
      let query = sb.from("results").select("payload");
      if (filter?.codeId) query = query.eq("code_id", filter.codeId);
      const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) fail("getLatestResult", error);
      return data?.payload ?? null;
    },

    async getResult(id) {
      // Postgres rejects malformed uuids with an error; the contract wants null for unknown ids.
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("results").select("payload").eq("id", id).maybeSingle();
      if (error) fail("getResult", error);
      return data?.payload ?? null;
    },

    async listResults({ limit, before, codeId }) {
      let query = sb.from("results").select("payload");
      if (codeId) query = query.eq("code_id", codeId);
      if (before) query = query.lt("created_at", before);
      // One extra row tells us whether another page exists.
      const { data, error } = await query.order("created_at", { ascending: false }).limit(limit + 1);
      if (error) fail("listResults", error);
      const results = data.slice(0, limit).map((row) => row.payload);
      const last = results.at(-1);
      return { results, nextCursor: data.length > limit && last ? last.createdAt : null };
    },

    async countByMember(filter) {
      const { data, error } = await sb.rpc("count_by_member", { p_code_id: filter?.codeId ?? null });
      if (error) fail("count_by_member", error);
      const tally = emptyTally();
      for (const row of data) if (isMemberId(row.member_id)) tally[row.member_id] += Number(row.n);
      return tally;
    },

    async deleteResult(id) {
      if (!UUID_RE.test(id)) return;
      const { data, error } = await sb.from("results").select("payload").eq("id", id).maybeSingle();
      if (error) fail("deleteResult lookup", error);
      if (!data) return;
      // Photo cleanup is best-effort; the row is what the ledger shows.
      await deletePhoto(sb, data.payload.submitter.photoUrl).catch((err) => console.warn("[store:supabase]", err));
      const del = await sb.from("results").delete().eq("id", id);
      if (del.error) fail("deleteResult", del.error);
    },

    async getSetting(key) {
      const { data, error } = await sb.from("settings").select("value").eq("key", key).maybeSingle();
      if (error) fail("getSetting", error);
      return data?.value ?? null;
    },

    async setSetting(key, value) {
      const { error } =
        value === null
          ? await sb.from("settings").delete().eq("key", key)
          : await sb.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) fail("setSetting", error);
    },
  };
}
