import { StatusScreen } from "./StatusScreen";

export function InvalidScreen() {
  return (
    <StatusScreen
      glyph="✕"
      tone="magenta"
      eyebrow="status: expired"
      title="This link has expired."
      body="Scan the code on the display for a new one."
    />
  );
}
