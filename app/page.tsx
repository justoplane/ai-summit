import type { Metadata } from "next";
import { MEMBERS } from "@/content/members";
import { getStore } from "@/lib/store";
import { Footer } from "@/components/chrome/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { AboutSection } from "@/components/landing/AboutSection";
import { InvestorSection } from "@/components/landing/InvestorSection";
import { ResidentsHeader } from "@/components/residents/ResidentsHeader";
import { ResidentGrid } from "@/components/residents/ResidentGrid";
import { GovernanceNote } from "@/components/residents/GovernanceNote";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Durf Dungeon LLC" } };

/** Public landing page. Sign in leads to the floor. */
export default async function LandingPage() {
  const tally = await getStore().countByMember();
  const placements = Object.values(tally).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <LandingNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <StatsStrip headcount={MEMBERS.length} placements={placements} />
        <AboutSection />
        <section id="leadership" className="mx-auto flex w-full max-w-[1600px] scroll-mt-24 flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
          <ResidentsHeader count={MEMBERS.length} heading="h2" />
          <ResidentGrid members={MEMBERS} tally={tally} />
          <GovernanceNote />
        </section>
        <InvestorSection />
      </main>
      <Footer />
    </div>
  );
}
