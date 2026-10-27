"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { Reveal } from "@/components/motion/Reveal";
import { deliveryProcess } from "@/content/delivery-page";

export function DeliveryJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("dlv-process-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("dlv-process-active");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const data = deliveryProcess;

  return (
    <section
      id={data.id}
      className="dlv-process section-spacing scroll-mt-28 bg-brand-white"
      aria-labelledby="dlv-process-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="dlv-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <div ref={rootRef} className="dlv-process__root">
          <div className="dlv-process__track" aria-hidden>
            <span className="dlv-process__track-base" />
            <span className="dlv-process__track-fill" />
          </div>
          <ol className="dlv-process__steps">
            {data.steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 70} as="li" className="dlv-process__step">
                <span className="dlv-process__num" aria-hidden>{step.number}</span>
                <h3 className="font-display text-lg font-extrabold">{step.title}</h3>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
