import { useEffect, useRef, useState } from "react";
import type { HostState, MatchResult } from "@/lib/types";

const POLL_MS = 2000;

type HostFeed = {
  state: HostState;
  result: MatchResult | null;
  /** True once a result lands after mount. Drives the reveal animation and confetti. */
  isNewArrival: boolean;
  /** Last poll failed; `state` and `result` are the last good values. */
  error: boolean;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return (await res.json()) as T;
}

/** Polls /api/state; refetches /api/results/latest only when latestResultId moves. Pauses while the tab is hidden. */
export function useHostState(initialState: HostState, initialResult: MatchResult | null): HostFeed {
  const [state, setState] = useState(initialState);
  const [result, setResult] = useState(initialResult);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [error, setError] = useState(false);
  // The result id already on screen, so the reveal fires only for ids that appear after mount.
  const seenResultId = useRef<string | null>(initialState.latestResultId);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      const next = await getJson<HostState>("/api/state");
      if (cancelled) return;
      setState(next);
      if (next.latestResultId === seenResultId.current) return;

      const latest = await getJson<MatchResult | null>("/api/results/latest");
      if (cancelled) return;
      const arrived = latest !== null && latest.id !== seenResultId.current;
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
      if (!cancelled) timer = setTimeout(tick, POLL_MS);
    };

    // Catch up immediately when the tab comes back instead of waiting out the interval.
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(timer);
      void tick();
    };

    timer = setTimeout(tick, POLL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { state, result, isNewArrival, error };
}
