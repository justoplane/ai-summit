import type { FloorFollow } from "@/lib/types";

/** Thin fetch wrappers for the settings page. Each throws on a non-2xx response. */

async function check(res: Response, fallback: string): Promise<void> {
  if (res.ok) return;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? fallback);
}

export async function patchSettings(body: { floorCodeId?: string; follow?: FloorFollow }) {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  await check(res, "Settings were not saved");
}

export async function createCode(name: string) {
  const res = await fetch("/api/codes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  await check(res, "The code was not created");
}

export async function renameCode(id: string, name: string) {
  const res = await fetch(`/api/codes/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  await check(res, "The code was not renamed");
}

export async function archiveCode(id: string) {
  const res = await fetch(`/api/codes/${id}`, { method: "DELETE" });
  await check(res, "The code was not archived");
}

export function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "code";
}
