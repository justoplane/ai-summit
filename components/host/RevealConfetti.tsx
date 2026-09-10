"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = { resultId: string };

// Theme colors duplicated on purpose: the confetti canvas can't read CSS variables.
const COLORS = ["#22d3ee", "#8b5cf6", "#f472b6", "#a3e635"];

// Survives Strict Mode's double effect in dev so each result gets exactly one celebration.
let lastFiredId: string | null = null;

function burst(x: number, angle: number) {
  void confetti({
    particleCount: 140,
    spread: 70,
    startVelocity: 55,
    angle,
    origin: { x, y: 0.7 },
    colors: COLORS,
    disableForReducedMotion: true,
    zIndex: 50,
  });
}

/** Renders nothing; fires confetti once per result id. */
export function RevealConfetti({ resultId }: Props) {
  useEffect(() => {
    if (lastFiredId === resultId) return;
    lastFiredId = resultId;
    burst(0.1, 60);
    burst(0.9, 120);
    const finale = setTimeout(() => burst(0.5, 90), 400);
    return () => clearTimeout(finale);
  }, [resultId]);

  return null;
}
