import type {
  CodeStats,
  IntakeCode,
  MatchResult,
  MemberTally,
  ResultFilter,
  SettingKey,
  Store,
  Visit,
} from "@/lib/types";
import { MEMBER_IDS } from "@/content/members";
import { newId, newToken } from "@/lib/tokens";

type MemoryState = {
  codes: Map<string, IntakeCode>;
  visits: Map<string, Visit>;
  /** Oldest first. */
  results: MatchResult[];
  settings: Map<SettingKey, string>;
};

declare global {
  // Survives hot reloads in `next dev`.
  var __durfMemoryState: MemoryState | undefined;
}

function state(): MemoryState {
  if (!globalThis.__durfMemoryState) {
    const s: MemoryState = { codes: new Map(), visits: new Map(), results: [], settings: new Map() };
    // Mirror the migration's seed so the floor has something to show on first load.
    const seed: IntakeCode = { id: newId(), slug: newToken(), name: "Floor display", createdAt: new Date().toISOString(), archivedAt: null };
    s.codes.set(seed.id, seed);
    s.settings.set("floor_code_id", seed.id);
    globalThis.__durfMemoryState = s;
  }
  return globalThis.__durfMemoryState;
}

const emptyTally = (): MemberTally => Object.fromEntries(MEMBER_IDS.map((id) => [id, 0])) as MemberTally;
const inScope = (r: MatchResult, f?: ResultFilter) => !f?.codeId || r.codeId === f.codeId;
const byNewest = (a: { createdAt: string }, b: { createdAt: string }) => (a.createdAt < b.createdAt ? 1 : -1);

/**
 * In-memory store for local dev. Not safe on Vercel: each serverless
 * instance has its own memory, so nothing would be shared between requests.
 */
export function createMemoryStore(): Store {
  const s = state();

  return {
    async listCodes(opts) {
      return [...s.codes.values()].filter((c) => opts?.includeArchived || !c.archivedAt).sort(byNewest);
    },
    async getCode(id) {
      return s.codes.get(id) ?? null;
    },
    async getCodeBySlug(slug) {
      return [...s.codes.values()].find((c) => c.slug === slug) ?? null;
    },
    async createCode(name) {
      const code: IntakeCode = { id: newId(), slug: newToken(), name, createdAt: new Date().toISOString(), archivedAt: null };
      s.codes.set(code.id, code);
      return code;
    },
    async renameCode(id, name) {
      const code = s.codes.get(id);
      if (code) code.name = name;
    },
    async archiveCode(id) {
      const code = s.codes.get(id);
      if (code && !code.archivedAt) code.archivedAt = new Date().toISOString();
    },
    async codeStats() {
      const stats: CodeStats[] = [];
      for (const code of [...s.codes.values()].sort(byNewest)) {
        const results = s.results.filter((r) => r.codeId === code.id);
        if (code.archivedAt && results.length === 0) continue;
        const byMember = emptyTally();
        for (const r of results) byMember[r.verdict.memberId] += 1;
        const scans = [...s.visits.values()].filter((v) => v.codeId === code.id).length;
        stats.push({ code, scans, submissions: results.length, byMember });
      }
      return stats;
    },

    async createVisit(codeId) {
      const visit: Visit = { id: newId(), codeId, status: "opened", createdAt: new Date().toISOString() };
      s.visits.set(visit.id, visit);
      return visit;
    },
    async getVisit(id) {
      return s.visits.get(id) ?? null;
    },
    async setVisitStatus(id, status) {
      const v = s.visits.get(id);
      if (v) v.status = status;
    },
    async countPending(filter) {
      let n = 0;
      for (const v of s.visits.values()) {
        if (v.status === "processing" && (!filter?.codeId || v.codeId === filter.codeId)) n++;
      }
      return n;
    },

    async savePhoto(_resultId, dataUrl) {
      return dataUrl;
    },
    async saveResult(result) {
      s.results.push(result);
    },
    async getLatestResult(filter) {
      for (let i = s.results.length - 1; i >= 0; i--) if (inScope(s.results[i], filter)) return s.results[i];
      return null;
    },
    async getResult(id) {
      return s.results.find((r) => r.id === id) ?? null;
    },
    async listResults({ limit, before, codeId }) {
      let items = [...s.results].reverse().filter((r) => inScope(r, { codeId }));
      if (before) items = items.filter((r) => r.createdAt < before);
      const page = items.slice(0, limit);
      const last = page[page.length - 1];
      return { results: page, nextCursor: items.length > limit && last ? last.createdAt : null };
    },
    async countByMember(filter) {
      const tally = emptyTally();
      for (const r of s.results) if (inScope(r, filter)) tally[r.verdict.memberId] += 1;
      return tally;
    },
    async deleteResult(id) {
      const i = s.results.findIndex((r) => r.id === id);
      if (i !== -1) s.results.splice(i, 1);
    },

    async getSetting(key) {
      return s.settings.get(key) ?? null;
    },
    async setSetting(key, value) {
      if (value === null) s.settings.delete(key);
      else s.settings.set(key, value);
    },
  };
}
