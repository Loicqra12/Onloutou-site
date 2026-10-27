"use client";

import { useEffect, useRef, useState } from "react";
import { projectsMethodPhases } from "@/content/projects-page";

export function ProjectMethodHub() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const phases = projectsMethodPhases.phases;

  useEffect(() => {
    rootRef.current?.classList.add("proj-method--enhanced");
  }, []);

  return (
    <section className="proj-method section-spacing bg-brand-white" aria-labelledby="proj-method-title">
      <div className="container-content">
        <h2 id="proj-method-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {projectsMethodPhases.title}
        </h2>

        <div ref={rootRef} className="proj-method__hub">
          <div className="proj-method__center" aria-hidden>Projet</div>
          <ol className="proj-method__branches">
            {phases.map((phase, index) => (
              <li key={phase.title}>
                <button
                  type="button"
                  className={`proj-method__branch${index === activeIndex ? " proj-method__branch--active" : ""}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="proj-method__branch-num">{index + 1}</span>
                  {phase.title}
                </button>
                <div className={`proj-method__branch-body${index === activeIndex ? " is-open" : ""}`}>
                  <p>{phase.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ol className="proj-method__linear">
          {phases.map((phase, index) => (
            <li key={phase.title}>
              <span className="proj-method__linear-num">{index + 1}</span>
              <div>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
