import { Button } from "@/components/ui/Button";
import { dataUrlBytes } from "./compressImage";

type Props = { src: string; onRetake: () => void };

export function PhotoPreview({ src, onRetake }: Props) {
  const kb = Math.max(1, Math.round(dataUrlBytes(src) / 1024));
  return (
    <div className="flex flex-col gap-3 animate-rise">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-violet/40">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL preview; nothing to optimize */}
        <img src={src} alt="Your selected photo" className="size-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-lime backdrop-blur">
          biometric lock ok
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          payload optimized · {kb} KB
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetake}>
          Retake
        </Button>
      </div>
    </div>
  );
}
