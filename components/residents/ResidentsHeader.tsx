import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { count: number };

export function ResidentsHeader({ count }: Props) {
  return (
    <header className="flex flex-col gap-3">
      <MicroLabel>Durf Dungeon LLC · Leadership · FY26</MicroLabel>
      <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
        Officers of the <GlowText>company.</GlowText>
      </h1>
      <p className="max-w-2xl text-lg text-muted">
        {count} officers. One (1) house. Biographies were self-reported and have not been independently
        verified. Titles were self-assigned and have not been challenged.
      </p>
    </header>
  );
}
