"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { historicalReferenceLogos } from "@/content/media";
import { bindRevealObserver } from "@/components/motion/observeReveal";

export function InstitutionalLogoBand() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return bindRevealObserver(node, { threshold: 0.2, rootMargin: "0px" });
  }, []);

  return (
    <section ref={ref} className="logo-band" aria-label="Logos institutionnels associés à ONLOUTOU">
      <div className="logo-band-bg" aria-hidden />
      <div className="logo-band-glow" aria-hidden />
      <span className="logo-band-line" aria-hidden />
      <div className="container-content">
        <ul className="logo-band-list">
          {historicalReferenceLogos.map((logo, index) => (
            <li
              key={logo.id}
              className={`logo-slot logo-slot--${logo.id}`}
              style={
                {
                  "--logo-index": index,
                  "--logo-scale": logo.visualScale ?? 1,
                  "--logo-max-w": `${logo.visualMaxWidth ?? 150}px`,
                  "--logo-max-h": `${logo.visualMaxHeight ?? 48}px`,
                } as CSSProperties
              }
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.visualMaxWidth ?? logo.width}
                height={logo.visualMaxHeight ?? logo.height}
                sizes="180px"
                className="logo-mark"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
