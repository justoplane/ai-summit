"use client";

import { useEffect, useState } from "react";

type Props = {
  /** 0-100 */
  score: number;
  /** Count up from zero on mount. Otherwise the final number shows immediately. */
  animate: boolean;
};

const DURATION_MS = 1200;

export function ScoreCounter({ score, animate }: Props) {
  const [counted, setCounted] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = reduced ? 1 : Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - (1 - t) ** 3;
      setCounted(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [score, animate]);

  const shown = animate ? counted : score;

  return (
    <span className="font-display font-bold leading-none tracking-tighter">
      <span aria-hidden className="text-gradient text-6xl tabular-nums md:text-7xl 2xl:text-8xl">
        {shown}
        <span className="text-3xl md:text-4xl">%</span>
      </span>
      <span className="sr-only">{score} percent</span>
    </span>
  );
}
