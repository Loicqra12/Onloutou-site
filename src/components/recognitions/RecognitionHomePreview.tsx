"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { Reveal } from "@/components/motion/Reveal";
import { homeHistoryPreview } from "@/content/company-history";
import { homeRecognitionsCta } from "@/content/recognitions";

export function RecognitionHomePreview() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  return (
    <section
      ref={rootRef}
      className="home-recognitions section-spacing motion-reveal"
      aria-labelledby="home-recognitions-title"
    >
      <span className="home-recognitions__accent" aria-hidden />
      <div className="container-content">
        <header className="home-recognitions__header">
          <Reveal>
            <p className="home-recognitions__eyebrow">{homeHistoryPreview.since}</p>
            <h2 id="home-recognitions-title" className="home-recognitions__title font-display">
              Parcours et distinctions
            </h2>
          </Reveal>
        </header>

        <ol className="home-recognitions__list">
          {homeHistoryPreview.highlights.map((item, index) => (
            <Reveal key={item.title} as="li" delay={60 + index * 50} className="home-recognitions__item">
              <span className="home-recognitions__event">{item.title}</span>
              <div className="home-recognitions__copy">
                <span className="home-recognitions__status">{item.detail}</span>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="home-recognitions__cta-wrap">
          <Link href={homeRecognitionsCta.href} className="home-recognitions__cta link-motion">
            {homeRecognitionsCta.label}
            <span className="home-recognitions__cta-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
