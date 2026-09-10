import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";
import { EMPTY_COPY } from "./copy";

export function EmptyMatch() {
  return (
    <Card className="relative overflow-hidden p-8 md:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,var(--surface-strong)_50%,transparent_65%)] bg-[length:200%_100%]"
      />
      <div className="relative">
        <Badge tone="violet" live>
          {EMPTY_COPY.badge}
        </Badge>

        <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {EMPTY_COPY.headline.lead} <GlowText>{EMPTY_COPY.headline.glow}</GlowText>
        </h2>
        <p className="mt-4 max-w-[60ch] text-lg text-muted md:text-xl">{EMPTY_COPY.sub}</p>

        <ul className="mt-8 flex flex-col gap-5" aria-hidden>
          {EMPTY_COPY.bars.map((bar, i) => (
            <li key={bar.label}>
              <div className="flex justify-between font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span>{bar.label}</span>
                <span>{bar.value}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className="h-full animate-pulse-glow rounded-full bg-gradient-to-r from-cyan via-violet to-magenta"
                  style={{ width: bar.width, animationDelay: `${i * 0.5}s` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
