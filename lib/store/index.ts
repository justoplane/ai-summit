import type { Store } from "@/lib/types";
import { hasSupabase } from "@/lib/env";
import { createMemoryStore } from "./memory";
import { createSupabaseStore } from "./supabase";

let store: Store | undefined;

/** Picks the Supabase store when its env vars are set, otherwise the in-memory dev store. */
export function getStore(): Store {
  if (!store) {
    store = hasSupabase ? createSupabaseStore() : createMemoryStore();
  }
  return store;
}
