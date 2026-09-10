import { requireAuth } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { HostScreen } from "@/components/host/HostScreen";
import { HostShell } from "@/components/chrome/HostShell";

export const dynamic = "force-dynamic";

/** Host display at /floor: the QR to scan plus the latest match reveal. Polling lives in HostScreen. */
export default async function HostPage() {
  await requireAuth();
  const store = getStore();
  const [state, latest] = await Promise.all([store.getHostState(), store.getLatestResult()]);
  return (
    <HostShell active="live">
      <HostScreen initialState={state} initialResult={latest} />
    </HostShell>
  );
}
