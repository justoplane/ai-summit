import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

const items = [
  {
    label: "Mission",
    body: "To place every guest with the officer they deserve, whether or not they asked.",
  },
  {
    label: "Operations",
    body: "Guests scan a code on the primary display, complete Form DD-1 on their phone, and receive a placement decision. The committee does not discuss its reasoning.",
  },
  {
    label: "Reporting",
    body: "Every placement is recorded in the ledger with the committee's notes and one risk factor. The ledger is not audited. Nothing here is.",
  },
];

export function AboutSection() {
  return (
    <section id="company" className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <MicroLabel>Item 1 · Business</MicroLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          The <GlowText>company.</GlowText>
        </h2>
        <p className="max-w-2xl text-muted">
          Durf Dungeon LLC is six people and a lease. It has a mission, a process, and a ledger, which is more
          than most companies can say.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <article key={it.label} className="glass flex flex-col gap-3 rounded-3xl p-6">
            <MicroLabel>{it.label}</MicroLabel>
            <p className="text-base leading-relaxed">{it.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
