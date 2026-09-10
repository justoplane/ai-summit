"use client";

import Link from "next/link";
import type { HostState, MatchResult } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { HOST_COPY } from "./copy";
import { LatestMatch } from "./LatestMatch";
import { QrPanel } from "./QrPanel";
import { useHostState } from "./useHostState";

type Props = {
  initialState: HostState;
  initialResult: MatchResult | null;
};

export function HostScreen({ initialState, initialResult }: Props) {
  const { state, result, isNewArrival, error } = useHostState(initialState, initialResult);

  return (
    <div className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-8 px-6 py-8 xl:flex-row xl:items-start xl:gap-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 xl:sticky xl:top-8 xl:mx-0 xl:w-[440px] xl:max-w-none xl:shrink-0 2xl:w-[500px]">
        <QrPanel state={state} />
        <footer className="flex items-center justify-between px-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          <Link
            href="/history"
            className="rounded-full transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
          >
            {HOST_COPY.ledgerLink} &rarr;
          </Link>
          {error && (
            <Badge tone="amber" live>
              {HOST_COPY.reconnecting}
            </Badge>
          )}
        </footer>
      </div>

      <section aria-live="polite" aria-label="Latest match" className="min-w-0 flex-1">
        <LatestMatch result={result} isNewArrival={isNewArrival} />
      </section>
    </div>
  );
}
