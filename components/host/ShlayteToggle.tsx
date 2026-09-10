"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { patchSettings } from "./settings";

type Props = { on: boolean };

/**
 * Hidden operator toggle. Invisible until hovered or focused; faintly visible while on
 * so the operator can tell it's armed. Forces every match to resident-2.
 */
export function ShlayteToggle({ on }: Props) {
  // Local value only while a change is in flight; otherwise follow the polled server value.
  const [pending, setPending] = useState<boolean | null>(null);
  const checked = pending ?? on;

  async function toggle(next: boolean) {
    setPending(next);
    await patchSettings({ shlayteMaxxing: next });
    setPending(null);
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-full px-2 py-1 transition",
        "hover:opacity-100 focus-within:opacity-100",
        checked ? "opacity-60 text-magenta" : "opacity-0",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={pending !== null}
        onChange={(e) => toggle(e.target.checked)}
        className="size-3 accent-magenta"
      />
      <span>ShlayteMaxxing</span>
    </label>
  );
}
