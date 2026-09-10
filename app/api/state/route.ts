import { getHostState } from "@/lib/hostState";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Polled by the floor. */
export async function GET() {
  const state = await getHostState(getStore());
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
