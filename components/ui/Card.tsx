import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Adds the animated gradient border. Use sparingly. */
  featured?: boolean;
};

export function Card({ featured, className, ...rest }: Props) {
  return (
    <div
      className={cn("glass rounded-3xl p-6", featured && "gradient-border glow", className)}
      {...rest}
    />
  );
}
