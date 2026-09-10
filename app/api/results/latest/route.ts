import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Fetched by the host page when latestResultId changes. */
export async function GET() {
  const result = await getStore().getLatestResult();
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
