import type { MatchResult } from "@/lib/types";
import { getMember } from "@/content/members";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { result: MatchResult };

/** The expanded body of a ledger row. */
export function ResultDetails({ result }: Props) {
  const { submitter, verdict } = result;
  const runnerUp = getMember(verdict.runnerUpId);

  return (
    <div className="grid gap-6 border-t border-border px-5 py-5 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <div>
          <MicroLabel className="block">Rationale</MicroLabel>
          <p className="mt-2 text-sm leading-relaxed">{verdict.rationale}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <Badge tone="magenta" className="shrink-0">
            Red flag
          </Badge>
          <p className="text-sm leading-relaxed">{verdict.redFlag}</p>
        </div>
        <div>
          <MicroLabel className="block">Runner-up</MicroLabel>
          <p className="mt-1 text-sm">
            {runnerUp.name} <span className="text-muted">· {runnerUp.companyTitle}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <MicroLabel className="block">Declared traits</MicroLabel>
          {submitter.traits.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {submitter.traits.map((trait) => (
                <li key={trait}>
                  <Badge>{trait}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">None declared.</p>
          )}
        </div>
        <div>
          <MicroLabel className="block">In their words</MicroLabel>
          <p className="mt-2 text-sm leading-relaxed text-muted">{submitter.description || "—"}</p>
        </div>
      </div>
    </div>
  );
}
