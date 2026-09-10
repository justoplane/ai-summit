const investors = [
  "Household checking",
  "A CD that matures in 2029",
  "One (1) parent",
  "The change jar",
  "Undisclosed",
] as const;

/** "Backed by" strip. Wordmarks are styled text; no real logos, no real investors. */
export function InvestorMarquee() {
  return (
    <section aria-label="Backed by" className="px-4 py-8 sm:px-6">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted/70">
        Capital partners
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {investors.map((name) => (
          <li
            key={name}
            className="font-display text-sm font-bold uppercase tracking-wider text-muted/80 transition hover:text-foreground"
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/50">
        * Logos omitted at counsel&apos;s request. Counsel is also undisclosed.
      </p>
    </section>
  );
}
