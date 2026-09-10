import type { Submission } from "@/lib/types";

/** What the form holds before it becomes a Submission. Lives in SubmitFlow so it survives a failed submit. */
export type Draft = {
  name: string;
  description: string;
  achievement: string;
  notes: string;
  photoDataUrl: string | null;
};

export type DraftField = keyof Draft;

export const EMPTY_DRAFT: Draft = { name: "", description: "", achievement: "", notes: "", photoDataUrl: null };

/** Mirror the zod limits in app/api/submit/route.ts. */
export const NAME_MAX = 40;
export const DESCRIPTION_MAX = 600;
export const ACHIEVEMENT_MAX = 200;
export const NOTES_MAX = 600;

/** Required fields, for the "N of 4 outstanding" counter. Notes are optional. */
export const REQUIRED_FIELDS = 4;

/** Validation hints keyed by field. An empty object means the draft can be submitted. */
export function draftIssues(draft: Draft): Partial<Record<DraftField, string>> {
  const issues: Partial<Record<DraftField, string>> = {};
  if (!draft.name.trim()) issues.name = "A name is required for the record.";
  if (!draft.description.trim()) issues.description = "A sentence or two is required.";
  if (!draft.achievement.trim()) issues.achievement = "The committee requires one achievement. Any achievement.";
  if (!draft.photoDataUrl) issues.photoDataUrl = "A photo is required for the file.";
  return issues;
}

export function toSubmission(draft: Draft, visitId: string): Submission {
  return {
    visitId,
    name: draft.name.trim(),
    description: draft.description.trim(),
    achievement: draft.achievement.trim(),
    notes: draft.notes.trim(),
    photoDataUrl: draft.photoDataUrl ?? "",
  };
}
