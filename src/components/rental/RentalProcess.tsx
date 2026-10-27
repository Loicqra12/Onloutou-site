"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";
import { rentalProcess } from "@/content/rental-page";

export function RentalProcess() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("rental-process-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("rental-process-active");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="rental-process section-spacing" aria-labelledby="rental-process-title">
      <div className="container-content">
        <Reveal>
          <h2 id="rental-process-title" className="rental-process__title font-display font-extrabold tracking-tight">
            {rentalProcess.title}
          </h2>
        </Reveal>
        <div ref={rootRef} className="rental-process__root">
          <ol className="rental-process__steps">
            {rentalProcess.steps.map((step, index) => (
              <li key={step.title} className="rental-process__step" style={{ "--step-i": index } as CSSProperties}>
                <span className="rental-process__marker" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="rental-process__step-title">{step.title}</h3>
                <p className="rental-process__step-text">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
