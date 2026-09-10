import type { IntakeCode, MatchResult } from "@/lib/types";
import { getMember } from "@/content/members";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";
import { codeLabel } from "@/components/history/codeLabel";

type Props = {
  result: MatchResult;
  /** The intake code this run came through; null when unattributed or unknown. */
  code: IntakeCode | null;
};

/** The expanded body of a ledger row. */
export function ResultDetails({ result, code }: Props) {
  const { submitter, verdict } = result;
  const member = getMember(verdict.memberId);
  const runnerUp = getMember(verdict.runnerUpId);

  return (
    <div className="grid gap-6 border-t border-border px-5 py-5 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <div>
          <MicroLabel className="block">Committee notes</MicroLabel>
          <p className="mt-2 text-sm leading-relaxed">{verdict.rationale}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <Badge tone="magenta" className="shrink-0">
            Risk factor
          </Badge>
          <p className="text-sm leading-relaxed">{verdict.redFlag}</p>
        </div>
        <div>
          <MicroLabel className="block">Track record</MicroLabel>
          <p className="mt-1 text-sm">
            <span className="text-amber">&#9733;</span> {member.achievement}
          </p>
        </div>
        <div>
          <MicroLabel className="block">Also considered</MicroLabel>
          <p className="mt-1 text-sm">
            {runnerUp.name} <span className="text-muted">· {runnerUp.companyTitle}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <MicroLabel className="block">Self-reported traits</MicroLabel>
          {submitter.traits.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {submitter.traits.map((trait) => (
                <li key={trait}>
                  <Badge>{trait}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">None reported. The committee has noted this.</p>
          )}
        </div>
        <div>
          <MicroLabel className="block">Statement</MicroLabel>
          <p className="mt-2 text-sm leading-relaxed text-muted">{submitter.description || "No statement was provided."}</p>
        </div>
        <div>
          <MicroLabel className="block">Source</MicroLabel>
          {code ? (
            <p className="mt-1 text-sm">
              {codeLabel(code)}
              {result.visitId && (
                <span className="ml-2 font-mono text-xs text-muted">visit {result.visitId.slice(0, 8)}</span>
              )}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">Unattributed</p>
          )}
        </div>
      </div>
    </div>
  );
}
