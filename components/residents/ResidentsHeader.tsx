import { GlowText } from "@/components/ui/GlowText";
import { MicroLabel } from "@/components/history/MicroLabel";

type Props = { count: number; /** h1 on the standalone page, h2 inside the landing page. */ heading?: "h1" | "h2" };

export function ResidentsHeader({ count, heading = "h1" }: Props) {
  const Heading = heading;
  return (
    <header className="flex flex-col gap-3">
      <MicroLabel>Durf Dungeon LLC · Leadership · FY26</MicroLabel>
      <Heading className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
        Officers of the <GlowText>company.</GlowText>
      </Heading>
      <p className="max-w-2xl text-lg text-muted">
        {count} officers. One (1) house. Biographies were self-reported and have not been independently
        verified. Titles were self-assigned and have not been challenged.
      </p>
    </header>
  );
}
