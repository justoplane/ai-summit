/** Static copy for the host display. Keep the jokes here, not in JSX. */

export const HOST_COPY = {
  liveBadge: "Live inference",
  headline: { lead: "Scan to get", glow: "matched." },
  tokenLabel: "Session token",
  awaiting: "Awaiting next subject",
  ledgerLink: "Results ledger",
  reconnecting: "Reconnecting",
  metrics: [
    { label: "Latency", value: "0.0031 ms" },
    { label: "Uptime", value: "99.99997%" },
    { label: "Vibe tensors", value: "4.2e6 / s" },
  ],
} as const;

export const MATCH_COPY = {
  badge: "Latest match",
  subjectLabel: "Subject",
  residentLabel: "Resident",
  scoreLabel: "Compatibility",
  achievement: "Achievement",
  redFlag: "Red flag",
  runnerUp: "Runner-up",
  model: "Model",
} as const;

export const EMPTY_COPY = {
  badge: "Standing by",
  headline: { lead: "No subjects analyzed yet.", glow: "Be the first data point." },
  sub: "Our compatibility engine is warm, idle, and extremely well funded. Scan the code to feed it a subject.",
  bars: [
    { label: "Calibrating vibe tensor", value: "87.3412%", width: "87%" },
    { label: "Warming GPU cluster", value: "61.0092%", width: "61%" },
    { label: "Reticulating splines", value: "99.9999%", width: "99%" },
  ],
} as const;
