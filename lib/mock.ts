import type { HostState, MatchResult, MemberTally } from "@/lib/types";

/**
 * Sample data for building UI without a backend.
 * Import from client or server components alike.
 */

export const MOCK_HOST_STATE: HostState = {
  activeToken: "k7m2p9qa",
  pending: 1,
  latestResultId: "mock-1",
};

export const MOCK_RESULT: MatchResult = {
  id: "mock-1",
  token: "abc12345",
  createdAt: new Date(Date.now() - 90_000).toISOString(),
  model: "mock",
  submitter: {
    name: "Jordan",
    traits: ["Night owl", "Foodie", "Overthinker", "Dog person"],
    description:
      "I'm a software engineer who spends weekends trying new ramen spots and rewatching the same three shows.",
    photoUrl: "/placeholder-user.svg",
  },
  verdict: {
    memberId: "resident-3",
    score: 94,
    headline: "A pairing so aligned it broke our GPU cluster.",
    rationale:
      "Jordan brings night owl energy and a documented ramen obsession, and Resident Three has been waiting for exactly that. Our proprietary vibe-alignment tensor lit up across every dimension we track. Resident One put up a strong fight but ultimately lacked the necessary synergy.",
    runnerUpId: "resident-1",
    redFlag: "Both of you think you're the funny one.",
  },
};

const NAMES = ["Sam", "Priya", "Marcus", "Elena", "Theo", "Aisha", "Devin", "Noor"];
const MEMBER_IDS = ["resident-1", "resident-2", "resident-3", "resident-4", "resident-5", "resident-6"] as const;

export const MOCK_RESULTS: MatchResult[] = NAMES.map((name, i) => ({
  ...MOCK_RESULT,
  id: `mock-${i + 2}`,
  token: `tok${i}`,
  createdAt: new Date(Date.now() - (i + 2) * 7 * 60_000).toISOString(),
  submitter: { ...MOCK_RESULT.submitter, name },
  verdict: {
    ...MOCK_RESULT.verdict,
    memberId: MEMBER_IDS[i % 6],
    runnerUpId: MEMBER_IDS[(i + 1) % 6],
    score: 60 + ((i * 17) % 40),
  },
}));

export const MOCK_TALLY: MemberTally = {
  "resident-1": 4,
  "resident-2": 2,
  "resident-3": 7,
  "resident-4": 1,
  "resident-5": 3,
  "resident-6": 5,
};
