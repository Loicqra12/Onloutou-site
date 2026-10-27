"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";

const pointIds = ["ci", "gn", "bf", "ga"];

export function WestAfricaMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (prefersReducedMotion()) {
      pointIds.forEach((id) => svg.querySelector(`#map-point-${id}`)?.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        pointIds.forEach((id, index) => {
          const node = svg.querySelector(`#map-point-${id}`);
          if (!node) return;
          window.setTimeout(() => node.classList.add("is-visible"), index * 120);
        });
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 540 430"
      className="h-auto w-full"
      aria-label="Carte stylisée de l’Afrique avec quatre pays mis en avant"
      role="img"
    >
      <path
        d="M214 26l85 14 50 39 55 14 16 50-31 45-8 67-48 75-55 70-36-25-16-73-45-34-22-57-43-30 10-70 47-23z"
        fill="#181818"
        stroke="#3a3a3a"
        strokeWidth="2"
      />
      <path
        d="M120 111l53-23 43 21-9 56-42 30-49-14z"
        fill="#202020"
        stroke="#383838"
      />
      <g id="map-point-ci" className="map-point">
        <circle cx="158" cy="177" r="10" fill="#f5c400" stroke="#111" strokeWidth="3" />
        <text x="176" y="181" fill="#bbbbbb" fontSize="12" fontFamily="var(--font-sans)">
          Côte d’Ivoire
        </text>
      </g>
      <g id="map-point-gn" className="map-point">
        <circle cx="136" cy="144" r="7" fill="#f5c400" stroke="#111" strokeWidth="3" />
        <text x="38" y="128" fill="#bbbbbb" fontSize="12" fontFamily="var(--font-sans)">
          Guinée
        </text>
      </g>
      <g id="map-point-bf" className="map-point">
        <circle cx="190" cy="129" r="7" fill="#f5c400" stroke="#111" strokeWidth="3" />
        <text x="207" y="115" fill="#bbbbbb" fontSize="12" fontFamily="var(--font-sans)">
          Burkina Faso
        </text>
      </g>
      <g id="map-point-ga" className="map-point">
        <circle cx="295" cy="230" r="7" fill="#f5c400" stroke="#111" strokeWidth="3" />
        <text x="312" y="234" fill="#bbbbbb" fontSize="12" fontFamily="var(--font-sans)">
          Gabon
        </text>
      </g>
      <path
        d="M158 177Q168 138 190 129M158 177Q220 187 295 230M158 177Q146 156 136 144"
        fill="none"
        stroke="#f5c400"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
