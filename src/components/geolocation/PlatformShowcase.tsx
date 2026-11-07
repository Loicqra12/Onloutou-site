"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { geolocationMedia, geolocationPlatform } from "@/content/geolocation-page";

const panels = [
  {
    id: "localisation",
    label: "Localisation",
    media: geolocationMedia.dashboardMap,
    alt: "Interface de démonstration pour la géolocalisation d’une flotte à Abidjan",
  },
  {
    id: "supervision",
    label: "Supervision",
    media: geolocationMedia.dashboardSupervision,
    alt: geolocationMedia.dashboardSupervision.alt,
  },
] as const;

export function PlatformShowcase() {
  const baseId = useId();
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const node = showcaseRef.current;
    node?.classList.add("geo-platform--tabs-ready");

    // Les onglets pr?ts r?duisent la hauteur de cette section (panneaux empil?s -> un seul visible).
    // Si l'URL cible une ancre situ?e plus bas, on la r?aligne apr?s ce changement de mise en page.
    const hash = window.location.hash.slice(1);
    if (!node || !hash) return;
    const target = document.getElementById(decodeURIComponent(hash));
    if (!target || !(node.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => target.scrollIntoView());
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const selectTab = useCallback((index: number) => {
    setActiveIndex((index + panels.length) % panels.length);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab(activeIndex + 1);
    }
  };

  return (
    <section
      id={geolocationPlatform.id}
      className="geo-platform section-spacing bg-brand-paper"
      aria-labelledby="geo-platform-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="geo-platform-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {geolocationPlatform.title}
          </h2>
          <p className="geo-platform__intro">{geolocationPlatform.intro}</p>
        </Reveal>

        <div ref={showcaseRef} className="geo-platform__showcase">
          <div
            role="tablist"
            aria-label="Vues de la plateforme"
            className="geo-platform__tabs"
            onKeyDown={onKeyDown}
          >
            {panels.map((panel, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={panel.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${panel.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${panel.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`geo-platform__tab${selected ? " geo-platform__tab--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {panel.label}
                </button>
              );
            })}
          </div>

          {panels.map((panel, index) => {
            const selected = index === activeIndex;
            const media = panel.media;
            return (
              <div
                key={panel.id}
                role="tabpanel"
                id={`${baseId}-panel-${panel.id}`}
                aria-labelledby={`${baseId}-tab-${panel.id}`}
                aria-hidden={!selected}
                className={`geo-platform__panel${selected ? " geo-platform__panel--active" : ""}`}
              >
                <div className="geo-platform__frame">
                  <Image
                    src={media.src}
                    alt={panel.alt}
                    width={media.width}
                    height={media.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1100px"
                    className="geo-platform__img"
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}

          <p className="geo-platform__disclaimer">{geolocationPlatform.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
