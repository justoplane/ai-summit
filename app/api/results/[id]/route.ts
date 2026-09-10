import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Trash-can button on the ledger. Removes the run and its photo. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await getStore().deleteResult(id);
  return Response.json({ ok: true });
}
