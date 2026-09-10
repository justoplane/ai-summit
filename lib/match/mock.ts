import type { MatchVerdict, Member, Submission } from "@/lib/types";

const HEADLINES = [
  "Statistically inevitable.",
  "Our models have never been this confident.",
  "A pairing so aligned it broke our GPU cluster.",
  "Synergy detected at the edge.",
  "The algorithm has spoken. Loudly.",
  "Compatibility score exceeded expected parameters.",
];

const RED_FLAGS = [
  "Both of you think you're the funny one.",
  "Neither of you will ever pick the restaurant.",
  "Disagreement over correct thermostat temperature is inevitable.",
  "One of you owns too many chargers. We won't say who.",
  "Shared enthusiasm for staying up too late.",
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic fake verdict so the UI can be built without an API key. */
export async function mockMatch(submission: Submission, members: Member[]): Promise<MatchVerdict> {
  await new Promise((r) => setTimeout(r, 1500));
  const h = hash(submission.name + submission.description + submission.traits.join(","));
  const winner = members[h % members.length];
  const runnerUp = members[(h + 1) % members.length];
  const score = 61 + (h % 38);
  const traits = submission.traits.length ? submission.traits.slice(0, 2).join(" and ").toLowerCase() : "an air of mystery";
  return {
    memberId: winner.id,
    score,
    headline: HEADLINES[h % HEADLINES.length],
    rationale: `${submission.name} brings ${traits} to the table, and ${winner.name} (${winner.companyTitle}) has been waiting for exactly that. Our proprietary vibe-alignment tensor lit up across every dimension we track. ${runnerUp.name} put up a strong fight but ultimately lacked the necessary synergy.`,
    runnerUpId: runnerUp.id,
    redFlag: RED_FLAGS[(h >> 3) % RED_FLAGS.length],
  };
}
