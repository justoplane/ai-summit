import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const sections = [
  { href: "#company", label: "Company" },
  { href: "#leadership", label: "Leadership" },
  { href: "#investors", label: "Investors" },
];

/** Public top bar. The only way in is the Sign in button. */
export function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-mono text-xs font-semibold uppercase tracking-[0.22em]">Durf Dungeon LLC</span>
          <span className="hidden sm:inline-flex">
            <Badge tone="violet">FY26 · Q3</Badge>
          </span>
        </div>

        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-cyan via-violet to-magenta px-4 text-sm font-semibold tracking-tight text-white shadow-[0_0_30px_-8px_var(--violet)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
