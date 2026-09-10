import { Button } from "@/components/ui/Button";

type Props = { message: string; onRetry: () => void };

/** Inline error panel shown above the form after a failed submit. The draft is kept. */
export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-magenta/40 bg-surface p-4 animate-rise"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-magenta">inference failed</p>
      <p className="text-sm">{message}</p>
      <Button type="button" variant="outline" className="w-full" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
