import { Spinner } from "@/components/ui/Spinner";

export function ClaimingScreen() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pb-10 text-center">
      <Spinner className="size-10" label="Provisioning secure session" />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Provisioning secure session…
      </p>
    </section>
  );
}
