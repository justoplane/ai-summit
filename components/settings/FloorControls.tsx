"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FloorFollow, IntakeCode } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { MicroLabel } from "@/components/history/MicroLabel";
import { patchSettings } from "@/components/settings/api";

type Props = { codes: IntakeCode[]; floorCodeId: string | null; follow: FloorFollow };

const FOLLOW_OPTIONS: { value: FloorFollow; label: string }[] = [
  { value: "code", label: "This code" },
  { value: "all", label: "All codes" },
];

export function FloorControls({ codes, floorCodeId, follow }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(body: { floorCodeId?: string; follow?: FloorFollow }) {
    setBusy(true);
    setError(null);
    try {
      await patchSettings(body);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settings were not saved");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="floor-code">
          <MicroLabel>On the floor</MicroLabel>
        </label>
        <select
          id="floor-code"
          value={floorCodeId ?? ""}
          disabled={busy || codes.length === 0}
          onChange={(e) => save({ floorCodeId: e.target.value })}
          className={cn(
            "h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground",
            "focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {codes.length === 0 && <option value="">No active codes</option>}
          {codes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted">The QR the big screen shows right now.</p>
      </div>

      <fieldset className="flex flex-col gap-2" disabled={busy}>
        <legend className="mb-2">
          <MicroLabel>Reveal follows</MicroLabel>
        </legend>
        <div
          role="group"
          className="grid h-12 grid-cols-2 rounded-xl border border-border bg-surface p-1"
        >
          {FOLLOW_OPTIONS.map((opt) => {
            const selected = follow === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                onClick={() => !selected && save({ follow: opt.value })}
                className={cn(
                  "rounded-lg text-sm font-semibold tracking-tight transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "bg-gradient-to-r from-cyan via-violet to-magenta text-white"
                    : "text-muted hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted">
          {follow === "code"
            ? "Only submissions through the floor code trigger the reveal."
            : "Any submission through any code triggers the reveal."}
        </p>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-magenta md:col-span-2">
          {error}
        </p>
      )}
    </Card>
  );
}
