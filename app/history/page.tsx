import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { LedgerHeader } from "@/components/history/LedgerHeader";
import { TallyStrip } from "@/components/history/TallyStrip";
import { ResultList } from "@/components/history/ResultList";
import { LedgerPagination } from "@/components/history/LedgerPagination";
import { HostShell } from "@/components/chrome/HostShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Results" };

// Typed by hand rather than PageProps<"/history">: the generated AppRoutes union
// only includes routes that existed at the last typegen.
type Props = { searchParams: Promise<{ before?: string | string[] }> };

export default async function HistoryPage({ searchParams }: Props) {
  await requireAuth();
  const params = await searchParams;
  const before = Array.isArray(params.before) ? params.before[0] : params.before;

  const store = getStore();
  const [page, tally] = await Promise.all([
    store.listResults({ limit: 24, before }),
    store.countByMember(),
  ]);

  return (
    <HostShell active="history">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <LedgerHeader />
      <TallyStrip tally={tally} />
      <ResultList results={page.results} />
        <LedgerPagination nextCursor={page.nextCursor} before={before} />
      </div>
    </HostShell>
  );
}
