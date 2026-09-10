import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const Body = z.object({ name: z.literal("shlayteMaxxing"), on: z.boolean() });

/** Host-side operator toggles. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad flag" }, { status: 400 });
  await getStore().setFlag(parsed.data.name, parsed.data.on);
  return Response.json({ ok: true });
}
