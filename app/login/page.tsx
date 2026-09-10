import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = { title: "Login" };
export const dynamic = "force-dynamic";

// PageProps<"/login"> only exists after the next build regenerates routes.d.ts.
type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (await isAuthed()) redirect("/");
  const { error } = await searchParams;

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-3xl animate-pulse-glow" />
        <div className="absolute left-1/2 top-2/3 size-80 -translate-x-1/4 rounded-full bg-cyan/15 blur-3xl" />
      </div>

      <Card featured className="w-full max-w-md animate-rise p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-foreground">
            Durf Dungeon LLC
          </span>
          <Badge live tone="cyan">
            Investor Portal
          </Badge>
        </div>

        <h1 className="mt-8 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Access the <GlowText>compatibility layer.</GlowText>
        </h1>
        <p className="mt-4 text-muted">
          Restricted to accredited investors, board members, and residents.
        </p>

        <form method="post" action="/api/login" className="mt-8 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
            >
              <span>Access credential</span>
              <span className="text-cyan/80">TLS 1.3 · vibes encrypted</span>
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-magenta"
            >
              Credentials rejected by the compliance layer.
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            Authenticate
          </Button>
        </form>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
          SOC 2 Type II (pending) · Patent pending · Series A pending
        </p>
      </Card>
    </main>
  );
}
