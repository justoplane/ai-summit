import { GlowText } from "@/components/ui/GlowText";
import { InvestorMarquee } from "@/components/chrome/InvestorMarquee";
import { MicroLabel } from "@/components/history/MicroLabel";

export function InvestorSection() {
  return (
    <section id="investors" className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <MicroLabel>Item 7 · Investor relations</MicroLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Capital <GlowText>partners.</GlowText>
        </h2>
      </div>
      <InvestorMarquee />
      <p className="max-w-3xl text-xs leading-relaxed text-muted">
        Forward-looking statements. This page contains forward-looking statements, including statements
        regarding compatibility, the dishwasher, and the lease. These statements involve risks and
        uncertainties, and actual results may differ materially. The company undertakes no obligation to
        update any forward-looking statement, or the dishwasher.
      </p>
    </section>
  );
}
