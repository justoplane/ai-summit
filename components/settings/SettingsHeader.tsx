import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

export function SettingsHeader() {
  return (
    <header>
      <MicroLabel>Durf Dungeon LLC · Distribution · Officers only</MicroLabel>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Intake <GlowText>channels.</GlowText>
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Each code is a reusable link. Rename freely; the link never changes. Archiving retires the
        link but keeps its record.
      </p>
    </header>
  );
}
