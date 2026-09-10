import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "cyan" | "violet" | "lime" | "amber" | "magenta";
  /** Shows a pulsing status dot before the text. */
  live?: boolean;
};

const tones = {
  neutral: "border-border text-muted",
  cyan: "border-cyan/40 text-cyan",
  violet: "border-violet/40 text-violet",
  lime: "border-lime/40 text-lime",
  amber: "border-amber/40 text-amber",
  magenta: "border-magenta/40 text-magenta",
};

export function Badge({ tone = "neutral", live, className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {live && <span className="size-1.5 rounded-full bg-current animate-pulse-glow" />}
      {children}
    </span>
  );
}
