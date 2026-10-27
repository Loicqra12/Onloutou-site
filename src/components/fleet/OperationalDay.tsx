"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";
import { fleetOperationalDay } from "@/content/fleet-management-page";

export function OperationalDay() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("fleet-day-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("fleet-day-active");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="fleet-day section-spacing bg-brand-white" aria-labelledby="fleet-day-title">
      <div className="container-content">
        <Reveal>
          <h2 id="fleet-day-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {fleetOperationalDay.title}
          </h2>
        </Reveal>
        <div ref={rootRef} className="fleet-day__root">
          <div className="fleet-day__track" aria-hidden>
            <span className="fleet-day__track-base" />
            <span className="fleet-day__track-fill" />
          </div>
          <ol className="fleet-day__steps">
            {fleetOperationalDay.steps.map((step, index) => (
              <li key={step.title} className="fleet-day__step">
                <span className="fleet-day__marker" aria-hidden>{index + 1}</span>
                <h3 className="fleet-day__step-title">{step.title}</h3>
                <p className="fleet-day__step-text">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
