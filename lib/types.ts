/**
 * Shared contract for the whole app. Every agent imports from here.
 * Add fields freely. Don't rename or remove without telling the orchestrator.
 */

export type MemberId =
  | "resident-1"
  | "resident-2"
  | "resident-3"
  | "resident-4"
  | "resident-5"
  | "resident-6";

/** One of the six Durf Dungeon residents. Content lives in content/members.ts. */
export type Member = {
  id: MemberId;
  name: string;
  companyTitle: string;
  /** Path under /public (e.g. "/members/resident-1.jpg") or an absolute URL. */
  photo: string;
  /** One notable (ideally absurd) accomplishment. Shown on the reveal and the leaderboard. */
  achievement: string;
  /** One paragraph about the person. */
  description: string;
  /** 16personalities type code, e.g. "INFP-T". Matching reference notes from doc/ are sent to the LLM. */
  personalityResults: string;
};

/**
 * Token lifecycle:
 *   active     -> shown as the QR on the host screen
 *   claimed    -> someone opened /s/<token>; a new active token was minted
 *   processing -> submission received, LLM call in flight
 *   done       -> result stored
 */
export type TokenStatus = "active" | "claimed" | "processing" | "done";

/** What the phone posts to /api/submit. */
export type Submission = {
  token: string;
  name: string;
  traits: string[];
  description: string;
  /** data:image/jpeg;base64,... — resized and compressed in the browser first. */
  photoDataUrl: string;
};

/** Structured answer from the LLM. */
export type MatchVerdict = {
  memberId: MemberId;
  /** 0-100 */
  score: number;
  /** Short, punchy, one line. */
  headline: string;
  /** Two to four sentences. */
  rationale: string;
  runnerUpId: MemberId;
  /** One playful concern about the pairing. */
  redFlag: string;
};

/** One run: a submission plus its verdict. Stored in the results table. */
export type MatchResult = {
  id: string;
  token: string;
  /** ISO timestamp */
  createdAt: string;
  /** Model name used, or "mock". */
  model: string;
  submitter: {
    name: string;
    traits: string[];
    description: string;
    /** URL the browser can load: a data URL in dev, a Supabase Storage URL in prod. */
    photoUrl: string;
  };
  verdict: MatchVerdict;
};

/** Polled by the host page every couple of seconds. Keep it tiny. */
export type HostState = {
  activeToken: string;
  /** Submissions currently waiting on the LLM. */
  pending: number;
  latestResultId: string | null;
};

export type MemberTally = Record<MemberId, number>;

export type ResultPage = {
  results: MatchResult[];
  /** Pass back as `before` to get the next page. Null when there are no more. */
  nextCursor: string | null;
};

/**
 * Storage interface. lib/store/memory.ts implements it for local dev;
 * lib/store/supabase.ts implements it for production.
 */
export type Store = {
  /** Current host state. Mints an active token if none exists. */
  getHostState(): Promise<HostState>;
  /**
   * Phone opened /s/<token>. If it's the active token, mark it claimed and mint a new one.
   * Returns the token's status after the call, or null if the token is unknown.
   */
  claimToken(token: string): Promise<TokenStatus | null>;
  getTokenStatus(token: string): Promise<TokenStatus | null>;
  setTokenStatus(token: string, status: TokenStatus): Promise<void>;
  /** Persist a photo and return a URL the browser can load. */
  savePhoto(resultId: string, dataUrl: string): Promise<string>;
  saveResult(result: MatchResult): Promise<void>;
  getLatestResult(): Promise<MatchResult | null>;
  getResult(id: string): Promise<MatchResult | null>;
  /** Newest first. `before` is a createdAt ISO string from a previous page's nextCursor. */
  listResults(opts: { limit: number; before?: string }): Promise<ResultPage>;
  countByMember(): Promise<MemberTally>;
};
