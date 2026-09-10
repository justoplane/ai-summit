import type { Submission, TokenStatus } from "@/lib/types";

export type ClaimOutcome = "claimed" | "used" | "invalid" | "offline";

export type SubmitOutcome =
  | { kind: "done"; resultId: string }
  | { kind: "used" }
  | { kind: "error"; message: string };

const JSON_HEADERS = { "Content-Type": "application/json" };

/** POST /api/token/claim. Idempotent on the server, so a retry is always safe. */
export async function claimToken(token: string): Promise<ClaimOutcome> {
  let res: Response;
  try {
    res = await fetch("/api/token/claim", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ token }),
    });
  } catch {
    return "offline";
  }
  if (res.status === 404 || res.status === 400) return "invalid";
  if (!res.ok) return "offline";

  const body = (await res.json().catch(() => null)) as { status?: TokenStatus } | null;
  if (body?.status === "claimed") return "claimed";
  if (body?.status === "processing" || body?.status === "done") return "used";
  return "offline";
}

/** POST /api/submit. On 500 the server resets the token to claimed, so the caller can retry. */
export async function submitEntry(submission: Submission): Promise<SubmitOutcome> {
  let res: Response;
  try {
    res = await fetch("/api/submit", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(submission),
    });
  } catch {
    return { kind: "error", message: "Couldn't reach the server. Check your connection and try again." };
  }

  const body = (await res.json().catch(() => null)) as { resultId?: string; error?: string } | null;
  if (res.ok && body?.resultId) return { kind: "done", resultId: body.resultId };
  if (res.status === 409) return { kind: "used" };
  return {
    kind: "error",
    message: body?.error ?? `Something went wrong (HTTP ${res.status}). Try again.`,
  };
}
