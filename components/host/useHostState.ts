import { useCallback, useEffect, useRef, useState } from "react";
import { followScope } from "@/lib/hostState";
import type { HostState, MatchResult } from "@/lib/types";

const POLL_MS = 2000;

type HostFeed = {
  state: HostState;
  result: MatchResult | null;
  /** True once a result lands after mount. Drives the reveal animation and confetti. */
  isNewArrival: boolean;
  /** Last poll failed; `state` and `result` are the last good values. */
  error: boolean;
  /** Poll now instead of waiting out the interval. Call after the operator changes a setting. */
  refresh: () => void;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return (await res.json()) as T;
}

/** The URL for the newest result within the state's follow scope. */
function latestUrl(state: HostState): string {
  const scope = followScope(state);
  return scope ? `/api/results/latest?code=${encodeURIComponent(scope.codeId)}` : "/api/results/latest";
}

/** Polls /api/state; refetches /api/results/latest only when latestResultId moves. Pauses while the tab is hidden. */
export function useHostState(initialState: HostState, initialResult: MatchResult | null): HostFeed {
  const [state, setState] = useState(initialState);
  const [result, setResult] = useState(initialResult);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [error, setError] = useState(false);
  // The result id already on screen, so the reveal fires only for ids that appear after mount.
  const seenResultId = useRef<string | null>(initialState.latestResultId);
  // A scope change swaps the result without a celebration: nobody new actually arrived.
  const seenScope = useRef(latestUrl(initialState));
  const refreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let refreshQueued = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      const next = await getJson<HostState>("/api/state");
      if (cancelled) return;
      setState(next);
      const url = latestUrl(next);
      const scopeChanged = url !== seenScope.current;
      seenScope.current = url;
      if (!scopeChanged && next.latestResultId === seenResultId.current) return;

      const latest = await getJson<MatchResult | null>(url);
      if (cancelled) return;
      const arrived = !scopeChanged && latest !== null && latest.id !== seenResultId.current;
      seenResultId.current = latest?.id ?? next.latestResultId;
      setResult(latest);
      if (arrived) setIsNewArrival(true);
    };

    const tick = async () => {
      if (cancelled || inFlight) return;
      inFlight = true;
      if (document.visibilityState !== "hidden") {
        try {
          await poll();
          if (!cancelled) setError(false);
        } catch {
          if (!cancelled) setError(true);
        }
      }
      inFlight = false;
      if (cancelled) return;
      const delay = refreshQueued ? 0 : POLL_MS;
      refreshQueued = false;
      timer = setTimeout(tick, delay);
    };

    const now = () => {
      // A poll already running may predate the change that prompted this; run again once it settles.
      if (inFlight) {
        refreshQueued = true;
        return;
      }
      clearTimeout(timer);
      void tick();
    };
    refreshRef.current = now;

    // Catch up immediately when the tab comes back instead of waiting out the interval.
    const onVisibility = () => {
      if (document.visibilityState === "visible") now();
    };

    timer = setTimeout(tick, POLL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const refresh = useCallback(() => refreshRef.current(), []);

  return { state, result, isNewArrival, error, refresh };
}
