"use client";

import { useRouter } from "next/navigation";
import type { IntakeCode } from "@/lib/types";
import { cn } from "@/lib/cn";
import { MicroLabel } from "@/components/history/MicroLabel";
import { codeLabel } from "@/components/history/codeLabel";

type Props = {
  codes: IntakeCode[];
  /** Selected intake code id, or undefined for every code. */
  selectedCodeId?: string;
};

export function CodeFilter({ codes, selectedCodeId }: Props) {
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    router.push(id ? `/history?code=${encodeURIComponent(id)}` : "/history");
  }

  return (
    <label className="flex flex-col gap-1.5">
      <MicroLabel>Source</MicroLabel>
      <span className="relative">
        <select
          value={selectedCodeId ?? ""}
          onChange={onChange}
          className={cn(
            "glass h-10 w-full min-w-44 appearance-none rounded-full border border-border pl-4 pr-10 text-sm text-foreground",
            "focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/30",
          )}
        >
          <option value="">All codes</option>
          {codes.map((code) => (
            <option key={code.id} value={code.id}>
              {codeLabel(code)}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        >
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </label>
  );
}
