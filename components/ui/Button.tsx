import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-gradient-to-r from-cyan via-violet to-magenta text-white shadow-[0_0_30px_-8px_var(--violet)] hover:brightness-110",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-strong",
  ghost: "text-foreground hover:bg-surface",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function Button({ variant = "primary", size = "md", className, ...rest }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
}
