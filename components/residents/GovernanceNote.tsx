import { MicroLabel } from "@/components/history/MicroLabel";

/** The footnote every leadership page has, written honestly. */
export function GovernanceNote() {
  return (
    <aside className="glass rounded-3xl p-6 md:p-8">
      <MicroLabel className="block">Governance</MicroLabel>
      <div className="mt-3 grid gap-6 text-sm leading-relaxed text-muted md:grid-cols-3">
        <p>
          <span className="text-foreground">Compensation.</span> Officers receive no salary. Equity is
          disputed. The dishwasher is considered a benefit.
        </p>
        <p>
          <span className="text-foreground">Board.</span> The board consists of the officers. Quorum is
          whoever is in the kitchen. Minutes are kept in the ledger.
        </p>
        <p>
          <span className="text-foreground">Succession.</span> There is no succession plan. Officers serve
          until the lease ends, and in some cases after.
        </p>
      </div>
    </aside>
  );
}
