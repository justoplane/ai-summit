import type { IntakeCode, MatchResult } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { MATCH_COPY } from "./copy";
import { TimeAgo } from "./TimeAgo";

type Props = {
  result: MatchResult;
  /** Active codes; the result's code may be archived (absent) or null (predates codes). */
  codes: IntakeCode[];
  runnerUpName: string;
  /** The matched resident's notable achievement. */
  achievement: string;
};

/** Badge defaults to 11px; the inner spans bump it so it reads from a couch. */
const readable = "text-xs md:text-sm";

function sourceName(codeId: string | null, codes: IntakeCode[]): string {
  if (codeId === null) return MATCH_COPY.unattributed;
  return codes.find((c) => c.id === codeId)?.name ?? MATCH_COPY.retiredCode;
}

export function MatchBadges({ result, codes, runnerUpName, achievement }: Props) {
  return (
    <div className="mt-8 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="amber">
          <span className={readable}>{MATCH_COPY.achievement}</span>
          <span className="font-sans text-sm normal-case tracking-normal md:text-base">{achievement}</span>
        </Badge>
        <Badge tone="magenta">
          <span className={readable}>{MATCH_COPY.redFlag}</span>
          <span className="font-sans text-sm normal-case tracking-normal md:text-base">{result.verdict.redFlag}</span>
        </Badge>
        <Badge tone="violet">
          <span className={readable}>
            {MATCH_COPY.runnerUp}: {runnerUpName}
          </span>
        </Badge>
        <Badge tone="cyan">
          <span className={readable}>
            {MATCH_COPY.via} &middot; {sourceName(result.codeId, codes)}
          </span>
        </Badge>
        <Badge>
          <span className={readable}>
            {MATCH_COPY.model}: {result.model}
          </span>
        </Badge>
        <Badge>
          <span className={readable}>
            <TimeAgo iso={result.createdAt} />
          </span>
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="cyan">
          <span className={readable}>Applicant claims</span>
          <span className="font-sans text-sm normal-case tracking-normal md:text-base">{result.submitter.achievement}</span>
        </Badge>
        {result.submitter.traits?.map((trait) => (
          <Badge key={trait}>
            <span className={readable}>{trait}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
