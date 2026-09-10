import Image from "next/image";
import type { MatchResult } from "@/lib/types";
import { getMember } from "@/content/members";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { MicroLabel } from "@/components/history/MicroLabel";
import { ResultDetails } from "@/components/history/ResultDetails";
import { DeleteRunButton } from "@/components/history/DeleteRunButton";

type Props = { result: MatchResult };

// <summary> only permits phrasing content, so the row is built from spans.
export function ResultRow({ result }: Props) {
  const { submitter, verdict } = result;
  const member = getMember(verdict.memberId);

  return (
    <li className="glass rounded-3xl">
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-col gap-4 rounded-3xl p-5 transition hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 group-open:rounded-b-none md:flex-row md:items-center md:gap-6 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-wrap items-center gap-3 md:shrink-0">
            <span className="flex min-w-0 max-w-full items-center gap-3">
              <Image
                src={submitter.photoUrl}
                alt={submitter.name}
                width={56}
                height={56}
                unoptimized
                className="size-14 shrink-0 rounded-2xl object-cover"
              />
              <span className="min-w-0 md:max-w-40">
                <MicroLabel className="block">Applicant</MicroLabel>
                <span className="block truncate font-semibold">{submitter.name}</span>
              </span>
            </span>

            <span aria-hidden className="px-1 text-2xl leading-none text-magenta">♥</span>
            <span className="sr-only">placed with</span>

            <span className="flex min-w-0 max-w-full items-center gap-3">
              <Image
                src={member.photo}
                alt={member.name}
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-2xl object-cover"
              />
              <span className="min-w-0 md:max-w-40">
                <span className="block truncate font-semibold">{member.name}</span>
                <span className="block truncate text-sm text-muted">{member.companyTitle}</span>
              </span>
            </span>
          </span>

          <span className="min-w-0 flex-1 font-display text-lg font-medium leading-snug md:line-clamp-2">
            {verdict.headline}
          </span>

          <span className="flex flex-wrap items-center gap-2 md:shrink-0 md:flex-col md:items-end">
            <Badge tone="cyan">
              <span className="text-sm font-bold">{verdict.score}</span>% compatible
            </Badge>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">{formatDateTime(result.createdAt)}</span>
              <Badge>{result.model}</Badge>
            </span>
          </span>

          <DeleteRunButton id={result.id} name={submitter.name} />

          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="hidden size-4 shrink-0 text-muted transition group-open:rotate-180 md:block"
          >
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </summary>

        <ResultDetails result={result} />
      </details>
    </li>
  );
}
