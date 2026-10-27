"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projectImage } from "@/components/projects/projectMedia";
import { projectsFieldMethod, projectsImageDisclaimer } from "@/content/projects-page";

export function FieldMethodStory() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = projectsFieldMethod.steps;

  useEffect(() => {
    rootRef.current?.classList.add("proj-field--enhanced");
    const root = rootRef.current;
    if (!root || !window.matchMedia("(min-width: 1024px)").matches) return;

    const blocks = [...root.querySelectorAll<HTMLElement>(".proj-field__step")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.stepIndex);
          if (!Number.isNaN(index)) setActiveIndex(index);
        });
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0.2 },
    );
    blocks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id={projectsFieldMethod.id}
      className="proj-field section-spacing bg-brand-white"
      aria-labelledby="proj-field-title"
    >
      <div className="container-content">
        <h2 id="proj-field-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {projectsFieldMethod.title}
        </h2>
        <p className="proj-field__disclaimer">{projectsImageDisclaimer}</p>

        <ol className="proj-field__timeline">
          {steps.map((step, index) => {
            const media = projectImage(step.mediaKey);
            const active = index === activeIndex;
            return (
              <li
                key={step.title}
                className={`proj-field__step${active ? " proj-field__step--active" : ""}`}
                data-step-index={index}
              >
                <div className="proj-field__copy">
                  <span className="proj-field__step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.message}</p>
                </div>
                <figure className="proj-field__figure">
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={media.width}
                    height={media.height}
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="proj-field__img"
                    style={{ objectPosition: media.objectPosition }}
                  />
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
