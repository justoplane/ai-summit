import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: Props) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted/70",
        "focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30",
        className,
      )}
      {...rest}
    />
  );
}
