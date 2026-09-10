import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: Props) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground placeholder:text-muted/70",
        "focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30",
        className,
      )}
      {...rest}
    />
  );
}
