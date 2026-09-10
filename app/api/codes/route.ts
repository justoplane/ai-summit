import { z } from "zod";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const Body = z.object({ name: z.string().trim().min(1).max(60) });

/** Active intake codes, newest first. */
export async function GET() {
  return Response.json(await getStore().listCodes());
}

/** Create a named intake code. Response: the IntakeCode. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "A name is required" }, { status: 400 });
  const code = await getStore().createCode(parsed.data.name);
  return Response.json(code, { status: 201 });
}
