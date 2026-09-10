import Image from "next/image";
import type { Member } from "@/lib/types";
import { parseTypeCode } from "@/lib/match/personality";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";
import { TitleChips } from "@/components/ui/TitleChips";

type Props = { member: Member; index: number; placements: number };

/**
 * One officer, annual-report style. Landscape: portrait on the left, everything else to the
 * right, so a whole card fits on a 1080p screen with two per row.
 */
export function ResidentCard({ member, index, placements }: Props) {
  const type = parseTypeCode(member.personalityResults);
  const assessment = type ? `${type.code}${type.suffix ? `-${type.suffix}` : ""}` : "Pending";

  return (
    <li className="glass flex flex-col overflow-hidden rounded-3xl sm:flex-row">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-strong sm:aspect-auto sm:w-52 lg:w-60 xl:w-64">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 1280px) 256px, (min-width: 640px) 240px, 100vw"
          className="object-cover"
        />
        <div className="absolute left-4 top-4">
          <MicroLabel className="rounded-full bg-background/70 px-2 py-1 text-foreground/80 backdrop-blur">
            Officer {String(index).padStart(2, "0")}
          </MicroLabel>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl font-bold tracking-tight">{member.name}</h2>
            <TitleChips titles={member.companyTitle} className="mt-1.5" />
          </div>
          <Badge tone="cyan" className="shrink-0">
            {assessment}
          </Badge>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed">
            <MicroLabel className="mr-2">Track record</MicroLabel>
            <span className="text-amber">&#9733;</span> {member.achievement}
          </p>
          <div>
            <MicroLabel className="block">Statement</MicroLabel>
            <p className="mt-1 text-sm leading-relaxed text-foreground/85">{member.description}</p>
          </div>
        </div>

        <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-3">
          <div className="flex items-baseline gap-2">
            <dt>
              <MicroLabel>Placements</MicroLabel>
            </dt>
            <dd className="font-display text-xl font-bold tabular-nums">{placements}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt>
              <MicroLabel>Tenure</MicroLabel>
            </dt>
            <dd className="font-display text-xl font-bold">FY26</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt>
              <MicroLabel>Comp</MicroLabel>
            </dt>
            <dd className="font-display text-xl font-bold">None</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
