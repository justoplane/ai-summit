import type { MemberId, MemberTally } from "@/lib/types";
import { getMember } from "@/content/members";
import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { scans: number; submissions: number; byMember: MemberTally };

export function CodeStatsBlock({ scans, submissions, byMember }: Props) {
  const breakdown = (Object.entries(byMember) as [MemberId, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-3">
      <dl className="flex gap-8">
        <div>
          <dt>
            <MicroLabel>Scans</MicroLabel>
          </dt>
          <dd className="font-display text-3xl font-bold leading-none tabular-nums">{scans}</dd>
        </div>
        <div>
          <dt>
            <MicroLabel>Submissions</MicroLabel>
          </dt>
          <dd className="font-display text-3xl font-bold leading-none tabular-nums">{submissions}</dd>
        </div>
      </dl>

      {breakdown.length > 0 && (
        <details className="group">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 [&::-webkit-details-marker]:hidden">
            Breakdown
            <svg aria-hidden viewBox="0 0 16 16" className="size-3 transition group-open:rotate-180">
              <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </summary>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {breakdown.map(([id, n]) => (
              <li key={id} className="flex items-baseline justify-between gap-4">
                <span className="truncate">{getMember(id).name}</span>
                <span className="font-mono tabular-nums text-muted">{n}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
