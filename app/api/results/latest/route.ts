import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Fetched by the floor when latestResultId changes. `?code=<id>` scopes to one intake code. */
export async function GET(request: Request) {
  const codeId = new URL(request.url).searchParams.get("code") ?? undefined;
  const result = await getStore().getLatestResult(codeId ? { codeId } : undefined);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
