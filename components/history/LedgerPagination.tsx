import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  nextCursor: string | null;
  /** The cursor the current page was loaded with, if any. */
  before?: string;
};

// Mirrors Button variant="outline"; Button renders a <button>, and a link can't nest inside one.
const linkButton = cn(
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-tight transition",
  "border border-border bg-surface text-foreground hover:bg-surface-strong",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
);

export function LedgerPagination({ nextCursor, before }: Props) {
  if (!nextCursor && !before) return null;

  return (
    <nav aria-label="Ledger pages" className="flex flex-wrap items-center justify-center gap-3">
      {before && (
        <Link href="/history" className={linkButton}>
          Newest
        </Link>
      )}
      {nextCursor && (
        <Link href={`/history?before=${encodeURIComponent(nextCursor)}`} className={linkButton}>
          Load older runs
        </Link>
      )}
    </nav>
  );
}
