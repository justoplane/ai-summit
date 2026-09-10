import type { ChangeEvent } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  /** "user" opens the front camera directly on phones; omit for the photo library. */
  capture?: "user" | "environment";
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/** A big tappable tile wrapping a visually hidden file input. */
export function PhotoTile({ id, label, sub, icon, capture, disabled, onChange }: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "glass flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-4 text-center transition",
        "hover:bg-surface-strong active:scale-[0.98] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan/70",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        capture={capture}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <span aria-hidden className="text-2xl text-cyan">
        {icon}
      </span>
      <span className="text-sm font-semibold">{label}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{sub}</span>
    </label>
  );
}
