import type { FloorFollow } from "@/lib/types";

export type SettingsPatch = {
  floorCodeId?: string;
  follow?: FloorFollow;
  shlayteMaxxing?: boolean;
};

/** Send only the keys being changed. Errors are logged, not thrown: the next poll shows the truth either way. */
export async function patchSettings(patch: SettingsPatch): Promise<void> {
  try {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) console.error("[settings]", res.status);
  } catch (err) {
    console.error("[settings]", err);
  }
}
