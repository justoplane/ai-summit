import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const Body = z.object({ token: z.string().min(1) });

/**
 * Called by the phone page on load. Retires the QR for this token and mints the next one.
 * Response: { status: "claimed" | "processing" | "done" } or 404 when the token is unknown.
 */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Missing token" }, { status: 400 });

  const status = await getStore().claimToken(parsed.data.token);
  if (!status) return Response.json({ error: "Invalid or expired link" }, { status: 404 });
  return Response.json({ status });
}
