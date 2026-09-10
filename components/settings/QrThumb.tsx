"use client";

import type { Ref } from "react";
import { QRCodeSVG } from "qrcode.react";

type Props = { url: string | null; name: string; ref?: Ref<HTMLDivElement> };

/** 96px QR on a white tile. `url` is null until the origin is known on the client. */
export function QrThumb({ url, name, ref }: Props) {
  return (
    <div
      ref={ref}
      className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-white p-4"
      aria-label={url ? `QR code for ${name}` : "QR code loading"}
      role="img"
    >
      {url ? (
        <QRCodeSVG value={url} size={96} level="M" bgColor="#ffffff" fgColor="#000000" />
      ) : (
        <div aria-hidden className="size-24 animate-pulse rounded-md bg-neutral-200" />
      )}
    </div>
  );
}
