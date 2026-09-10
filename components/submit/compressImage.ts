/** Browser-side photo compression so the submit payload stays small. */

export class UnsupportedImageError extends Error {
  constructor() {
    super("That photo could not be read. Try a different one (JPEG or PNG).");
    this.name = "UnsupportedImageError";
  }
}

const MAX_SIDE = 1024;
/** The server accepts 1.5M chars; stay well under so slow connections still finish. */
const MAX_DATA_URL_CHARS = 900_000;
const QUALITY_STEPS = [0.82, 0.7, 0.6];

type Decoded = ImageBitmap | HTMLImageElement;

async function decode(file: File): Promise<Decoded> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Older Safari/Firefox, or a format createImageBitmap rejects that <img> can still load.
    return decodeViaImageElement(file);
  }
}

function decodeViaImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new UnsupportedImageError());
    };
    img.src = url;
  });
}

function dimensions(source: Decoded): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

/** Approximate decoded byte size of a base64 data URL. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round((base64.length * 3) / 4);
}

/**
 * Decode, downscale so the longest side is at most 1024px, and export as JPEG.
 * Steps down quality until the data URL fits under the size budget.
 */
export async function compressImage(file: File): Promise<string> {
  const source = await decode(file);
  const { width, height } = dimensions(source);
  if (!width || !height) throw new UnsupportedImageError();

  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot process images. Try another one.");
  // JPEG has no alpha channel; without a fill, transparent PNG pixels turn black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  let dataUrl = "";
  for (const quality of QUALITY_STEPS) {
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= MAX_DATA_URL_CHARS) break;
  }
  if (!dataUrl.startsWith("data:image/jpeg")) throw new UnsupportedImageError();
  return dataUrl;
}
