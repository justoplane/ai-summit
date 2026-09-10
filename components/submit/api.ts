import type { Submission } from "@/lib/types";

export type VisitOutcome =
  | { kind: "open"; visitId: string; codeName: string }
  | { kind: "invalid" }
  | { kind: "offline" };

export type SubmitOutcome =
  | { kind: "done"; resultId: string }
  | { kind: "used"; message: string }
  | { kind: "error"; message: string };

const JSON_HEADERS = { "Content-Type": "application/json" };

/** POST /api/visit. Logs one scan against the intake code and returns the unique-entry record. */
export async function openVisit(slug: string): Promise<VisitOutcome> {
  let res: Response;
  try {
    res = await fetch("/api/visit", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ slug }),
    });
  } catch {
    return { kind: "offline" };
  }
  if (res.status === 404 || res.status === 400) return { kind: "invalid" };
  if (!res.ok) return { kind: "offline" };

  const body = (await res.json().catch(() => null)) as { visitId?: string; codeName?: string } | null;
  if (body?.visitId) return { kind: "open", visitId: body.visitId, codeName: body.codeName ?? "" };
  return { kind: "offline" };
}

/** POST /api/submit. On 500 the server resets the visit to opened, so the caller can retry. */
export async function submitEntry(submission: Submission): Promise<SubmitOutcome> {
  let res: Response;
  try {
    res = await fetch("/api/submit", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(submission),
    });
  } catch {
    return { kind: "error", message: "We could not reach the office. Check your connection and try again." };
  }

  const body = (await res.json().catch(() => null)) as { resultId?: string; error?: string } | null;
  if (res.ok && body?.resultId) return { kind: "done", resultId: body.resultId };
  if (res.status === 409) {
    return { kind: "used", message: body?.error ?? "This application was already submitted" };
  }
  return {
    kind: "error",
    message: body?.error ?? `The committee could not reach a decision (HTTP ${res.status}). Try again.`,
  };
}
