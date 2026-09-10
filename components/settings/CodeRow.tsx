"use client";

import { useRef } from "react";
import type { CodeStats } from "@/lib/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { MicroLabel } from "@/components/history/MicroLabel";
import { QrThumb } from "@/components/settings/QrThumb";
import { CodeName } from "@/components/settings/CodeName";
import { CodeLink } from "@/components/settings/CodeLink";
import { CodeStatsBlock } from "@/components/settings/CodeStatsBlock";
import { CodeActions } from "@/components/settings/CodeActions";
import { useOrigin } from "@/components/settings/useOrigin";

type Props = { stats: CodeStats; isFloor: boolean };

export function CodeRow({ stats, isFloor }: Props) {
  const { code, scans, submissions, byMember } = stats;
  const origin = useOrigin();
  const url = origin ? `${origin}/s/${code.slug}` : null;
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <li className={cn("glass rounded-3xl p-5", isFloor && "glow")}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <QrThumb ref={qrRef} url={url} name={code.name} />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <MicroLabel>Created {formatDateTime(code.createdAt)}</MicroLabel>
            <CodeName id={code.id} name={code.name} />
          </div>
          <CodeLink url={url} slug={code.slug} name={code.name} qrRef={qrRef} />
        </div>

        <div className="flex flex-col gap-4 md:w-56 md:shrink-0 md:items-end">
          <CodeActions id={code.id} isFloor={isFloor} />
          <CodeStatsBlock scans={scans} submissions={submissions} byMember={byMember} />
        </div>
      </div>
    </li>
  );
}
