import type { FloorFollow, HostState, Store } from "@/lib/types";

/**
 * Assemble what the floor polls. Lives outside the Store so both store
 * implementations share the same rules:
 * - the displayed code is the `floor_code_id` setting, falling back to the newest active code
 * - the reveal follows either that code or every code (`floor_follow`)
 */
export async function getHostState(store: Store): Promise<HostState> {
  const [codes, floorCodeId, followRaw, shlayte] = await Promise.all([
    store.listCodes(),
    store.getSetting("floor_code_id"),
    store.getSetting("floor_follow"),
    store.getSetting("shlayte_maxxing"),
  ]);
  const floorCode = codes.find((c) => c.id === floorCodeId) ?? codes[0] ?? null;
  const follow: FloorFollow = followRaw === "all" ? "all" : "code";
  const scope = follow === "code" && floorCode ? { codeId: floorCode.id } : undefined;
  const [pending, latest] = await Promise.all([store.countPending(scope), store.getLatestResult(scope)]);
  return {
    floorCode,
    follow,
    codes,
    pending,
    latestResultId: latest?.id ?? null,
    shlayteMaxxing: shlayte === "1",
  };
}

/** The result filter the floor reveal should use, derived the same way as getHostState. */
export function followScope(state: Pick<HostState, "floorCode" | "follow">) {
  return state.follow === "code" && state.floorCode ? { codeId: state.floorCode.id } : undefined;
}
