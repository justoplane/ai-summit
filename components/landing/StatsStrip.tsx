import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { headcount: number; placements: number };

/** The numbers an annual report leads with, for a house. */
export function StatsStrip({ headcount, placements }: Props) {
  const stats = [
    { label: "Headcount", value: String(headcount), note: "all officers" },
    { label: "Facilities", value: "1", note: "house" },
    { label: "Placements to date", value: String(placements), note: "see ledger" },
    { label: "Founded", value: "FY26", note: "lease-backed" },
  ];
  return (
    <section aria-label="Company figures" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <dl className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 bg-background/40 p-6">
            <dt>
              <MicroLabel>{s.label}</MicroLabel>
            </dt>
            <dd className="font-display text-4xl font-bold tabular-nums">{s.value}</dd>
            <dd className="text-xs text-muted">{s.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
