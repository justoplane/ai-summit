import type { Metadata } from "next";
import { SubmitFlow } from "@/components/submit/SubmitFlow";

export const metadata: Metadata = {
  title: "Apply to be matched",
  description: "Form DD-1. Applicant intake for Durf Dungeon LLC. Four fields, reviewed by the committee. Decisions are final.",
  robots: { index: false, follow: false },
};

// `PageProps<"/s/[slug]">` only exists after a build regenerates .next/types; this shape is what it resolves to.
type Props = { params: Promise<{ slug: string }> };

/**
 * Public phone flow. The visit is opened client-side on mount, never here:
 * link prefetchers and bots would otherwise inflate the scan count.
 */
export default async function SubmitPage({ params }: Props) {
  const { slug } = await params;
  return <SubmitFlow slug={slug} />;
}
