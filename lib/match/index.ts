import type { MatchVerdict, Member, Submission } from "@/lib/types";
import { mockMatch } from "./mock";

export type MatchInput = { submission: Submission; members: Member[] };
export type MatchOutput = { verdict: MatchVerdict; model: string };

/**
 * Decide which resident the submitter is most compatible with.
 * TODO(agent B): call OpenAI when `hasOpenAI` is true, otherwise fall back to mockMatch.
 */
export async function matchSubmission({ submission, members }: MatchInput): Promise<MatchOutput> {
  const verdict = await mockMatch(submission, members);
  return { verdict, model: "mock" };
}
