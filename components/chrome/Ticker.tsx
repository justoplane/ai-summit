type Metric = { label: string; value: string };

const metrics: Metric[] = [
  { label: "Headcount", value: "6" },
  { label: "Facilities", value: "1 (house)" },
  { label: "Open roles", value: "0" },
  { label: "Uptime", value: "100%" },
  { label: "Dishwasher", value: "pending review" },
  { label: "FY26 guidance", value: "withdrawn" },
  { label: "Matches to date", value: "see ledger" },
  { label: "Legal", value: "has declined to comment" },
  { label: "Dividend", value: "none" },
  { label: "Next all-hands", value: "Sunday" },
  { label: "Thermostat", value: "under board review" },
];

/** Decorative scrolling metrics strip. Hidden from assistive tech. */
export function Ticker() {
  // Rendered twice so the -50% marquee loop is seamless.
  const strip = metrics.map((metric) => (
    <span key={metric.label} className="flex shrink-0 items-center gap-6 pr-6">
      <span>
        <span className="text-muted">{metric.label}</span>{" "}
        <span className="text-cyan">{metric.value}</span>
      </span>
      <span className="size-1 rounded-full bg-magenta/70" />
    </span>
  ));

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-border bg-surface [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div className="flex w-max animate-marquee py-2 font-mono text-[11px] uppercase tracking-[0.18em] motion-reduce:animate-none hover:[animation-play-state:paused]">
        <div className="flex shrink-0">{strip}</div>
        <div className="flex shrink-0">{strip}</div>
      </div>
    </div>
  );
}
