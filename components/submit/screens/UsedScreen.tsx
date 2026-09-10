import { StatusScreen } from "./StatusScreen";

export function UsedScreen() {
  return (
    <StatusScreen
      glyph="↻"
      tone="amber"
      eyebrow="status: 409 conflict"
      title="This link has already been used."
      body="Scan the QR code on the big screen again to get a fresh one."
    />
  );
}
