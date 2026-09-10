import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  nextCursor: string | null;
  /** The cursor the current page was loaded with, if any. */
  before?: string;
  /** Active source filter, carried across pages. */
  codeId?: string;
};

// Mirrors Button variant="outline"; Button renders a <button>, and a link can't nest inside one.
const linkButton = cn(
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-tight transition",
  "border border-border bg-surface text-foreground hover:bg-surface-strong",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
);

function href(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  const qs = query.toString();
  return qs ? `/history?${qs}` : "/history";
}

export function LedgerPagination({ nextCursor, before, codeId }: Props) {
  if (!nextCursor && !before) return null;

  return (
    <nav aria-label="Ledger periods" className="flex flex-wrap items-center justify-center gap-3">
      {before && (
        <Link href={href({ code: codeId })} className={linkButton}>
          Current period
        </Link>
      )}
      {nextCursor && (
        <Link href={href({ code: codeId, before: nextCursor })} className={linkButton}>
          Prior periods
        </Link>
      )}
    </nav>
  );
}
