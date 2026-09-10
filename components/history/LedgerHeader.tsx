import Link from "next/link";
import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

export function LedgerHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <MicroLabel>Durf Dungeon LLC · Internal · SOC 2 (pending)</MicroLabel>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Results <GlowText>Ledger</GlowText>
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Every compatibility inference ever committed to the edge. Immutable, auditable, mostly accurate.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full font-mono text-xs uppercase tracking-[0.14em] text-muted transition hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
      >
        ← Live screen
      </Link>
    </header>
  );
}
