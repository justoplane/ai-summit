"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { openVisit, submitEntry } from "./api";
import { EMPTY_DRAFT, toSubmission, type Draft } from "./draft";
import { SubmitForm } from "./SubmitForm";
import { SubmitShell } from "./SubmitShell";
import { ClaimingScreen } from "./screens/ClaimingScreen";
import { DoneScreen } from "./screens/DoneScreen";
import { InvalidScreen } from "./screens/InvalidScreen";
import { OfflineScreen } from "./screens/OfflineScreen";
import { ProcessingScreen } from "./screens/ProcessingScreen";
import { UsedScreen } from "./screens/UsedScreen";

type Visit = { visitId: string; codeName: string };

type Phase =
  | { kind: "claiming" }
  | { kind: "form"; visit: Visit; error?: string }
  | { kind: "submitting"; visit: Visit }
  | { kind: "done"; resultId: string }
  | { kind: "used" }
  | { kind: "invalid" }
  | { kind: "offline" };

type Props = { slug: string };

export function SubmitFlow({ slug }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "claiming" });
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const openStarted = useRef(false);

  const open = useCallback(async () => {
    const outcome = await openVisit(slug);
    if (outcome.kind === "open") {
      setPhase({ kind: "form", visit: { visitId: outcome.visitId, codeName: outcome.codeName } });
    } else {
      setPhase({ kind: outcome.kind });
    }
  }, [slug]);

  // Open exactly once per mount; the ref survives React's dev-mode effect replay.
  useEffect(() => {
    if (openStarted.current) return;
    openStarted.current = true;
    void open();
  }, [open]);

  function retryOpen() {
    setPhase({ kind: "claiming" });
    void open();
  }

  async function submit(visit: Visit) {
    setPhase({ kind: "submitting", visit });
    const outcome = await submitEntry(toSubmission(draft, visit.visitId));
    if (outcome.kind === "done") setPhase({ kind: "done", resultId: outcome.resultId });
    // The server says "expired" for an unknown visit and "already submitted" for a reused one.
    else if (outcome.kind === "used") setPhase({ kind: /expired/i.test(outcome.message) ? "invalid" : "used" });
    else setPhase({ kind: "form", visit, error: outcome.message });
  }

  return (
    <SubmitShell>
      {phase.kind === "claiming" && <ClaimingScreen />}
      {phase.kind === "form" && (
        <SubmitForm
          draft={draft}
          onChange={setDraft}
          onSubmit={() => submit(phase.visit)}
          error={phase.error}
          codeName={phase.visit.codeName}
        />
      )}
      {phase.kind === "submitting" && <ProcessingScreen />}
      {phase.kind === "done" && <DoneScreen />}
      {phase.kind === "used" && <UsedScreen />}
      {phase.kind === "invalid" && <InvalidScreen />}
      {phase.kind === "offline" && <OfflineScreen onRetry={retryOpen} />}
    </SubmitShell>
  );
}
