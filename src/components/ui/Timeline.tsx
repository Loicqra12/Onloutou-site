"use client";

import { useEffect, useRef } from "react";
export type TimelineEntry = {
  period: string;
  title: string;
  paragraphs: string[];
};
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("about-timeline-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("about-timeline-active");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="about-timeline-root relative">
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-0.5 bg-brand-border"
        aria-hidden
      />
      <div
        className="about-timeline-line pointer-events-none absolute bottom-0 left-0 top-0 w-0.5 bg-brand-yellow"
        aria-hidden
      />
      <ol className="relative space-y-8 border-l-0 pl-8">
        {entries.map((entry, index) => (
          <Reveal
            key={`${entry.period}-${entry.title}`}
            as="li"
            delay={index * 90}
            className="about-timeline-item relative"
          >
            <span
              className="about-timeline-dot absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow ring-4 ring-brand-white"
              aria-hidden
            />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-yellow">
              {entry.period}
            </p>
            <h3 className="mt-1 font-display text-xl font-extrabold text-brand-ink">{entry.title}</h3>
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-2 text-sm leading-relaxed text-brand-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
