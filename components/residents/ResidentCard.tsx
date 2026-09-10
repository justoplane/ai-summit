import Image from "next/image";
import type { Member } from "@/lib/types";
import { parseTypeCode } from "@/lib/match/personality";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { member: Member; index: number; placements: number };

/** One officer, annual-report style: portrait, title, track record, statement, and the numbers. */
export function ResidentCard({ member, index, placements }: Props) {
  const type = parseTypeCode(member.personalityResults);
  const assessment = type ? `${type.code}${type.suffix ? `-${type.suffix}` : ""}` : "Pending";

  return (
    <li className="glass flex flex-col overflow-hidden rounded-3xl">
      <div className="relative aspect-[4/5] w-full bg-surface-strong">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-background/90 to-transparent p-5 pt-16">
          <div className="min-w-0">
            <MicroLabel className="block text-foreground/70">Officer {String(index).padStart(2, "0")}</MicroLabel>
            <h2 className="mt-1 truncate font-display text-2xl font-bold tracking-tight">{member.name}</h2>
          </div>
          <Badge tone="cyan" className="shrink-0">
            {assessment}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <p className="text-sm leading-snug text-muted">{member.companyTitle}</p>

        <div>
          <MicroLabel className="block">Track record</MicroLabel>
          <p className="mt-1 text-sm leading-relaxed">
            <span className="text-amber">&#9733;</span> {member.achievement}
          </p>
        </div>

        <div>
          <MicroLabel className="block">Statement</MicroLabel>
          <p className="mt-1 text-sm leading-relaxed text-foreground/85">{member.description}</p>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-border pt-4">
          <div>
            <dt>
              <MicroLabel>Placements</MicroLabel>
            </dt>
            <dd className="font-display text-2xl font-bold tabular-nums">{placements}</dd>
          </div>
          <div>
            <dt>
              <MicroLabel>Tenure</MicroLabel>
            </dt>
            <dd className="font-display text-2xl font-bold">FY26</dd>
          </div>
          <div>
            <dt>
              <MicroLabel>Comp</MicroLabel>
            </dt>
            <dd className="font-display text-2xl font-bold">None</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
