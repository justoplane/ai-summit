import Image from "next/image";
import type { Member } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";
import { TitleChips } from "@/components/ui/TitleChips";

type Props = {
  member: Member;
  count: number;
  rank: number;
  /** 0-100, relative to the leader's count so the leader's bar is full. */
  pct: number;
  leader: boolean;
};

export function TallyCard({ member, count, rank, pct, leader }: Props) {
  return (
    <li className={cn("glass flex flex-col gap-4 rounded-3xl p-5", leader && "glow")}>
      <div className="flex items-start justify-between gap-3">
        <MicroLabel>#{rank}</MicroLabel>
        {leader && <Badge tone="lime">Top performer</Badge>}
      </div>

      <div className="flex items-center gap-4">
        <Image
          src={member.photo}
          alt={member.name}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{member.name}</p>
          <p className="truncate text-xs text-amber" title={member.achievement}>
            &#9733; {member.achievement}
          </p>
        </div>
      </div>
      <TitleChips titles={member.companyTitle} max={2} />

      <div>
        <p className="font-display text-4xl font-bold leading-none tabular-nums">
          {count}
          <MicroLabel className="ml-2 font-normal">{count === 1 ? "match" : "matches"}</MicroLabel>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-strong">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan via-violet to-magenta"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </li>
  );
}
