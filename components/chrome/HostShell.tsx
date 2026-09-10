import type { ReactNode } from "react";
import { Footer } from "@/components/chrome/Footer";
import { TopBar } from "@/components/chrome/TopBar";

type Props = { children: ReactNode; active: "live" | "history" | "residents" | "settings" };

/** Wraps the authed pages (host display, history) with the top bar and footer. */
export function HostShell({ children, active }: Props) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <TopBar active={active} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
