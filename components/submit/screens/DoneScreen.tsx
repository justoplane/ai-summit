import { GlowText } from "@/components/ui/GlowText";
import { StatusScreen } from "./StatusScreen";

export function DoneScreen() {
  return (
    <StatusScreen
      glyph="✓"
      tone="cyan"
      eyebrow="status: 200 ok"
      title={<GlowText>Analysis complete.</GlowText>}
      body="Look at the big screen."
      footnote="Your result is being displayed to the room. You may now network."
    />
  );
}
