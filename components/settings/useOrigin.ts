import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `window.location.origin`, or null during SSR and the first client render. */
export function useOrigin(): string | null {
  return useSyncExternalStore(subscribe, () => window.location.origin, () => null);
}
