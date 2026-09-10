import type { Supabase } from "@/lib/supabase";

const BUCKET = "photos";

const EXTENSIONS: Record<string, string | undefined> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Splits `data:<mime>;base64,<data>` into its MIME type and decoded bytes. */
function parseDataUrl(dataUrl: string): { mime: string; bytes: Buffer } {
  const comma = dataUrl.indexOf(",");
  const header = comma === -1 ? "" : dataUrl.slice(0, comma);
  if (!header.startsWith("data:") || !header.endsWith(";base64")) {
    throw new Error("[store:supabase] savePhoto expected a base64 data URL");
  }
  const mime = header.slice("data:".length, -";base64".length);
  return { mime, bytes: Buffer.from(dataUrl.slice(comma + 1), "base64") };
}

/** Uploads a data URL to the public `photos` bucket and returns a URL the browser can load. */
export async function uploadPhoto(sb: Supabase, resultId: string, dataUrl: string): Promise<string> {
  const { mime, bytes } = parseDataUrl(dataUrl);
  const path = `${resultId}.${EXTENSIONS[mime] ?? "bin"}`;
  const bucket = sb.storage.from(BUCKET);

  const { error } = await bucket.upload(path, bytes, { contentType: mime, upsert: true });
  if (error) throw new Error(`[store:supabase] savePhoto upload failed: ${error.message}`);

  return bucket.getPublicUrl(path).data.publicUrl;
}
