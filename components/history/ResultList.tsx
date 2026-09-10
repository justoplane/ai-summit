import type { MatchResult } from "@/lib/types";
import { MicroLabel } from "@/components/history/MicroLabel";
import { ResultRow } from "@/components/history/ResultRow";

type Props = { results: MatchResult[] };

export function ResultList({ results }: Props) {
  return (
    <section aria-labelledby="runs-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="runs-heading" className="font-display text-3xl font-bold tracking-tight">
          Minutes
        </h2>
        <MicroLabel>Newest first · {results.length} on this page</MicroLabel>
      </div>

      {results.length === 0 ? (
        <div className="glass flex flex-col items-center gap-2 rounded-3xl px-6 py-14 text-center">
          <MicroLabel>No entries</MicroLabel>
          <p className="font-display text-xl">No matches on record. The board has been notified.</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {results.map((result) => (
            <ResultRow key={result.id} result={result} />
          ))}
        </ol>
      )}
    </section>
  );
}
