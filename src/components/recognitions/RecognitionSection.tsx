"use client";

import { useLayoutEffect, useRef } from "react";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { getFeaturedRecognition, getSecondaryRecognitions, recognitionsIntro } from "@/content/recognitions";
import { RecognitionFeature } from "@/components/recognitions/RecognitionFeature";
import { RecognitionTimeline } from "@/components/recognitions/RecognitionTimeline";
import { Reveal } from "@/components/motion/Reveal";

export function RecognitionSection() {
  const rootRef = useRef<HTMLElement>(null);
  const featured = getFeaturedRecognition();
  const secondary = getSecondaryRecognitions();

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node, { threshold: 0.12 });
  }, []);

  return (
    <section
      id="distinctions"
      ref={rootRef}
      className="recognition-section section-spacing scroll-mt-28 motion-reveal"
      aria-labelledby="recognition-section-title"
    >
      <span className="recognition-section__accent" aria-hidden />
      <div className="container-content recognition-section__inner">
        <header className="recognition-section__header motion-reveal">
          <Reveal>
            <h2 id="recognition-section-title" className="recognition-section__title font-display">
              Distinctions et parcours entrepreneurial
            </h2>
            <p className="recognition-section__intro">{recognitionsIntro}</p>
          </Reveal>
        </header>

        <div className="recognition-section__grid">
          <RecognitionFeature entry={featured} />
          <RecognitionTimeline entries={secondary} />
        </div>

      </div>
    </section>
  );
}
