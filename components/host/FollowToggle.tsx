"use client";

import type { FloorFollow } from "@/lib/types";
import { cn } from "@/lib/cn";
import { HOST_COPY } from "./copy";

type Props = {
  value: FloorFollow;
  disabled?: boolean;
  onChange: (next: FloorFollow) => void;
};

const OPTIONS: { value: FloorFollow; label: string }[] = [
  { value: "code", label: HOST_COPY.followCode },
  { value: "all", label: HOST_COPY.followAll },
];

/** Compact segmented control: which submissions the reveal follows. */
export function FollowToggle({ value, disabled, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label={HOST_COPY.followLabel}
      className="glass flex shrink-0 items-center gap-0.5 rounded-full p-0.5"
    >
      {OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => !selected && onChange(opt.value)}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
              "disabled:cursor-not-allowed disabled:opacity-60",
              selected ? "bg-surface-strong text-cyan" : "text-muted hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
