import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const Body = z.object({ name: z.string().trim().min(1).max(60) });

/** Rename. The slug (and any printed QR) is unaffected. */
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "A name is required" }, { status: 400 });
  await getStore().renameCode(id, parsed.data.name);
  return Response.json({ ok: true });
}

/** Archive. The link stops working; submissions stay attributed to the code. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  await getStore().archiveCode(id);
  return Response.json({ ok: true });
}
