import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement>;

/** Gradient headline text. Wrap the words you want to pop. */
export function GlowText({ className, ...rest }: Props) {
  return <span className={cn("text-gradient", className)} {...rest} />;
}
