"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { terrainGalleryItems, terrainMethodIntro, terrainMethodSteps } from "@/content/home";

export function HomeInstallationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;

    const desktopQuery = window.matchMedia("(min-width: 768px)");
    let frame = 0;

    const updateShift = () => {
      frame = 0;
      if (prefersReducedMotion() || !desktopQuery.matches) {
        section.style.removeProperty("--terrain-shift");
        return;
      }
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (view - rect.top) / (view + rect.height)));
      const shift = (progress - 0.5) * 36;
      section.style.setProperty("--terrain-shift", `${shift.toFixed(1)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateShift);
    };

    updateShift();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktopQuery.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktopQuery.removeEventListener("change", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="installation"
      data-section="terrain"
      className="home-terrain"
      aria-labelledby="home-terrain-title"
    >
      <div ref={stripRef} className="home-terrain-strip" aria-label="Interventions terrain ONLOUTOU">
        {terrainGalleryItems.map((item, index) => (
          <figure
            key={item.id}
            className={`home-terrain-shot home-terrain-shot--${item.span}`}
            style={{ "--terrain-delay": `${index * 80}ms` } as CSSProperties}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes={item.span === "wide" ? "(min-width: 768px) 24vw, 80vw" : "(min-width: 768px) 18vw, 80vw"}
              className="home-terrain-image"
              style={{ objectPosition: item.objectPosition }}
            />
          </figure>
        ))}
      </div>

      <div className="container-content home-terrain-grid">
        <div className="home-terrain-copy">
          <p className="home-terrain-eyebrow">
            <span aria-hidden />
            {terrainMethodIntro.eyebrow}
          </p>
          <h2 id="home-terrain-title" className="home-terrain-heading">
            {terrainMethodIntro.title}
          </h2>
          <p className="home-terrain-lead">{terrainMethodIntro.lead}</p>
          <Link href={terrainMethodIntro.cta.href} className="home-terrain-link">
            {terrainMethodIntro.cta.label} <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="home-terrain-method">
          <div className="home-terrain-cycle">
            <svg className="home-terrain-ring" viewBox="0 0 320 320" aria-hidden>
              <circle className="home-terrain-ring-track" cx="160" cy="160" r="118" />
              <circle className="home-terrain-ring-path" cx="160" cy="160" r="118" />
            </svg>
            <div className="home-terrain-core">
              <Image
                src={terrainMethodIntro.emblem.src}
                alt={terrainMethodIntro.emblem.alt}
                width={terrainMethodIntro.emblem.width}
                height={terrainMethodIntro.emblem.height}
                sizes="168px"
                className="home-terrain-emblem"
              />
              <p className="sr-only">ONLOUTOU</p>
            </div>
            <ol className="home-terrain-nodes" aria-label="Méthode ONLOUTOU">
              {terrainMethodSteps.map((step, index) => (
                <li key={step.id} className={`home-terrain-node home-terrain-node--${index + 1}`}>
                  <span className="home-terrain-dot" aria-hidden />
                  <span className="home-terrain-node-label">{step.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <ol className="home-terrain-timeline" aria-label="Méthode ONLOUTOU">
            {terrainMethodSteps.map((step) => (
              <li key={step.id}>
                <span>{step.number}</span>
                {step.shortTitle}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
