import { StatusScreen } from "./StatusScreen";

export function InvalidScreen() {
  return (
    <StatusScreen
      glyph="✕"
      tone="magenta"
      eyebrow="status: expired"
      title="This link has expired."
      body="Ask the officers for a current link."
    />
  );
}
