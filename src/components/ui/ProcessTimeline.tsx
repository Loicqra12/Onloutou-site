"use client";

import { useEffect, useRef } from "react";
import type { DeploymentPhase } from "@/types/content";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";

type ProcessTimelineProps = {
  id?: string;
  title: string;
  description?: string;
  phases: DeploymentPhase[];
};

export function ProcessTimeline({ id, title, description, phases }: ProcessTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("process-timeline-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("process-timeline-active");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className="bg-brand-paper py-16 sm:py-20 scroll-mt-28">
      <div className="container-content">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          {description && <p className="mt-3 max-w-2xl text-brand-muted">{description}</p>}
        </Reveal>
        <div ref={rootRef} className="process-timeline-root relative mt-10">
          <div
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-0.5 bg-brand-border lg:block"
            aria-hidden
          />
          <div
            className="process-timeline-line process-timeline-line--desktop pointer-events-none absolute left-0 top-5 hidden h-0.5 w-full bg-brand-yellow lg:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-3 top-0 w-0.5 bg-brand-border lg:hidden"
            aria-hidden
          />
          <div
            className="process-timeline-line process-timeline-line--mobile pointer-events-none absolute bottom-0 left-3 top-0 w-0.5 origin-top bg-brand-yellow lg:hidden"
            aria-hidden
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:pt-4">
            {phases.map((phase, index) => (
              <Reveal key={phase.step} delay={index * 80} as="li">
                <article id={phase.id} className="interactive-card relative h-full scroll-mt-28 rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-6 shadow-[var(--shadow-card)]">
                  <span className="font-display text-3xl font-extrabold text-[#dedede]">{phase.step}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{phase.description}</p>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
