import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Props = { active: "live" | "history" | "residents" };

const links = [
  { key: "live", href: "/floor", label: "Floor" },
  { key: "history", href: "/history", label: "Ledger" },
  { key: "residents", href: "/residents", label: "Leadership" },
] as const;

export function TopBar({ active }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 max-sm:hidden">
          <Link
            href="/"
            className="hidden truncate font-mono text-xs font-semibold uppercase tracking-[0.22em] text-foreground transition hover:text-cyan sm:block"
          >
            Durf Dungeon LLC
          </Link>
          <span className="hidden sm:inline-flex">
            <Badge tone="violet">FY26 · Q3</Badge>
          </span>
        </div>

        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-border bg-surface p-1"
        >
          {links.map((link) => {
            const isActive = link.key === active;
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                  isActive
                    ? "bg-surface-strong text-foreground shadow-[0_0_20px_-6px_var(--cyan)]"
                    : "text-muted hover:text-foreground",
                )}
              >
                {isActive && <span className="size-1.5 rounded-full bg-cyan animate-pulse-glow" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form method="post" action="/api/logout">
          <Button type="submit" variant="ghost" size="sm" className="whitespace-nowrap">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
