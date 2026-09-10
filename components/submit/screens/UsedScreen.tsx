import { StatusScreen } from "./StatusScreen";

export function UsedScreen() {
  return (
    <StatusScreen
      glyph="↻"
      tone="amber"
      eyebrow="status: already used"
      title="This link has been used."
      body="Scan the code on the display for a new one."
    />
  );
}
