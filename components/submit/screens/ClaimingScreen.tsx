import { Spinner } from "@/components/ui/Spinner";

export function ClaimingScreen() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pb-10 text-center">
      <Spinner className="size-10" label="Opening your file" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Opening your file…
      </p>
    </section>
  );
}
