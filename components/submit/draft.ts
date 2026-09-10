import { MIN_TRAITS } from "@/content/traits";
import type { Submission } from "@/lib/types";

/** What the form holds before it becomes a Submission. Lives in SubmitFlow so it survives a failed submit. */
export type Draft = {
  name: string;
  traits: string[];
  description: string;
  photoDataUrl: string | null;
};

export type DraftField = keyof Draft;

export const EMPTY_DRAFT: Draft = { name: "", traits: [], description: "", photoDataUrl: null };

/** Mirror the zod limits in app/api/submit/route.ts. */
export const NAME_MAX = 40;
export const DESCRIPTION_MAX = 600;

/** Validation hints keyed by field. An empty object means the draft can be submitted. */
export function draftIssues(draft: Draft): Partial<Record<DraftField, string>> {
  const issues: Partial<Record<DraftField, string>> = {};
  if (!draft.name.trim()) issues.name = "We need a name for the badge.";
  if (draft.traits.length < MIN_TRAITS) issues.traits = `Pick at least ${MIN_TRAITS} traits.`;
  if (!draft.description.trim()) issues.description = "A sentence or two. The model is waiting.";
  if (!draft.photoDataUrl) issues.photoDataUrl = "A photo is required for the biometric layer.";
  return issues;
}

export function toSubmission(draft: Draft, token: string): Submission {
  return {
    token,
    name: draft.name.trim(),
    traits: draft.traits,
    description: draft.description.trim(),
    photoDataUrl: draft.photoDataUrl ?? "",
  };
}
