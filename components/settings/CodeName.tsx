"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { renameCode } from "@/components/settings/api";

type Props = { id: string; name: string };

/** Click the name to rename in place. Enter or blur saves; Escape cancels. */
export function CodeName({ id, name }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Enter unmounts the input, which also fires blur; only the first call should save.
  const committed = useRef(false);

  function start() {
    committed.current = false;
    setDraft(name);
    setError(null);
    setEditing(true);
  }

  async function save() {
    if (committed.current) return;
    committed.current = true;
    const next = draft.trim();
    setEditing(false);
    if (!next || next === name) return;
    setBusy(true);
    try {
      await renameCode(id, next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The code was not renamed");
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <input
        autoFocus
        aria-label="Code name"
        value={draft}
        maxLength={60}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            committed.current = true;
            setEditing(false);
          }
        }}
        className={cn(
          "h-10 w-full max-w-sm rounded-lg border border-cyan/60 bg-surface px-3 font-display text-xl font-bold tracking-tight text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-cyan/30",
        )}
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        title="Rename"
        className={cn(
          "group/name inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg text-left font-display text-xl font-bold tracking-tight",
          "hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
          "disabled:opacity-50",
        )}
      >
        <span className="truncate">{busy ? draft : name}</span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="size-4 shrink-0 text-muted opacity-60 transition group-hover/name:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">Rename code</span>
      </button>
      {error && (
        <p role="alert" className="text-sm text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
