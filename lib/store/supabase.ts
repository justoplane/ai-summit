import { isMemberId, MEMBER_IDS } from "@/content/members";
import { getSupabase } from "@/lib/supabase";
import { newToken } from "@/lib/tokens";
import type { MemberTally, Store } from "@/lib/types";
import { deletePhoto, uploadPhoto } from "./supabase-photos";

/** Flags are sentinel rows in `tokens` ("flag:<name>", status done) so no migration is needed. */
const flagToken = (name: string) => `flag:${name}`;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(op: string, error: { message: string }): never {
  throw new Error(`[store:supabase] ${op} failed: ${error.message}`);
}

/**
 * Production store on Supabase (Postgres + Storage). Schema: supabase/migrations/0001_init.sql.
 * Token state changes that affect "which QR is live" go through SQL functions so concurrent
 * phones and host polls can't mint twice or double-claim.
 */
export function createSupabaseStore(): Store {
  const sb = getSupabase();

  return {
    async getHostState() {
      const [active, pending, latest, flag] = await Promise.all([
        sb.rpc("ensure_active_token", { p_candidate: newToken() }),
        sb.from("tokens").select("*", { count: "exact", head: true }).eq("status", "processing"),
        sb.from("results").select("id").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        sb.from("tokens").select("token").eq("token", flagToken("shlayteMaxxing")).maybeSingle(),
      ]);
      if (active.error) fail("ensure_active_token", active.error);
      if (pending.error) fail("count pending tokens", pending.error);
      if (latest.error) fail("latest result id", latest.error);
      if (flag.error) fail("read flag", flag.error);
      return {
        activeToken: active.data,
        pending: pending.count ?? 0,
        latestResultId: latest.data?.id ?? null,
        shlayteMaxxing: flag.data !== null,
      };
    },

    async claimToken(token) {
      const { data, error } = await sb.rpc("claim_token", { p_token: token, p_next: newToken() });
      if (error) fail("claim_token", error);
      return data;
    },

    async getTokenStatus(token) {
      const { data, error } = await sb.from("tokens").select("status").eq("token", token).maybeSingle();
      if (error) fail("getTokenStatus", error);
      return data?.status ?? null;
    },

    async setTokenStatus(token, status) {
      const { error } = await sb
        .from("tokens")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("token", token);
      if (error) fail("setTokenStatus", error);
    },

    savePhoto(resultId, dataUrl) {
      return uploadPhoto(sb, resultId, dataUrl);
    },

    async saveResult(result) {
      const { error } = await sb.from("results").insert({
        id: result.id,
        token: result.token,
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

    async getLatestResult() {
      const { data, error } = await sb
        .from("results")
        .select("payload")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
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

    async listResults({ limit, before }) {
      let query = sb.from("results").select("payload");
      if (before) query = query.lt("created_at", before);
      // One extra row tells us whether another page exists.
      const { data, error } = await query.order("created_at", { ascending: false }).limit(limit + 1);
      if (error) fail("listResults", error);
      const results = data.slice(0, limit).map((row) => row.payload);
      const last = results.at(-1);
      return { results, nextCursor: data.length > limit && last ? last.createdAt : null };
    },

    async getFlag(name) {
      const { data, error } = await sb.from("tokens").select("token").eq("token", flagToken(name)).maybeSingle();
      if (error) fail("getFlag", error);
      return data !== null;
    },

    async setFlag(name, on) {
      const token = flagToken(name);
      const { error } = on
        ? await sb.from("tokens").upsert({ token, status: "done" })
        : await sb.from("tokens").delete().eq("token", token);
      if (error) fail("setFlag", error);
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

    async countByMember() {
      const { data, error } = await sb.rpc("count_by_member");
      if (error) fail("count_by_member", error);
      const tally = Object.fromEntries(MEMBER_IDS.map((id) => [id, 0])) as MemberTally;
      for (const row of data) if (isMemberId(row.member_id)) tally[row.member_id] += row.n;
      return tally;
    },
  };
}
