import type { HostState, IntakeCode, MatchResult, MemberTally } from "@/lib/types";

/**
 * Sample data for building UI without a backend.
 * Import from client or server components alike.
 */

export const MOCK_CODES: IntakeCode[] = [
  { id: "code-floor", slug: "k7m2p9qa", name: "Floor display", createdAt: new Date(Date.now() - 86_400_000).toISOString(), archivedAt: null },
  { id: "code-insta", slug: "x3fd8hqe", name: "Instagram story", createdAt: new Date(Date.now() - 3_600_000).toISOString(), archivedAt: null },
];

export const MOCK_HOST_STATE: HostState = {
  floorCode: MOCK_CODES[0],
  follow: "code",
  codes: MOCK_CODES,
  pending: 1,
  latestResultId: "mock-1",
  shlayteMaxxing: false,
};

export const MOCK_RESULT: MatchResult = {
  id: "mock-1",
  codeId: "code-floor",
  visitId: "visit-1",
  createdAt: new Date(Date.now() - 90_000).toISOString(),
  model: "mock",
  submitter: {
    name: "Jordan",
    traits: ["Night owl", "Foodie", "Overthinker", "Dog person"],
    description:
      "Software engineer. Weekends are spent trying new ramen spots and rewatching the same three shows. Open to feedback on the shows.",
    photoUrl: "/placeholder-user.svg",
  },
  verdict: {
    memberId: "resident-3",
    score: 94,
    headline: "Placement finalized after brief review of dishwasher loading.",
    rationale:
      "The committee reviewed Jordan's file, which lists night owl and foodie, and placed them with Resident Three. The deciding factor was a projected Tuesday evening in which both parties reheat separate leftovers, eat them on the same couch, and say very little. The committee considers this a strong outcome. Resident One was also considered and remains in good standing.",
    runnerUpId: "resident-1",
    redFlag: "Both parties believe they are the funny one. The committee expects this to surface at the first dinner and again at every dinner after it.",
  },
};

const NAMES = ["Sam", "Priya", "Marcus", "Elena", "Theo", "Aisha", "Devin", "Noor"];
const MEMBER_IDS = ["resident-1", "resident-2", "resident-3", "resident-4", "resident-5", "resident-6"] as const;

export const MOCK_RESULTS: MatchResult[] = NAMES.map((name, i) => ({
  ...MOCK_RESULT,
  id: `mock-${i + 2}`,
  codeId: i % 3 === 0 ? "code-insta" : "code-floor",
  visitId: `visit-${i + 2}`,
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
