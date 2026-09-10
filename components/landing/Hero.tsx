import Link from "next/link";
import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

const cta =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-[30%] h-[380px] w-[380px] rounded-full bg-cyan/15 blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <MicroLabel>Durf Dungeon LLC · Form 10-K · Fiscal year 2026</MicroLabel>
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          Welcome to the <GlowText>Dungeon.</GlowText>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Durf Dungeon LLC is dedicated to the pursuit of maximum motion for all. Comprised of a group of highly 
          skilled and passionate networkers, DDLLC strives to grow the collective Network of all its members.
          Originally founded as a philanthropic organization, DDLLC has retained its commitment to giving back to
          the Network in many ways.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className={`${cta} bg-gradient-to-r from-cyan via-violet to-magenta text-white shadow-[0_0_30px_-8px_var(--violet)] hover:brightness-110`}
          >
            Sign in
          </Link>
          <a href="#leadership" className={`${cta} border border-border bg-surface text-foreground hover:bg-surface-strong`}>
            Meet the officers
          </a>
        </div>
      </div>
    </section>
  );
}
