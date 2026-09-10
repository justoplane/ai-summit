import { StatusScreen } from "./StatusScreen";

export function UsedScreen() {
  return (
    <StatusScreen
      glyph="↻"
      tone="amber"
      eyebrow="status: already submitted"
      title="This application was already submitted."
      body="Scan the code again to start a new one."
    />
  );
}
