import { cn } from "@/lib/cn";

type Props = { className?: string; label?: string };

export function Spinner({ className, label = "Loading" }: Props) {
  return (
    <span role="status" aria-label={label} className={cn("inline-block size-5", className)}>
      <span className="block size-full animate-spin rounded-full border-2 border-border border-t-cyan" />
    </span>
  );
}
