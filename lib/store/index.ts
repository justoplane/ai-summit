import type { Store } from "@/lib/types";
import { hasSupabase } from "@/lib/env";
import { createMemoryStore } from "./memory";

let store: Store | undefined;

/** Picks the Supabase store when its env vars are set, otherwise the in-memory dev store. */
export function getStore(): Store {
  if (!store) {
    // TODO(agent A): `store = hasSupabase ? createSupabaseStore() : createMemoryStore()`
    if (hasSupabase) {
      console.warn("[store] Supabase env is set but the Supabase store is not wired up yet. Using memory store.");
    }
    store = createMemoryStore();
  }
  return store;
}
