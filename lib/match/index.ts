import { env, hasOpenAI } from "@/lib/env";
import type { MatchVerdict, Member, Submission } from "@/lib/types";
import { mockMatch } from "./mock";
import { openaiMatch } from "./openai";

export type MatchInput = { submission: Submission; members: Member[] };
export type MatchOutput = { verdict: MatchVerdict; model: string };

/**
 * Decide which resident the submitter is most compatible with.
 * Uses OpenAI when an API key is configured, otherwise the deterministic mock.
 * Throws on OpenAI failure so the route can hand the token back to the phone for a retry.
 */
export async function matchSubmission({ submission, members }: MatchInput): Promise<MatchOutput> {
  if (!hasOpenAI) {
    const verdict = await mockMatch(submission, members);
    return { verdict, model: "mock" };
  }
  try {
    const verdict = await openaiMatch(submission, members);
    return { verdict, model: env.openaiModel };
  } catch (err) {
    console.error("[match]", err);
    throw err instanceof Error ? err : new Error(`OpenAI match failed: ${String(err)}`);
  }
}
