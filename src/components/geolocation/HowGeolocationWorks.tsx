"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";
import { geolocationProcess } from "@/content/geolocation-page";

export function HowGeolocationWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("geo-process-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("geo-process-active");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={geolocationProcess.id}
      className="geo-process section-spacing scroll-mt-28 bg-brand-white"
      aria-labelledby="geo-process-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="geo-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {geolocationProcess.title}
          </h2>
        </Reveal>
        <div ref={rootRef} className="geo-process__root">
          <div className="geo-process__track" aria-hidden>
            <span className="geo-process__track-base" />
            <span className="geo-process__track-fill" />
          </div>
          <ol className="geo-process__steps">
            {geolocationProcess.steps.map((step, index) => (
              <li key={step.title} className="geo-process__step">
                <span className="geo-process__marker" aria-hidden>{index + 1}</span>
                <h3 className="geo-process__step-title">{step.title}</h3>
                <p className="geo-process__step-text">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
