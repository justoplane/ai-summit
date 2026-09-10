import type { MemberTally } from "@/lib/types";
import { MEMBERS } from "@/content/members";
import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";
import { TallyCard } from "@/components/history/TallyCard";

type Props = { tally: MemberTally };

export function TallyStrip({ tally }: Props) {
  const countOf = (id: keyof MemberTally) => tally[id] ?? 0;
  const ranked = [...MEMBERS].sort((a, b) => countOf(b.id) - countOf(a.id));
  const total = MEMBERS.reduce((sum, m) => sum + countOf(m.id), 0);
  const max = ranked[0] ? countOf(ranked[0].id) : 0;

  return (
    <section aria-labelledby="leaderboard-heading" className="flex flex-col gap-5">
      <div>
        <h2 id="leaderboard-heading" className="font-display text-3xl font-bold tracking-tight">
          Resident <GlowText>Leaderboard</GlowText>
        </h2>
        <MicroLabel className="mt-1 block">
          {total} {total === 1 ? "run" : "runs"} logged · 99.9973% ledger integrity
        </MicroLabel>
      </div>

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {ranked.map((member, i) => {
          const count = countOf(member.id);
          return (
            <TallyCard
              key={member.id}
              member={member}
              count={count}
              rank={i + 1}
              pct={max > 0 ? Math.round((count / max) * 100) : 0}
              leader={max > 0 && count === max}
            />
          );
        })}
      </ol>
    </section>
  );
}
