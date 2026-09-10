import { z } from "zod";
import { MEMBER_IDS } from "@/content/members";
import type { MatchVerdict, Member } from "@/lib/types";

export const SCORE_MIN = 55;
export const SCORE_MAX = 99;

/**
 * What the model fills in. Deliberately free of min/max/length constraints:
 * OpenAI strict structured outputs reject many JSON Schema validation keywords.
 * normalizeVerdict() enforces those rules in code afterwards.
 */
export const VerdictSchema = z.object({
  memberId: z.enum(MEMBER_IDS).describe("The id of the single most compatible resident."),
  score: z
    .number()
    .describe(`Compatibility score as an integer from ${SCORE_MIN} to ${SCORE_MAX}. It's a party; nobody scores low.`),
  headline: z.string().describe("At most 12 words. Punchy startup-launch speak announcing the match."),
  rationale: z
    .string()
    .describe(
      "2 to 4 sentences. Reference at least two specific things from the guest's traits or description and at least one thing from the chosen resident's profile. Name the resident with their company title exactly once.",
    ),
  runnerUpId: z
    .enum(MEMBER_IDS)
    .describe("The id of the second most compatible resident. Must be different from memberId."),
  redFlag: z.string().describe("One playful, harmless sentence about a minor concern with the pairing."),
});

export type RawVerdict = z.infer<typeof VerdictSchema>;

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 77;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, Math.round(score)));
}

/** Enforce what the schema can't: integer score in range, distinct runner-up. */
export function normalizeVerdict(raw: RawVerdict, members: Member[]): MatchVerdict {
  let runnerUpId = raw.runnerUpId;
  if (runnerUpId === raw.memberId && members.length > 1) {
    const winnerIndex = Math.max(0, members.findIndex((m) => m.id === raw.memberId));
    runnerUpId = members[(winnerIndex + 1) % members.length].id;
  }
  return {
    memberId: raw.memberId,
    score: clampScore(raw.score),
    headline: raw.headline.trim(),
    rationale: raw.rationale.trim(),
    runnerUpId,
    redFlag: raw.redFlag.trim(),
  };
}
