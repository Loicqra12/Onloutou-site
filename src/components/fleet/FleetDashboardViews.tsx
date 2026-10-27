"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { fleetDashboardViews, fleetManagementMedia } from "@/content/fleet-management-page";

const panels = [
  {
    id: "operations",
    label: "Vue opérations",
    media: fleetManagementMedia.dashboardOperations,
    alt: "Interface de démonstration pour la supervision d’une flotte ONLOUTOU",
  },
  {
    id: "cartographie",
    label: "Vue cartographique",
    media: fleetManagementMedia.dashboardMap,
    alt: "Interface de démonstration pour la géolocalisation d’une flotte à Abidjan",
  },
] as const;

export function FleetDashboardViews() {
  const baseId = useId();
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    showcaseRef.current?.classList.add("fleet-dashboard--tabs-ready");
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
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(panels.length - 1);
    }
  };

  return (
    <section
      id={fleetDashboardViews.id}
      className="fleet-dashboard section-spacing bg-brand-charcoal text-brand-white"
      aria-labelledby="fleet-dashboard-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="fleet-dashboard-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {fleetDashboardViews.title}
          </h2>
          <p className="fleet-dashboard__intro">{fleetDashboardViews.intro}</p>
        </Reveal>

        <div ref={showcaseRef} className="fleet-dashboard__showcase" id="fleet-pilotage-figure">
          <div
            role="tablist"
            aria-label="Vues du centre de supervision"
            className="fleet-dashboard__tabs"
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
                  className={`fleet-dashboard__tab${selected ? " fleet-dashboard__tab--active" : ""}`}
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
                className={`fleet-dashboard__panel${selected ? " fleet-dashboard__panel--active" : ""}`}
              >
                <div className="fleet-dashboard__frame">
                  <Image
                    src={media.src}
                    alt={panel.alt}
                    width={media.width}
                    height={media.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1100px"
                    className="fleet-dashboard__img"
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}

          <p className="fleet-dashboard__disclaimer">{fleetDashboardViews.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
