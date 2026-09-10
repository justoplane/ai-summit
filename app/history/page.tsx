import type { Metadata } from "next";
import type { IntakeCode } from "@/lib/types";
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
type Param = string | string[] | undefined;
type Props = { searchParams: Promise<{ before?: Param; code?: Param }> };

const first = (v: Param) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function HistoryPage({ searchParams }: Props) {
  await requireAuth();
  const params = await searchParams;
  const before = first(params.before);
  const codeId = first(params.code);

  const store = getStore();
  const [codes, page, tally] = await Promise.all([
    store.listCodes({ includeArchived: true }),
    store.listResults({ limit: 24, before, codeId }),
    store.countByMember({ codeId }),
  ]);
  const codesById = new Map<string, IntakeCode>(codes.map((c) => [c.id, c]));
  const selected = codeId ? codesById.get(codeId) : undefined;

  return (
    <HostShell active="history">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <LedgerHeader codes={codes} selectedCodeId={codeId} />
        <TallyStrip tally={tally} filterName={selected?.name ?? (codeId ? "an unknown code" : undefined)} />
        <ResultList results={page.results} codes={codesById} filtered={Boolean(codeId)} />
        <LedgerPagination nextCursor={page.nextCursor} before={before} codeId={codeId} />
      </div>
    </HostShell>
  );
}
