"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { homeBuildIntro, homeBuildModules, homeBuildScene } from "@/content/home";

export function PlatformSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  return (
    <section
      id="plateforme"
      data-section="build"
      ref={rootRef}
      className="home-build section-spacing motion-reveal"
      aria-labelledby="home-build-title"
    >
      <div className="home-build-media" aria-hidden>
        <Image
          src={homeBuildScene.src}
          alt=""
          fill
          sizes={homeBuildScene.sizes}
          className="home-build-photo"
        />
        <div className="home-build-veil" />
      </div>
      <div className="home-build-wrap">
        <div className="home-build-copy">
          <p className="home-build-eyebrow">
            <span className="home-build-eyebrow-line" aria-hidden />
            {homeBuildIntro.eyebrow}
          </p>
          <h2 id="home-build-title" className="home-build-heading">
            {homeBuildIntro.title}
          </h2>
          <p className="home-build-lead">{homeBuildIntro.lead}</p>
          <p className="home-build-note">{homeBuildIntro.note}</p>
        </div>
        <ul className="home-build-modules">
          {homeBuildModules.map((module) => (
            <li key={module.title}>
              <article className="home-build-module">
                <span className="home-build-accent" aria-hidden />
                <h3 className="home-build-module-title">{module.title}</h3>
                <p className="home-build-module-text">{module.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
