import type { Member, MemberTally } from "@/lib/types";
import { ResidentCard } from "@/components/residents/ResidentCard";

type Props = { members: Member[]; tally: MemberTally };

export function ResidentGrid({ members, tally }: Props) {
  return (
    <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member, i) => (
        <ResidentCard key={member.id} member={member} index={i + 1} placements={tally[member.id] ?? 0} />
      ))}
    </ol>
  );
}
