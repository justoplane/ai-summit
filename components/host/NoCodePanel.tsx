import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";
import { HOST_COPY } from "./copy";

/** Shown in place of the QR when no active intake code exists. */
export function NoCodePanel() {
  const copy = HOST_COPY.noCode;
  return (
    <Card featured className="flex flex-col items-center gap-6 p-8 text-center">
      <Badge tone="amber" live>
        {copy.badge}
      </Badge>
      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        {copy.headline.lead} <GlowText>{copy.headline.glow}</GlowText>
      </h1>
      <p className="max-w-[40ch] text-lg text-muted">{copy.sub}</p>
      <Link
        href="/settings"
        className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-cyan via-violet to-magenta px-5 text-sm font-semibold tracking-tight text-white shadow-[0_0_30px_-8px_var(--violet)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
      >
        {copy.cta} &rarr;
      </Link>
    </Card>
  );
}
