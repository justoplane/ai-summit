import type { Metadata } from "next";
import { SubmitFlow } from "@/components/submit/SubmitFlow";

export const metadata: Metadata = {
  title: "Apply to be matched",
  description: "Form DD-1. Applicant intake for Durf Dungeon LLC. Four fields, reviewed by the committee. Decisions are final.",
  robots: { index: false, follow: false },
};

// `PageProps<"/s/[token]">` only exists after a build regenerates .next/types; this shape is what it resolves to.
type Props = { params: Promise<{ token: string }> };

/**
 * Public phone flow. The token is claimed client-side on mount, never here:
 * link prefetchers and bots would otherwise burn tokens.
 */
export default async function SubmitPage({ params }: Props) {
  const { token } = await params;
  return <SubmitFlow token={token} />;
}
