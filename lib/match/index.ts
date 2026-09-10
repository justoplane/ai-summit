import { env, hasOpenAI } from "@/lib/env";
import type { MatchVerdict, Member, MemberId, Submission } from "@/lib/types";
import { mockMatch } from "./mock";
import { openaiMatch } from "./openai";

export type MatchInput = {
  submission: Submission;
  members: Member[];
  /** ShlayteMaxxing: the committee has pre-decided. The model still writes the rationale. */
  forceMemberId?: MemberId;
};
export type MatchOutput = { verdict: MatchVerdict; model: string };

/** Belt and braces: whatever the model said, the forced resident wins. */
function forceWinner(verdict: MatchVerdict, members: Member[], forceMemberId?: MemberId): MatchVerdict {
  if (!forceMemberId || verdict.memberId === forceMemberId) return verdict;
  const runnerUpId =
    verdict.runnerUpId === forceMemberId ? (members.find((m) => m.id !== forceMemberId)?.id ?? verdict.memberId) : verdict.runnerUpId;
  return { ...verdict, memberId: forceMemberId, runnerUpId };
}

/**
 * Decide which resident the submitter is most compatible with.
 * Uses OpenAI when an API key is configured, otherwise the deterministic mock.
 * Throws on OpenAI failure so the route can hand the token back to the phone for a retry.
 */
export async function matchSubmission({ submission, members, forceMemberId }: MatchInput): Promise<MatchOutput> {
  if (!hasOpenAI) {
    const verdict = forceWinner(await mockMatch(submission, members), members, forceMemberId);
    return { verdict, model: "mock" };
  }
  try {
    const verdict = forceWinner(await openaiMatch(submission, members, forceMemberId), members, forceMemberId);
    return { verdict, model: env.openaiModel };
  } catch (err) {
    console.error("[match]", err);
    throw err instanceof Error ? err : new Error(`OpenAI match failed: ${String(err)}`);
  }
}
