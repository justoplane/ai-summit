import { StatusScreen } from "./StatusScreen";

export function InvalidScreen() {
  return (
    <StatusScreen
      glyph="✕"
      tone="magenta"
      eyebrow="status: 404 not found"
      title="Link expired."
      body="Scan the QR code on the big screen again to get a fresh one."
    />
  );
}
