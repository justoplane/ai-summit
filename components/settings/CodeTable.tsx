import type { CodeStats } from "@/lib/types";
import { MicroLabel } from "@/components/history/MicroLabel";
import { CodeRow } from "@/components/settings/CodeRow";

type Props = { stats: CodeStats[]; floorCodeId: string | null };

export function CodeTable({ stats, floorCodeId }: Props) {
  const active = stats.filter((s) => !s.code.archivedAt);
  const archived = stats.filter((s) => s.code.archivedAt);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight">Active codes</h2>
        <MicroLabel>
          {active.length} {active.length === 1 ? "channel" : "channels"}
        </MicroLabel>
      </div>

      {active.length === 0 ? (
        <p className="glass rounded-3xl p-6 text-muted">
          No active codes. Create one above; the floor has nothing to show until you do.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {active.map((s) => (
            <CodeRow key={s.code.id} stats={s} isFloor={s.code.id === floorCodeId} />
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <details className="group glass rounded-3xl">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 transition hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-lg font-semibold">Archived</span>
            <span className="flex items-center gap-3">
              <MicroLabel>{archived.length} retired</MicroLabel>
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-muted transition group-open:rotate-180">
                <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </summary>
          <ul className="flex flex-col divide-y divide-border border-t border-border px-5">
            {archived.map((s) => (
              <li key={s.code.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                <span className="min-w-0 truncate text-muted">{s.code.name}</span>
                <span className="flex gap-5 font-mono text-sm tabular-nums text-muted">
                  <span>
                    {s.scans} <MicroLabel>scans</MicroLabel>
                  </span>
                  <span>
                    {s.submissions} <MicroLabel>submissions</MicroLabel>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
