"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claimToken, submitEntry } from "./api";
import { EMPTY_DRAFT, toSubmission, type Draft } from "./draft";
import { SubmitForm } from "./SubmitForm";
import { SubmitShell } from "./SubmitShell";
import { ClaimingScreen } from "./screens/ClaimingScreen";
import { DoneScreen } from "./screens/DoneScreen";
import { InvalidScreen } from "./screens/InvalidScreen";
import { OfflineScreen } from "./screens/OfflineScreen";
import { ProcessingScreen } from "./screens/ProcessingScreen";
import { UsedScreen } from "./screens/UsedScreen";

type Phase =
  | { kind: "claiming" }
  | { kind: "form"; error?: string }
  | { kind: "submitting" }
  | { kind: "done"; resultId: string }
  | { kind: "used" }
  | { kind: "invalid" }
  | { kind: "offline" };

type Props = { token: string };

export function SubmitFlow({ token }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "claiming" });
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const claimStarted = useRef(false);

  const claim = useCallback(async () => {
    const outcome = await claimToken(token);
    setPhase(outcome === "claimed" ? { kind: "form" } : { kind: outcome });
  }, [token]);

  // Claim exactly once per mount; the ref survives React's dev-mode effect replay.
  useEffect(() => {
    if (claimStarted.current) return;
    claimStarted.current = true;
    void claim();
  }, [claim]);

  function retryClaim() {
    setPhase({ kind: "claiming" });
    void claim();
  }

  async function submit() {
    setPhase({ kind: "submitting" });
    const outcome = await submitEntry(toSubmission(draft, token));
    if (outcome.kind === "done") setPhase({ kind: "done", resultId: outcome.resultId });
    else if (outcome.kind === "used") setPhase({ kind: "used" });
    else setPhase({ kind: "form", error: outcome.message });
  }

  return (
    <SubmitShell>
      {phase.kind === "claiming" && <ClaimingScreen />}
      {phase.kind === "form" && (
        <SubmitForm draft={draft} onChange={setDraft} onSubmit={submit} error={phase.error} />
      )}
      {phase.kind === "submitting" && <ProcessingScreen />}
      {phase.kind === "done" && <DoneScreen />}
      {phase.kind === "used" && <UsedScreen />}
      {phase.kind === "invalid" && <InvalidScreen />}
      {phase.kind === "offline" && <OfflineScreen onRetry={retryClaim} />}
    </SubmitShell>
  );
}
