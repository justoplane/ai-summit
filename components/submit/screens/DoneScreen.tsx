import { GlowText } from "@/components/ui/GlowText";
import { StatusScreen } from "./StatusScreen";

export function DoneScreen() {
  return (
    <StatusScreen
      glyph="✓"
      tone="cyan"
      eyebrow="status: received"
      title={<GlowText>Application received.</GlowText>}
      body="Please direct your attention to the primary display."
      footnote="Your result will be discussed at the next all-hands."
    />
  );
}
