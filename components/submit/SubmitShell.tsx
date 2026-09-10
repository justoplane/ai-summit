import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type Props = { children: ReactNode };

/** Phone-width column with the compact wordmark header. Wraps every screen of the flow. */
export function SubmitShell({ children }: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-6 pt-5">
      <header className="flex items-center justify-between gap-3 pb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em]">
          Durf Dungeon <span className="text-muted">LLC</span>
        </p>
        <Badge tone="lime" live>
          Secure intake
        </Badge>
      </header>
      {children}
    </main>
  );
}
