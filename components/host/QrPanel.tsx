"use client";

import { useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { HostState } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlowText } from "@/components/ui/GlowText";
import { Spinner } from "@/components/ui/Spinner";
import { HOST_COPY } from "./copy";

type Props = { state: HostState };

const QR_SIZE = 400;

// Black and white are the QR's own palette, not theme colors: the wordmark must stay scannable.
const WORDMARK = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="black"/><text x="32" y="42" text-anchor="middle" font-family="ui-monospace,monospace" font-size="26" font-weight="700" fill="white">DD</text></svg>',
)}`;

const subscribeNever = () => () => {};

/** window.location.origin, or null during SSR and hydration so the markup matches. */
function useOrigin(): string | null {
  return useSyncExternalStore(
    subscribeNever,
    () => window.location.origin,
    () => null,
  );
}

export function QrPanel({ state }: Props) {
  const origin = useOrigin();
  const url = origin ? `${origin}/s/${state.activeToken}` : null;

  return (
    <Card featured className="flex flex-col items-center gap-6 p-8 text-center">
      <Badge tone="lime" live>
        {HOST_COPY.liveBadge}
      </Badge>

      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        {HOST_COPY.headline.lead} <GlowText>{HOST_COPY.headline.glow}</GlowText>
      </h1>

      <div key={state.activeToken} className="glow w-full max-w-[448px] animate-rise rounded-3xl bg-white p-6">
        <div className="aspect-square w-full">
          {url ? (
            <QRCodeSVG
              value={url}
              size={QR_SIZE}
              level="M"
              marginSize={1}
              title={`Scan to open ${url}`}
              imageSettings={{ src: WORDMARK, width: 56, height: 56, excavate: true }}
              className="size-full"
            />
          ) : (
            <div aria-hidden className="size-full animate-pulse rounded-xl bg-black/5" />
          )}
        </div>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {HOST_COPY.tokenLabel} &middot; <span className="text-foreground/80">{state.activeToken}</span>
      </p>

      <p className="flex min-h-8 items-center justify-center gap-3 text-xl">
        {state.pending > 0 ? (
          <>
            <Spinner label="Inference in progress" />
            <span className="text-cyan">
              {state.pending} inference{state.pending === 1 ? "" : "s"} in flight
            </span>
          </>
        ) : (
          <span className="text-muted">{HOST_COPY.awaiting}</span>
        )}
      </p>

      <dl className="flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/80">
        {HOST_COPY.metrics.map((m) => (
          <div key={m.label} className="flex gap-2">
            <dt>{m.label}</dt>
            <dd className="text-cyan/80">{m.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
