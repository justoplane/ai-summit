import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement>;

/** Mono uppercase micro-label: the theme's answer to a caption. */
export function MicroLabel({ className, ...rest }: Props) {
  return (
    <span
      className={cn("font-mono text-[11px] uppercase tracking-[0.14em] text-muted", className)}
      {...rest}
    />
  );
}
