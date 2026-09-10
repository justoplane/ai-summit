"use client";

import { MAX_TRAITS, MIN_TRAITS, TRAITS } from "@/content/traits";
import { cn } from "@/lib/cn";

type Props = {
  value: string[];
  onChange: (traits: string[]) => void;
  labelledBy?: string;
};

export function TraitPicker({ value, onChange, labelledBy }: Props) {
  const atMax = value.length >= MAX_TRAITS;

  function toggle(trait: string) {
    if (value.includes(trait)) onChange(value.filter((t) => t !== trait));
    else if (!atMax) onChange([...value, trait]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
        {TRAITS.map((trait) => {
          const selected = value.includes(trait);
          const disabled = !selected && atMax;
          return (
            <button
              key={trait}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggle(trait)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-medium transition active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                selected
                  ? "border-violet/70 bg-gradient-to-r from-cyan/20 via-violet/30 to-magenta/20 text-foreground shadow-[0_0_24px_-10px_var(--violet)]"
                  : "border-border bg-surface text-muted hover:bg-surface-strong",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              {trait}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span aria-live="polite" className={cn("tabular-nums", atMax && "text-cyan")}>
          {value.length} / {MAX_TRAITS} selected
        </span>
        <span>{atMax ? "capacity reached" : `min ${MIN_TRAITS}`}</span>
      </div>
    </div>
  );
}
