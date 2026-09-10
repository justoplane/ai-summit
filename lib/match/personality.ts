import { readFileSync } from "node:fs";
import path from "node:path";
import type { Member } from "@/lib/types";

/**
 * Background context for the 16personalities type codes the residents entered.
 * Source of truth is doc/personality_quiz_context.md; only the sections for types
 * that actually appear among the residents are sent to the model, to keep the
 * reference material from crowding out the hand-written profiles.
 */

const DOC_PATH = path.join(process.cwd(), "doc", "personality_quiz_context.md");
const TYPE_RE = /\b([IE][NS][TF][JP])(?:-([AT]))?\b/i;

let cachedDoc: string | null | undefined;

function loadDoc(): string | null {
  if (cachedDoc !== undefined) return cachedDoc;
  try {
    cachedDoc = readFileSync(DOC_PATH, "utf8");
  } catch (err) {
    console.warn("[match] personality reference doc not found; continuing without it", err);
    cachedDoc = null;
  }
  return cachedDoc;
}

/** "INFP-T" -> { code: "INFP", suffix: "T" }; null if no type code is present. */
export function parseTypeCode(text: string): { code: string; suffix: "A" | "T" | null } | null {
  const m = TYPE_RE.exec(text);
  if (!m) return null;
  const suffix = m[2] ? (m[2].toUpperCase() as "A" | "T") : null;
  return { code: m[1].toUpperCase(), suffix };
}

/** The `#### CODE — "Name"` section for one type, without the trailing rule. */
export function sectionFor(doc: string, code: string): string | null {
  const lines = doc.split("\n");
  const start = lines.findIndex((l) => l.startsWith(`#### ${code} `));
  if (start === -1) return null;
  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#")) break;
    if (line.trim() === "---") continue;
    body.push(line);
  }
  return [lines[start].replace(/^####\s*/, ""), ...body].join("\n").trim();
}

/** Reference text for the types present among `members`, or "" when none are found. */
export function personalityContextFor(members: Member[]): string {
  const doc = loadDoc();
  if (!doc) return "";
  const codes = new Set<string>();
  let anySuffix = false;
  for (const m of members) {
    const parsed = parseTypeCode(m.personalityResults);
    if (!parsed) continue;
    codes.add(parsed.code);
    if (parsed.suffix) anySuffix = true;
  }
  const sections = [...codes].map((c) => sectionFor(doc, c)).filter((s): s is string => Boolean(s));
  if (sections.length === 0) return "";
  const suffixNote = anySuffix
    ? "Suffix: -A (Assertive) is calmer and self-assured; -T (Turbulent) is more self-critical, perfectionistic, and stress-sensitive.\n\n"
    : "";
  return suffixNote + sections.join("\n\n");
}
