"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = { id: string; name: string };

/** Sits inside a <summary>, so clicks must not toggle the row. */
export function DeleteRunButton({ id, name }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete ${name}'s run from the ledger? This can't be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (err) {
      console.error("[delete-run]", err);
      window.alert("Delete failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={`Delete ${name}'s run`}
      title="Delete run"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition",
        "hover:border-magenta/60 hover:text-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta/60",
        "disabled:cursor-wait disabled:opacity-50",
      )}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6h12M8 6V4h4v2M6 6l.8 10h6.4L14 6M8.5 9v4.5M11.5 9v4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
