const investors = [
  "Sequoia-ish Capital",
  "a16z (Allegedly)",
  "Y Combinator (Waitlist)",
  "Tiger Global Lite",
  "Durf Ventures",
  "SoftBank Vision Fund IV (Unconfirmed)",
  "Founders Fund-Adjacent",
  "Your Mom's 401k",
] as const;

/** "Backed by" strip. Wordmarks are styled text; no real logos, no real investors. */
export function InvestorMarquee() {
  return (
    <section aria-label="Backed by" className="px-4 py-8 sm:px-6">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted/70">
        Backed by
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
        * Logos removed at counsel&apos;s request
      </p>
    </section>
  );
}
