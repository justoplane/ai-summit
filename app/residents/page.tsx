import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { MEMBERS } from "@/content/members";
import { HostShell } from "@/components/chrome/HostShell";
import { ResidentsHeader } from "@/components/residents/ResidentsHeader";
import { ResidentGrid } from "@/components/residents/ResidentGrid";
import { GovernanceNote } from "@/components/residents/GovernanceNote";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leadership" };

export default async function ResidentsPage() {
  await requireAuth();
  const tally = await getStore().countByMember();

  return (
    <HostShell active="residents">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <ResidentsHeader count={MEMBERS.length} />
        <ResidentGrid members={MEMBERS} tally={tally} />
        <GovernanceNote />
      </div>
    </HostShell>
  );
}
