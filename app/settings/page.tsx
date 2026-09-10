import type { Metadata } from "next";
import type { FloorFollow } from "@/lib/types";
import { requireAuth } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { HostShell } from "@/components/chrome/HostShell";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { FloorControls } from "@/components/settings/FloorControls";
import { CreateCodeForm } from "@/components/settings/CreateCodeForm";
import { CodeTable } from "@/components/settings/CodeTable";
import { SettingsFootnote } from "@/components/settings/SettingsFootnote";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAuth();

  const store = getStore();
  const [stats, floorCodeId, followRaw] = await Promise.all([
    store.codeStats(),
    store.getSetting("floor_code_id"),
    store.getSetting("floor_follow"),
  ]);

  const active = stats.filter((s) => !s.code.archivedAt).map((s) => s.code);
  // Same fallback as getHostState: an unset or stale setting means the newest active code.
  const floorId = active.find((c) => c.id === floorCodeId)?.id ?? active[0]?.id ?? null;
  const follow: FloorFollow = followRaw === "all" ? "all" : "code";

  return (
    <HostShell active="settings">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <SettingsHeader />
        <FloorControls codes={active} floorCodeId={floorId} follow={follow} />
        <CreateCodeForm />
        <CodeTable stats={stats} floorCodeId={floorId} />
        <SettingsFootnote />
      </div>
    </HostShell>
  );
}
