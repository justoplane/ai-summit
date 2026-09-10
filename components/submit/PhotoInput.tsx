"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { compressImage, UnsupportedImageError } from "./compressImage";
import { PhotoPreview } from "./PhotoPreview";
import { PhotoTile } from "./PhotoTile";

type Props = {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  /** Fires on the first interaction so the form can start showing validation hints. */
  onTouch?: () => void;
  labelledBy?: string;
};

type Status = { kind: "idle" } | { kind: "working" } | { kind: "error"; message: string };

export function PhotoInput({ value, onChange, onTouch, labelledBy }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const id = useId();

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
    onTouch?.();
    if (!file) return;

    setStatus({ kind: "working" });
    try {
      onChange(await compressImage(file));
      setStatus({ kind: "idle" });
    } catch (err) {
      const message =
        err instanceof UnsupportedImageError
          ? err.message
          : "That photo could not be processed. Try another one.";
      setStatus({ kind: "error", message });
    }
  }

  if (value) return <PhotoPreview src={value} onRetake={() => onChange(null)} />;

  const working = status.kind === "working";
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <PhotoTile
          id={`${id}-camera`}
          capture="user"
          icon="◉"
          label="Take a selfie"
          sub="front camera"
          disabled={working}
          onChange={handleFile}
        />
        <PhotoTile
          id={`${id}-library`}
          icon="▤"
          label="Choose a photo"
          sub="from your library"
          disabled={working}
          onChange={handleFile}
        />
      </div>
      {working && (
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <Spinner className="size-3.5" label="Attaching photo" />
          attaching…
        </p>
      )}
      {status.kind === "error" && <p className="text-sm text-amber">{status.message}</p>}
    </div>
  );
}
