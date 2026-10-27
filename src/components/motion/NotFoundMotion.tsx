"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";

export function NotFoundMotion() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const activate = () => svg.classList.add("not-found-scene--on");

    if (prefersReducedMotion()) {
      activate();
      return;
    }

    const timer = window.setTimeout(activate, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 120"
      className="mx-auto h-auto w-full max-w-[240px] text-brand-yellow"
      aria-hidden
    >
      <rect x="8" y="20" width="184" height="80" rx="12" fill="currentColor" opacity="0.12" />
      <path
        d="M36 72 C70 40, 110 95, 140 58 S175 48, 168 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="6 6"
        className="not-found-route"
        opacity="0.55"
      />
      <circle cx="36" cy="72" r="5" fill="#111111" stroke="currentColor" strokeWidth="2" />
      <circle cx="168" cy="72" r="5" fill="currentColor" className="not-found-gps" />
      <text
        x="100"
        y="58"
        textAnchor="middle"
        fill="#111111"
        fontSize="28"
        fontFamily="var(--font-display)"
        fontWeight="800"
      >
        404
      </text>
    </svg>
  );
}
