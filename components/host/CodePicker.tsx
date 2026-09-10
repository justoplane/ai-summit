"use client";

import { useState } from "react";
import type { FloorFollow, HostState } from "@/lib/types";
import { HOST_COPY } from "./copy";
import { FollowToggle } from "./FollowToggle";
import { patchSettings } from "./settings";

type Props = {
  state: Pick<HostState, "codes" | "floorCode" | "follow">;
  /** Poll immediately so the floor reflects the change without waiting out the interval. */
  refresh: () => void;
};

/** Operator controls above the QR: which code is displayed, and whether the reveal follows only it. */
export function CodePicker({ state, refresh }: Props) {
  const [busy, setBusy] = useState(false);
  // Optimistic values while a change is in flight; otherwise follow the polled server value.
  const [localCode, setLocalCode] = useState<string | null>(null);
  const [localFollow, setLocalFollow] = useState<FloorFollow | null>(null);
  const codeId = localCode ?? state.floorCode?.id ?? "";
  const follow = localFollow ?? state.follow;

  async function changeCode(floorCodeId: string) {
    setBusy(true);
    setLocalCode(floorCodeId);
    await patchSettings({ floorCodeId });
    refresh();
    setBusy(false);
    setLocalCode(null);
  }

  async function changeFollow(next: FloorFollow) {
    setBusy(true);
    setLocalFollow(next);
    await patchSettings({ follow: next });
    refresh();
    setBusy(false);
    setLocalFollow(null);
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <label className="glass flex min-w-0 items-center gap-2 rounded-full pl-4 pr-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        <span className="shrink-0">{HOST_COPY.pickerLabel}</span>
        <select
          value={codeId}
          disabled={busy}
          onChange={(e) => changeCode(e.target.value)}
          className="min-w-0 max-w-[16rem] cursor-pointer truncate rounded-full bg-transparent py-1.5 pr-1 font-mono text-xs normal-case tracking-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.codes.map((code) => (
            <option key={code.id} value={code.id} className="bg-surface text-foreground">
              {code.name}
            </option>
          ))}
        </select>
      </label>
      <FollowToggle value={follow} disabled={busy} onChange={changeFollow} />
    </div>
  );
}
