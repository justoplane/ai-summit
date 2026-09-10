import type { MatchVerdict, Member, Submission } from "@/lib/types";

const HEADLINES = [
  "Applicant and resident reach agreement on thermostat.",
  "Committee approves placement; dissent not recorded.",
  "Placement finalized after brief review of dishwasher loading.",
  "Parties align on bedtime, remain divided on the couch.",
  "Match confirmed. Both sides describe terms as acceptable.",
  "Applicant cleared for the good chair, effective immediately.",
];

const RED_FLAGS = [
  "Both parties believe they are the funny one. The committee expects this to surface at the first dinner and again at every dinner after it.",
  "Neither party will pick the restaurant, and the committee expects this to reach mediation.",
  "The parties have not yet discussed the thermostat. The committee has set aside time in the second quarter.",
  "One party owns a material number of chargers. The committee declines to say which, but has seen the drawer.",
  "Both parties report staying up too late. The committee expects this to be framed as a shared interest until it is framed as a grievance.",
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
  const traits = submission.traits.length ? submission.traits.slice(0, 2).join(" and ").toLowerCase() : "no stated traits";
  return {
    memberId: winner.id,
    score,
    headline: HEADLINES[h % HEADLINES.length],
    rationale: `The committee reviewed ${submission.name}'s file, which lists ${traits}, and placed them with ${winner.name} (${winner.companyTitle}). The deciding factor was a projected Tuesday evening in which both parties reheat separate leftovers, eat them on the same couch, and say very little. The committee considers this a strong outcome. ${runnerUp.name} was also considered and remains in good standing.`,
    runnerUpId: runnerUp.id,
    redFlag: RED_FLAGS[(h >> 3) % RED_FLAGS.length],
  };
}
