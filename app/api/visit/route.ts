import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const Body = z.object({ slug: z.string().min(1) });

/**
 * Called by the phone page on load. Logs one visit against the intake code.
 * Response: { visitId, codeName } or 404 when the slug is unknown or archived.
 */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Missing slug" }, { status: 400 });

  const store = getStore();
  const code = await store.getCodeBySlug(parsed.data.slug);
  if (!code || code.archivedAt) return Response.json({ error: "This link has expired" }, { status: 404 });

  const visit = await store.createVisit(code.id);
  return Response.json({ visitId: visit.id, codeName: code.name });
}
