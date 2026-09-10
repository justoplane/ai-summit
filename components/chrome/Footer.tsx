import { Ticker } from "@/components/chrome/Ticker";

type MicroLink = { label: string; live?: boolean };

const microLinks: MicroLink[] = [
  { label: "Investor relations" },
  { label: "Governance" },
  { label: "Legal (we asked a friend)" },
  { label: "Status: operational", live: true },
  { label: "Careers: not hiring" },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <Ticker />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          © Durf Dungeon LLC. Not incorporated.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted/80">
          {microLinks.map((link) => (
            <li key={link.label} className="flex items-center gap-1.5">
              {link.live && <span className="size-1.5 rounded-full bg-lime animate-pulse-glow" />}
              <span>{link.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
