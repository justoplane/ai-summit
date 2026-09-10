import type { MatchResult, MemberTally, Store, TokenStatus } from "@/lib/types";
import { MEMBER_IDS } from "@/content/members";
import { newToken } from "@/lib/tokens";

type MemoryState = {
  tokens: Map<string, { status: TokenStatus; createdAt: number }>;
  /** Oldest first. */
  results: MatchResult[];
};

declare global {
  // Survives hot reloads in `next dev`.
  var __durfMemoryState: MemoryState | undefined;
}

function state(): MemoryState {
  if (!globalThis.__durfMemoryState) {
    globalThis.__durfMemoryState = { tokens: new Map(), results: [] };
  }
  return globalThis.__durfMemoryState;
}

/**
 * In-memory store for local dev. Not safe on Vercel: each serverless
 * instance has its own memory, so tokens and results will not be shared.
 */
export function createMemoryStore(): Store {
  const s = state();

  const activeToken = (): string | null => {
    for (const [token, entry] of s.tokens) if (entry.status === "active") return token;
    return null;
  };

  const mint = (): string => {
    const token = newToken();
    s.tokens.set(token, { status: "active", createdAt: Date.now() });
    return token;
  };

  return {
    async getHostState() {
      const token = activeToken() ?? mint();
      let pending = 0;
      for (const entry of s.tokens.values()) if (entry.status === "processing") pending++;
      const latest = s.results[s.results.length - 1];
      return { activeToken: token, pending, latestResultId: latest?.id ?? null };
    },

    async claimToken(token) {
      const entry = s.tokens.get(token);
      if (!entry) return null;
      if (entry.status === "active") {
        entry.status = "claimed";
        mint();
      }
      return entry.status;
    },

    async getTokenStatus(token) {
      return s.tokens.get(token)?.status ?? null;
    },

    async setTokenStatus(token, status) {
      const entry = s.tokens.get(token);
      if (entry) entry.status = status;
    },

    async savePhoto(_resultId, dataUrl) {
      return dataUrl;
    },

    async saveResult(result) {
      s.results.push(result);
    },

    async getLatestResult() {
      return s.results[s.results.length - 1] ?? null;
    },

    async getResult(id) {
      return s.results.find((r) => r.id === id) ?? null;
    },

    async listResults({ limit, before }) {
      let items = [...s.results].reverse();
      if (before) items = items.filter((r) => r.createdAt < before);
      const page = items.slice(0, limit);
      const last = page[page.length - 1];
      const nextCursor = items.length > limit && last ? last.createdAt : null;
      return { results: page, nextCursor };
    },

    async deleteResult(id) {
      const i = s.results.findIndex((r) => r.id === id);
      if (i !== -1) s.results.splice(i, 1);
    },

    async countByMember() {
      const tally = Object.fromEntries(MEMBER_IDS.map((id) => [id, 0])) as MemberTally;
      for (const r of s.results) tally[r.verdict.memberId] += 1;
      return tally;
    },
  };
}
