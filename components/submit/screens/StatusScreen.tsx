import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  glyph: string;
  tone?: "cyan" | "violet" | "magenta" | "amber";
  /** Mono status line above the headline, e.g. "status: 409 conflict". */
  eyebrow: string;
  title: ReactNode;
  body: string;
  footnote?: string;
  action?: ReactNode;
};

const rings = {
  cyan: "border-cyan/50 text-cyan shadow-[0_0_48px_-12px_var(--cyan)]",
  violet: "border-violet/50 text-violet shadow-[0_0_48px_-12px_var(--violet)]",
  magenta: "border-magenta/50 text-magenta shadow-[0_0_48px_-12px_var(--magenta)]",
  amber: "border-amber/50 text-amber shadow-[0_0_48px_-12px_var(--amber)]",
};

/** Centered terminal screen: glyph, eyebrow, headline, body, optional action. */
export function StatusScreen({ glyph, tone = "violet", eyebrow, title, body, footnote, action }: Props) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center animate-rise">
      <div
        aria-hidden
        className={cn(
          "flex size-24 items-center justify-center rounded-full border bg-surface font-display text-4xl font-bold",
          rings[tone],
        )}
      >
        {glyph}
      </div>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-xs text-base text-muted">{body}</p>
      {footnote && <p className="mt-6 max-w-xs text-sm text-muted/80">{footnote}</p>}
      {action && <div className="mt-8 w-full">{action}</div>}
    </section>
  );
}
