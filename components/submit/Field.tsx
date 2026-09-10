import type { ReactNode } from "react";

type Props = {
  label: string;
  /** Binds the label to a single control. Omit for groups; they reference `labelId` via aria-labelledby. */
  htmlFor?: string;
  labelId?: string;
  /** Right-aligned mono text, e.g. a character counter. */
  meta?: ReactNode;
  /** Validation hint. Only pass it once the field has been touched. */
  hint?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, labelId, meta, hint, children }: Props) {
  const text = (
    <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/90">{label}</span>
  );
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        {htmlFor ? <label htmlFor={htmlFor}>{text}</label> : <span id={labelId}>{text}</span>}
        {meta && <span className="font-mono text-[11px] tabular-nums text-muted">{meta}</span>}
      </div>
      {children}
      {hint && <p className="text-sm text-amber">{hint}</p>}
    </div>
  );
}
