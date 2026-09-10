/** Static copy for the host display. Keep the jokes here, not in JSX. */

export const HOST_COPY = {
  liveBadge: "Intake open",
  headline: { lead: "Scan to get", glow: "matched." },
  channelLabel: "Channel",
  pickerLabel: "Displaying",
  followLabel: "Reveal follows",
  followCode: "This code",
  followAll: "All codes",
  awaiting: "Awaiting the next submission",
  ledgerLink: "View the ledger",
  reconnecting: "Reconnecting",
  noCode: {
    badge: "Intake paused",
    headline: { lead: "No intake code", glow: "is active." },
    sub: "The floor has nothing to display until an intake code exists. Provisioning takes one click and zero approvals.",
    cta: "Create one in Settings",
  },
  metrics: [
    { label: "Headcount", value: "6" },
    { label: "Facilities", value: "1" },
    { label: "Open roles", value: "0" },
    { label: "Uptime", value: "100%" },
  ],
} as const;

export const MATCH_COPY = {
  badge: "Latest placement",
  subjectLabel: "Applicant",
  residentLabel: "Resident",
  scoreLabel: "Compatibility",
  achievement: "Track record",
  redFlag: "Risk factor",
  runnerUp: "Also considered",
  model: "Model",
  via: "Via",
  unattributed: "Unattributed",
  retiredCode: "Retired code",
} as const;

export const EMPTY_COPY = {
  badge: "Awaiting applicants",
  headline: { lead: "No matches on record.", glow: "The board has been notified." },
  sub: "Scanning the code constitutes a formal application. The committee reviews submissions in the order received and does not discuss its reasoning.",
  bars: [
    { label: "Reviewing prior-year comparables", value: "87.3412%", width: "87%" },
    { label: "Convening the committee", value: "61.0092%", width: "61%" },
    { label: "Awaiting sign-off from Legal", value: "99.9999%", width: "99%" },
  ],
} as const;
