"use client";

import { useEffect, useRef, useState } from "react";
import { partnersCollaborationPath } from "@/content/partners-page";

export function CollaborationPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = partnersCollaborationPath.steps;

  useEffect(() => {
    rootRef.current?.classList.add("partners-path--enhanced");
  }, []);

  return (
    <section className="partners-path section-spacing bg-brand-paper" aria-labelledby="partners-path-title">
      <div className="container-content">
        <h2 id="partners-path-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {partnersCollaborationPath.title}
        </h2>

        <div ref={rootRef} className="partners-path__network" role="list">
          {steps.map((step, index) => (
            <div key={step.title} className="partners-path__node-wrap" role="listitem">
              <button
                type="button"
                className={`partners-path__node${index === activeIndex ? " partners-path__node--active" : ""}`}
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => setActiveIndex(index)}
              >
                <span className="partners-path__node-num">{index + 1}</span>
                {step.title}
              </button>
              <div className={`partners-path__node-body${index === activeIndex ? " is-open" : ""}`}>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <ol className="partners-path__linear">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="partners-path__linear-num">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
