import { requireAuth } from "@/lib/auth";
import { followScope, getHostState } from "@/lib/hostState";
import { getStore } from "@/lib/store";
import { HostScreen } from "@/components/host/HostScreen";
import { HostShell } from "@/components/chrome/HostShell";

export const dynamic = "force-dynamic";

/** Host display at /floor: the QR for the selected intake code plus the latest match reveal. Polling lives in HostScreen. */
export default async function HostPage() {
  await requireAuth();
  const store = getStore();
  const state = await getHostState(store);
  const latest = await store.getLatestResult(followScope(state));
  return (
    <HostShell active="live">
      <HostScreen initialState={state} initialResult={latest} />
    </HostShell>
  );
}
