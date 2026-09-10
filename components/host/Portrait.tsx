import Image from "next/image";
import { TitleChips } from "@/components/ui/TitleChips";

type Props = {
  src: string;
  name: string;
  /** Mono uppercase eyebrow above the name. */
  label: string;
  caption?: string;
  /** Comma-separated company titles, shown as chips under the name. */
  titles?: string;
  /** Guest photos are data URLs or Supabase URLs; resident photos in /public go through the optimizer. */
  unoptimized?: boolean;
};

export function Portrait({ src, name, label, caption, titles, unoptimized }: Props) {
  return (
    <figure className="flex min-w-0 flex-col items-center gap-3 text-center">
      <div className="glow relative aspect-square w-full max-w-40 overflow-hidden rounded-3xl border border-border bg-surface-strong md:max-w-52 xl:max-w-60">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 768px) 208px, 160px"
          className="object-cover"
          unoptimized={unoptimized}
        />
      </div>
      <figcaption className="w-full min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</span>
        <span className="block truncate font-display text-2xl font-bold tracking-tight md:text-3xl">{name}</span>
        {caption && <span className="block truncate text-sm text-muted md:text-base">{caption}</span>}
        {titles && <TitleChips titles={titles} align="center" size="md" className="mt-2" />}
      </figcaption>
    </figure>
  );
}
