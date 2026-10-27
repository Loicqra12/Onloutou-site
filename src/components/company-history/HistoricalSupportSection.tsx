"use client";

import { useLayoutEffect, useRef } from "react";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { Reveal } from "@/components/motion/Reveal";
import { HistoricalImage } from "@/components/company-history/HistoricalImage";
import { historicalSupportContent } from "@/content/company-history";
import { RecognitionSources } from "@/components/recognitions/RecognitionSources";

export function HistoricalSupportSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  return (
    <section
      id="accompagnement"
      ref={rootRef}
      className="history-support section-spacing scroll-mt-28 motion-reveal"
      aria-labelledby="history-support-title"
    >
      <span className="history-support__accent" aria-hidden />
      <div className="container-content history-support__layout">
        <div className="history-support__copy">
          <Reveal>
            <h2 id="history-support-title" className="history-support__title font-display">
              {historicalSupportContent.title}
            </h2>
            <p className="history-support__summary">{historicalSupportContent.summary}</p>
            <RecognitionSources sources={historicalSupportContent.sources} />
          </Reveal>
        </div>
        <Reveal delay={120} className="history-support__visual">
          <HistoricalImage assetId="equipe-vehicule-site" sizes="(max-width: 1024px) 100vw, 44vw" />
        </Reveal>
      </div>
    </section>
  );
}
