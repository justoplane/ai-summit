"use client";

import { useSyncExternalStore } from "react";
import { timeAgo } from "@/lib/format";

type Props = { iso: string };

const TICK_MS = 15_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
}

/** Relative time that stays fresh and renders empty on the server, so hydration never mismatches. */
export function TimeAgo({ iso }: Props) {
  const text = useSyncExternalStore(
    subscribe,
    () => timeAgo(iso),
    () => "",
  );
  return <time dateTime={iso}>{text}</time>;
}
