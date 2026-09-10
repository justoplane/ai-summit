import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const Body = z.object({
  floorCodeId: z.string().min(1).optional(),
  follow: z.enum(["code", "all"]).optional(),
  shlayteMaxxing: z.boolean().optional(),
});

/** Operator settings shared by every display. Send only the keys you want to change. */
export async function PATCH(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad settings" }, { status: 400 });
  const { floorCodeId, follow, shlayteMaxxing } = parsed.data;
  const store = getStore();

  if (floorCodeId !== undefined) {
    const code = await store.getCode(floorCodeId);
    if (!code || code.archivedAt) return Response.json({ error: "Unknown code" }, { status: 404 });
    await store.setSetting("floor_code_id", floorCodeId);
  }
  if (follow !== undefined) await store.setSetting("floor_follow", follow);
  if (shlayteMaxxing !== undefined) await store.setSetting("shlayte_maxxing", shlayteMaxxing ? "1" : null);
  return Response.json({ ok: true });
}
