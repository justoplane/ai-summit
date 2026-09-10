import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";
import { TitleChips } from "@/components/ui/TitleChips";
import { RevealConfetti } from "@/components/host/RevealConfetti";
import { getMember } from "@/content/members";
import type { MatchVerdict } from "@/lib/types";

type Props = { resultId: string; verdict: MatchVerdict };

/**
 * Phone-side reveal, shown when the applicant stays on the page long enough for the
 * verdict to come back. Abbreviated on purpose: the full memo is on the primary display.
 */
export function MatchedScreen({ resultId, verdict }: Props) {
  const member = getMember(verdict.memberId);
  const runnerUp = getMember(verdict.runnerUpId);

  return (
    <section className="flex flex-1 flex-col pb-10 animate-rise">
      <RevealConfetti resultId={resultId} />

      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">status: placed</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        You have been <GlowText>placed</GlowText>.
      </h1>
      <p className="mt-2 text-sm text-muted">{verdict.headline}</p>

      <Card featured className="mt-6 flex flex-col items-center p-6 text-center">
        <div className="glow relative aspect-square w-40 overflow-hidden rounded-3xl border border-border bg-surface-strong">
          <Image src={member.photo} alt={member.name} fill sizes="160px" className="object-cover" />
        </div>
        <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Resident</span>
        <span className="font-display text-2xl font-bold tracking-tight">{member.name}</span>
        <TitleChips titles={member.companyTitle} align="center" max={3} className="mt-2" />

        <div className="mt-5 flex w-full items-baseline justify-between border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span>Compatibility</span>
          <span className="text-gradient font-display text-2xl font-bold tabular-nums tracking-tight">
            {verdict.score}%
          </span>
        </div>
      </Card>

      <dl className="mt-6 flex flex-col gap-4 text-sm">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Track record</dt>
          <dd className="mt-1 text-foreground/85">{member.achievement}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Also considered</dt>
          <dd className="mt-1 text-foreground/85">{runnerUp.name}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <Badge tone="cyan" live>
          Primary display
        </Badge>
        <p className="max-w-xs text-sm text-muted">
          The full memo, including the committee&apos;s reasoning and one risk factor, is on the primary
          display. Ref {resultId.slice(0, 8)}.
        </p>
      </div>
    </section>
  );
}
