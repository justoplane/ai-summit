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
  /** One notable (ideally absurd) accomplishment. Shown on the reveal and the leaderboard. */
  achievement: string;
  /** Path under /public (e.g. "/members/resident-1.jpg") or an absolute URL. */
  photo: string;
  /** One paragraph about the person. */
  description: string;
  /** 16personalities type code, e.g. "INFP-T". Matching reference notes from doc/ are sent to the LLM. */
  personalityResults: string;
};

/**
 * A named, reusable intake QR code. The slug is what's in the URL (/s/<slug>) and never
 * changes; the name is for the operator and analytics. Archiving stops the link working
 * but keeps every submission attributed to it.
 */
export type IntakeCode = {
  id: string;
  slug: string;
  name: string;
  /** ISO */
  createdAt: string;
  /** ISO, or null while active. */
  archivedAt: string | null;
};

/** Per-code analytics. `scans` counts visits; `submissions` counts stored results. */
export type CodeStats = {
  code: IntakeCode;
  scans: number;
  submissions: number;
  byMember: MemberTally;
};

/**
 * One phone opening an intake link. Lifecycle: opened -> processing -> done.
 * This is the unique-entry record; a result points back at it.
 */
export type VisitStatus = "opened" | "processing" | "done";

export type Visit = {
  id: string;
  codeId: string;
  status: VisitStatus;
  /** ISO */
  createdAt: string;
};

/** What the phone posts to /api/submit. */
export type Submission = {
  visitId: string;
  name: string;
  description: string;
  /** The applicant's most impressive achievement, in their words. */
  achievement: string;
  /** Anything else for the committee. May be empty. */
  notes: string;
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
  /** ISO timestamp */
  createdAt: string;
  /** Model name used, or "mock". */
  model: string;
  /** Which intake code this came through. Null for rows that predate codes. */
  codeId: string | null;
  visitId: string | null;
  submitter: {
    name: string;
    description: string;
    achievement: string;
    notes: string;
    /** Legacy: rows from before the questionnaire changed carry trait chips instead. */
    traits?: string[];
    /** URL the browser can load: a data URL in dev, a Supabase Storage URL in prod. */
    photoUrl: string;
  };
  verdict: MatchVerdict;
};

/** Operator settings, stored server-side as strings so every display agrees. */
export type SettingKey = "floor_code_id" | "floor_follow" | "shlayte_maxxing";

/** Which submissions the floor reveal follows: only the displayed code, or every code. */
export type FloorFollow = "code" | "all";

/** Polled by the floor every couple of seconds. Keep it small. */
export type HostState = {
  /** The code whose QR is on the floor. Null when no active code exists. */
  floorCode: IntakeCode | null;
  follow: FloorFollow;
  /** Active codes, for the floor dropdown. */
  codes: IntakeCode[];
  /** Visits currently waiting on the LLM, within the followed scope. */
  pending: number;
  /** Newest result within the followed scope. */
  latestResultId: string | null;
  /** Hidden host toggle: force every match to resident-2. */
  shlayteMaxxing: boolean;
};

export type MemberTally = Record<MemberId, number>;

export type ResultPage = {
  results: MatchResult[];
  /** Pass back as `before` to get the next page. Null when there are no more. */
  nextCursor: string | null;
};

/** Filters shared by the ledger queries. `codeId` undefined means every code. */
export type ResultFilter = { codeId?: string };

/**
 * Storage interface. lib/store/memory.ts implements it for local dev;
 * lib/store/supabase.ts implements it for production.
 */
export type Store = {
  // Intake codes
  listCodes(opts?: { includeArchived?: boolean }): Promise<IntakeCode[]>;
  getCode(id: string): Promise<IntakeCode | null>;
  getCodeBySlug(slug: string): Promise<IntakeCode | null>;
  createCode(name: string): Promise<IntakeCode>;
  renameCode(id: string, name: string): Promise<void>;
  archiveCode(id: string): Promise<void>;
  /** Every code that is active or has at least one submission, newest first. */
  codeStats(): Promise<CodeStats[]>;

  // Visits
  createVisit(codeId: string): Promise<Visit>;
  getVisit(id: string): Promise<Visit | null>;
  setVisitStatus(id: string, status: VisitStatus): Promise<void>;
  /** Visits in "processing", optionally within one code. */
  countPending(filter?: ResultFilter): Promise<number>;

  // Results
  /** Persist a photo and return a URL the browser can load. */
  savePhoto(resultId: string, dataUrl: string): Promise<string>;
  saveResult(result: MatchResult): Promise<void>;
  getLatestResult(filter?: ResultFilter): Promise<MatchResult | null>;
  getResult(id: string): Promise<MatchResult | null>;
  /** Newest first. `before` is a createdAt ISO string from a previous page's nextCursor. */
  listResults(opts: { limit: number; before?: string } & ResultFilter): Promise<ResultPage>;
  countByMember(filter?: ResultFilter): Promise<MemberTally>;
  /** Remove a run and its photo. No-op for unknown ids. */
  deleteResult(id: string): Promise<void>;

  // Settings
  getSetting(key: SettingKey): Promise<string | null>;
  /** Null deletes the key. */
  setSetting(key: SettingKey, value: string | null): Promise<void>;
};
