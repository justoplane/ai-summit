import { Button } from "@/components/ui/Button";
import { StatusScreen } from "./StatusScreen";

type Props = { onRetry: () => void };

export function OfflineScreen({ onRetry }: Props) {
  return (
    <StatusScreen
      glyph="⚡"
      tone="amber"
      eyebrow="status: unreachable"
      title="We could not reach the office."
      body="Check your connection and try again."
      action={
        <Button type="button" size="lg" className="w-full" onClick={onRetry}>
          Retry
        </Button>
      }
    />
  );
}
