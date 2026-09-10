"use client";

import { useEffect, useState } from "react";
import { GlowText } from "@/components/ui/GlowText";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { FINAL_LINE, PROCESSING_LINES } from "../processingLines";

const TICK_MS = 700;
const VISIBLE_LINES = 6;

/** Fake meeting-minutes progress log while /api/submit waits on the LLM. */
export function ProcessingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const total = PROCESSING_LINES.length;
  const lines = PROCESSING_LINES.slice(0, step + 1);
  if (step >= total) lines.push(`${FINAL_LINE}${".".repeat(((step - total) % 3) + 1)}`);
  const visible = lines.slice(-VISIBLE_LINES);
  const offset = lines.length - visible.length;
  // Asymptotic so it never quite finishes before the server does.
  const pct = Math.min(99.97, 100 * (1 - Math.exp(-step / 6)));

  return (
    <section className="flex flex-1 flex-col justify-center pb-10 animate-rise">
      <div className="flex items-center gap-3">
        <Spinner className="size-6" label="Under review" />
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Under <GlowText>review</GlowText>.
        </h1>
      </div>
      <p className="mt-2 text-sm text-muted">
        Do not close this tab. The committee is in session.
      </p>

      <ol className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 font-mono text-xs">
        {visible.map((line, i) => {
          const index = offset + i;
          const current = index === lines.length - 1;
          return (
            <li key={index} className={cn("flex gap-3", current ? "text-foreground" : "text-muted")}>
              <span className="tabular-nums text-muted/60">[{(index * 0.7).toFixed(1)}s]</span>
              <span className="flex-1">{line}</span>
              <span className={cn(current ? "text-cyan animate-pulse-glow" : "text-lime")}>
                {current ? "▍" : "ok"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span>review progress</span>
          <span className="tabular-nums text-foreground">{pct.toFixed(2)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-strong">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan via-violet to-magenta transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
