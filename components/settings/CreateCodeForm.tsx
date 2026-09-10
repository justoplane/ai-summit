"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MicroLabel } from "@/components/history/MicroLabel";
import { createCode } from "@/components/settings/api";

export function CreateCodeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmed = name.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createCode(trimmed);
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The code was not created");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="new-code-name">
        <MicroLabel>New channel</MicroLabel>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="new-code-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="e.g. Kitchen fridge, Instagram story, Bathroom mirror"
          autoComplete="off"
          disabled={busy}
        />
        <Button type="submit" disabled={!trimmed || busy} className="h-12 shrink-0">
          {busy ? "Creating" : "Create code"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-magenta">
          {error}
        </p>
      )}
    </form>
  );
}
