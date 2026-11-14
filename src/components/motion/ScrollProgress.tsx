"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/components/motion/enable-motion";

export function ScrollProgress() {
  const pathname = usePathname() ?? "";
  const hidden = pathname.startsWith("/espace-partenaire") || pathname.startsWith("/espace-livreur");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || hidden) return;

    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const next = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      setProgress(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [hidden]);

  if (hidden || progress <= 0) return null;

  return (
    <div
      className="scroll-progress pointer-events-none fixed left-0 top-0 z-40 h-0.5 w-full origin-left bg-brand-yellow"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden
    />
  );
}
