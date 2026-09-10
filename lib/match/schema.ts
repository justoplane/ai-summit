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
  headline: z.string().describe("At most 12 words. A fake tabloid or trade-press headline about this specific pairing. Specific, not buzzwordy."),
  rationale: z
    .string()
    .describe(
      "2 to 4 sentences, deadpan. At least two specifics from the guest and two from the chosen resident, plus one invented concrete scene stated as fact. First names only.",
    ),
  runnerUpId: z
    .enum(MEMBER_IDS)
    .describe("The id of the second most compatible resident. Must be different from memberId."),
  redFlag: z.string().describe("One sentence: a specific, escalating consequence of the pairing. Harmless, never cruel."),
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
