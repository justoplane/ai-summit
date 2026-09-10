import type { IntakeCode } from "@/lib/types";

/** Display name for an intake code; retired codes are marked so attribution stays honest. */
export function codeLabel(code: IntakeCode): string {
  return code.archivedAt ? `${code.name} · retired` : code.name;
}
