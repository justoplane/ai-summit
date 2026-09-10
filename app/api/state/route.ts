import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Polled by the host page. */
export async function GET() {
  const state = await getStore().getHostState();
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
