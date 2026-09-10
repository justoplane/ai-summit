"use client";

import { useEffect, useState, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { downloadQrPng } from "@/components/settings/qrPng";
import { slugifyName } from "@/components/settings/api";

type Props = {
  url: string | null;
  slug: string;
  name: string;
  /** Wrapper around the on-screen QR; its <svg> is what gets rasterized. */
  qrRef: RefObject<HTMLDivElement | null>;
};

export function CodeLink({ url, slug, name, qrRef }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError("Clipboard declined. Select the link and copy it by hand.");
    }
  }

  async function download() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    setError(null);
    try {
      await downloadQrPng(svg, `durf-${slugifyName(name)}.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The PNG could not be produced");
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <code className="block truncate font-mono text-sm text-muted" title={url ?? undefined}>
        {url ?? `/s/${slug}`}
      </code>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copy} disabled={!url} aria-live="polite">
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!url}>
          Download PNG
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
