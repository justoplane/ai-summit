import type { IntakeCode, MatchResult } from "@/lib/types";
import { getMember } from "@/content/members";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyMatch } from "./EmptyMatch";
import { MATCH_COPY } from "./copy";
import { MatchBadges } from "./MatchBadges";
import { Portrait } from "./Portrait";
import { RevealConfetti } from "./RevealConfetti";
import { ScoreCounter } from "./ScoreCounter";

type Props = {
  result: MatchResult | null;
  /** Active codes, to name the one this result came through. */
  codes: IntakeCode[];
  isNewArrival: boolean;
};

export function LatestMatch({ result, codes, isNewArrival }: Props) {
  if (!result) return <EmptyMatch />;

  const member = getMember(result.verdict.memberId);
  const runnerUp = getMember(result.verdict.runnerUpId);

  return (
    // Keyed on the id so every new result remounts: the rise animation and counter replay.
    <Card key={result.id} featured className={cn("p-6 md:p-8", isNewArrival && "animate-rise")}>
      {isNewArrival && <RevealConfetti resultId={result.id} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="cyan" live>
          {MATCH_COPY.badge}
        </Badge>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Ref {result.id.slice(0, 8)}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-8">
        <Portrait
          src={result.submitter.photoUrl}
          name={result.submitter.name}
          label={MATCH_COPY.subjectLabel}
          unoptimized
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-12 animate-pulse-glow text-magenta drop-shadow-[0_0_18px_var(--magenta)] md:size-16"
          >
            <path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z" />
          </svg>
          <ScoreCounter score={result.verdict.score} animate={isNewArrival} />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted md:text-sm">
            {MATCH_COPY.scoreLabel}
          </span>
        </div>

        <Portrait
          src={member.photo}
          name={member.name}
          caption={member.companyTitle}
          label={MATCH_COPY.residentLabel}
        />
      </div>

      <h2 className="mt-8 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        {result.verdict.headline}
      </h2>
      <p className="mt-3 max-w-[70ch] text-lg leading-relaxed text-foreground/85">
        {result.verdict.rationale}
      </p>

      <MatchBadges result={result} codes={codes} runnerUpName={runnerUp.name} achievement={member.achievement} />
    </Card>
  );
}
