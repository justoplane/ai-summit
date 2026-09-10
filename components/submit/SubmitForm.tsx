"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { GlowText } from "@/components/ui/GlowText";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DESCRIPTION_MAX, NAME_MAX, draftIssues, type Draft, type DraftField } from "./draft";
import { Field } from "./Field";
import { PhotoInput } from "./PhotoInput";
import { TraitPicker } from "./TraitPicker";
import { ErrorScreen } from "./screens/ErrorScreen";

type Props = {
  draft: Draft;
  onChange: (draft: Draft) => void;
  onSubmit: () => void;
  /** Message from a failed submit. Shown inline; the draft is preserved. */
  error?: string;
  /** Operator name of the intake code this phone scanned, e.g. "Instagram story". */
  codeName?: string;
};

export function SubmitForm({ draft, onChange, onSubmit, error, codeName }: Props) {
  const [touched, setTouched] = useState<Partial<Record<DraftField, true>>>({});
  const issues = draftIssues(draft);
  const pending = Object.keys(issues).length;
  const valid = pending === 0;

  const touch = (field: DraftField) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  const patch = (p: Partial<Draft>) => onChange({ ...draft, ...p });
  const hint = (field: DraftField) => (touched[field] ? issues[field] : undefined);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (valid) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
      <div className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Form DD-1 · Rev. 3{codeName && <span className="text-muted/70"> · via {codeName}</span>}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Apply to be <GlowText>matched</GlowText>.
        </h1>
        <p className="mt-2 text-sm text-muted">Four fields. Reviewed by the committee. Decisions are final.</p>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorScreen message={error} onRetry={onSubmit} />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-8">
        <Field label="Name" htmlFor="name" hint={hint("name")}>
          <Input
            id="name"
            name="name"
            required
            maxLength={NAME_MAX}
            autoComplete="given-name"
            enterKeyHint="next"
            placeholder="As it should appear in the minutes."
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
            onBlur={() => touch("name")}
            aria-invalid={Boolean(hint("name"))}
          />
        </Field>

        <Field label="Traits" labelId="traits-label" hint={hint("traits")}>
          <TraitPicker
            value={draft.traits}
            labelledBy="traits-label"
            onChange={(traits) => {
              touch("traits");
              patch({ traits });
            }}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          meta={`${draft.description.length} / ${DESCRIPTION_MAX}`}
          hint={hint("description")}
        >
          <Textarea
            id="description"
            name="description"
            required
            maxLength={DESCRIPTION_MAX}
            placeholder="Two or three sentences. Interests, habits, a position you'd defend in a meeting."
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
            onBlur={() => touch("description")}
            aria-invalid={Boolean(hint("description"))}
          />
        </Field>

        <Field label="Photo" labelId="photo-label" hint={hint("photoDataUrl")}>
          <PhotoInput
            value={draft.photoDataUrl}
            labelledBy="photo-label"
            onTouch={() => touch("photoDataUrl")}
            onChange={(photoDataUrl) => patch({ photoDataUrl })}
          />
        </Field>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-8 bg-gradient-to-t from-background via-background/95 to-transparent px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10">
        <Button type="submit" size="lg" className="w-full" disabled={!valid}>
          Submit for review
        </Button>
        <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70">
          {valid ? "Ready for review" : `${pending} of 4 fields outstanding`}
        </p>
      </div>
    </form>
  );
}
