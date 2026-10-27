"use client";

import { useEffect } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/components/motion/enable-motion";

const universes = ["Louer", "Acheter", "Connecter", "Construire"] as const;

export function HeroEntrance() {
  useEffect(() => {
    const activate = () => document.documentElement.classList.add("hero-entrance-active");
    if (prefersReducedMotion()) {
      activate();
      return;
    }
    const frame = window.requestAnimationFrame(activate);
    const failsafe = window.setTimeout(activate, 1400);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className="max-w-xl">
      <p className="hero-seq hero-seq-1 mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#F5C400] sm:text-xs">
        <span className="h-0.5 w-6 bg-[#F5C400]" aria-hidden />
        {universes.map((word, index) => (
          <span key={word} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden>·</span>}
            {word}
          </span>
        ))}
      </p>
      <h1 className="font-display text-[1.85rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">
        <span className="hero-seq hero-seq-2 block">{hero.titleLine1}</span>
        <span className="hero-seq hero-seq-3 mt-1 block">
          Piloter les <span className="text-[#F5C400]">opérations.</span>
        </span>
      </h1>
        <p className="hero-seq hero-seq-4 mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
        {hero.lead}
      </p>
      <div className="hero-seq hero-seq-5 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button href="/contact" className="btn-motion-primary">
          Parler à un expert <span className="btn-arrow" aria-hidden>↗</span>
        </Button>
        <a
          href="/solutions"
          className="inline-flex min-h-11 items-center justify-center border border-white/45 px-5 text-sm font-bold text-white transition-colors hover:border-[#F5C400] hover:text-[#F5C400]"
        >
          Découvrir nos solutions
        </a>
      </div>
    </div>
  );
}
