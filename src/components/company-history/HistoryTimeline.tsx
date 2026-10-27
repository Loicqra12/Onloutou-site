"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CompanyHistoryMilestone } from "@/content/company-history";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";
import { RecognitionSources } from "@/components/recognitions/RecognitionSources";

export function HistoryTimeline({ entries }: { entries: CompanyHistoryMilestone[] }) {
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
            key={entry.id}
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
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">{entry.summary}</p>
            {entry.sources && entry.sources.length > 0 ? (
              <RecognitionSources sources={entry.sources} />
            ) : null}
            {entry.archiveLink ? (
              <p className="mt-3">
                <Link href={entry.archiveLink.href} className="about-timeline-archive link-motion text-sm font-semibold text-brand-ink">
                  {entry.archiveLink.label}
                  <span aria-hidden> →</span>
                </Link>
              </p>
            ) : null}
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
