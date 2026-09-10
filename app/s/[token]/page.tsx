import type { Metadata } from "next";
import { SubmitFlow } from "@/components/submit/SubmitFlow";

export const metadata: Metadata = {
  title: "Get matched",
  description: "Secure intake. Enterprise-grade compatibility inference in under a minute.",
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
