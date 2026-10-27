"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { prefersReducedMotion, revealIfInView } from "@/components/motion/enable-motion";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { deploymentPhases, solutionsHubClosing, solutionsHubMethodPhoto } from "@/content/solutions-hub";

export function SolutionsMethod() {
  const rootRef = useRef<HTMLElement>(null);
  const photo = solutionsHubMethodPhoto;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion() || revealIfInView(root)) {
      root.classList.add("hub-method-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("hub-method-active");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="hub-method" aria-labelledby="hub-method-title">
      <div className="container-content hub-method__intro">
        <div>
          <TitleReveal as="h2" id="hub-method-title" className="hub-method__title font-display font-extrabold tracking-tight">
            Méthode de <HighlightedText variant="marker" className="sales-marker">déploiement</HighlightedText>
          </TitleReveal>
          <p className="hub-method__lead">
            Six étapes pour passer du besoin exprimé à une solution exploitable.
          </p>
        </div>
        <figure className="hub-method__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 900px) 100vw, 42vw"
            className="hub-method__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
      <div className="container-content">
        <ol className="hub-method__steps">
          {deploymentPhases.map((phase) => (
            <li key={phase.step} className="hub-method__step">
              <span className="hub-method__num">{phase.step}</span>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
            </li>
          ))}
        </ol>
        <p className="hub-method__note">{solutionsHubClosing}</p>
      </div>
    </section>
  );
}
