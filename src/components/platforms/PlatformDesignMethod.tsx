"use client";

import { useEffect, useRef, useState } from "react";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { customPlatformsMethod } from "@/content/custom-platforms-page";

export function PlatformDesignMethod() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = customPlatformsMethod.steps;

  useEffect(() => {
    rootRef.current?.classList.add("platform-method--enhanced");
  }, []);

  return (
    <section
      id="methode-conception"
      className="platform-method section-spacing"
      aria-labelledby="platform-method-title"
    >
      <div className="container-content">
        <p className="platform-kicker">De l’idée à l’usage</p>
        <TitleReveal as="h2" id="platform-method-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformsMethod.title}
        </TitleReveal>
        <p className="platform-method__note">
          La séquence et les livrables sont adaptés au contexte — ce schéma n’impose pas une méthode unique.
        </p>

        <div ref={rootRef} className="platform-method__layout">
          <nav className="platform-method__nav" aria-label="Étapes de conception">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`platform-method__nav-btn${index === activeIndex ? " platform-method__nav-btn--active" : ""}`}
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => setActiveIndex(index)}
              >
                <span className="platform-method__nav-num">{index + 1}</span>
                {step.title}
              </button>
            ))}
          </nav>

          <ol className="platform-method__steps">
            <li className="platform-method__head" aria-hidden>
              <span>Étape</span>
              <span>Description</span>
              <span>Livrable indicatif</span>
            </li>
            {steps.map((step, index) => (
              <li key={step.title}>
                <button
                  type="button"
                  className={`platform-method__step${index === activeIndex ? " platform-method__step--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="platform-method__step-num" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="platform-method__step-body">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <aside className="platform-method__deliverable">
                    <span className="platform-method__deliverable-label">Livrable attendu</span>
                    <p>{step.deliverable}</p>
                  </aside>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
