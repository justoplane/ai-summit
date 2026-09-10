import { splitTitles } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

type Props = {
  /** Comma-separated titles from content/members.ts. */
  titles: string;
  /** Show at most this many chips, then a "+N" chip. */
  max?: number;
  align?: "start" | "center";
  /** md bumps the text so it reads from across a room. */
  size?: "sm" | "md";
  className?: string;
};

/** A resident's company titles as chips. Spans only, so it's valid inside <summary>. */
export function TitleChips({ titles, max, align = "start", size = "sm", className }: Props) {
  const all = splitTitles(titles);
  const shown = max ? all.slice(0, max) : all;
  const hidden = all.length - shown.length;
  const text = size === "md" ? "text-xs md:text-sm normal-case tracking-normal" : "normal-case tracking-normal";

  return (
    <span className={cn("flex flex-wrap gap-1", align === "center" && "justify-center", className)}>
      {shown.map((t) => (
        <Badge key={t} tone="violet" className="max-w-full">
          <span className={cn("truncate", text)}>{t}</span>
        </Badge>
      ))}
      {hidden > 0 && (
        <Badge title={all.slice(shown.length).join(", ")}>
          <span className={text}>+{hidden}</span>
        </Badge>
      )}
    </span>
  );
}
