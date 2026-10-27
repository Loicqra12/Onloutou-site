"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { PlatformTypeMock } from "@/components/platforms/PlatformTypeMock";
import { customPlatformTypes, type PlatformTypeId } from "@/content/custom-platforms-page";

export function PlatformTypes() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = customPlatformTypes.items;

  useEffect(() => {
    rootRef.current?.classList.add("platform-types--tabs-ready");
  }, []);

  const selectTab = useCallback(
    (index: number) => {
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length],
  );

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
      setActiveIndex(items.length - 1);
    }
  };

  return (
    <section
      id={customPlatformTypes.id}
      className="platform-types section-spacing scroll-mt-28"
      aria-labelledby="platform-types-title"
    >
      <div className="container-content">
        <p className="platform-kicker">Interfaces</p>
        <TitleReveal as="h2" id="platform-types-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformTypes.title}
        </TitleReveal>
        <p className="platform-types__lead">{customPlatformTypes.lead}</p>

        <div ref={rootRef} className="platform-types__root">
          <div
            role="tablist"
            aria-label="Familles de plateformes"
            className="platform-types__tabs"
            onKeyDown={onKeyDown}
          >
            {items.map((item, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`platform-types__tab${selected ? " platform-types__tab--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="platform-types__panels">
            {items.map((item, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={item.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${item.id}`}
                  aria-labelledby={`${baseId}-tab-${item.id}`}
                  aria-hidden={!selected}
                  className={`platform-types__panel${selected ? " platform-types__panel--active" : ""}`}
                >
                  <div className="platform-types__stage">
                    <div className="platform-types__copy">
                      <h3 className="platform-types__panel-title">{item.title}</h3>
                      <ul className="platform-types__points">
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      {item.note && <p className="platform-types__note">{item.note}</p>}
                      <Button href={customPlatformTypes.cta.href} variant="primary">
                        {customPlatformTypes.cta.label}
                      </Button>
                    </div>
                    <PlatformTypeMock typeId={item.id as PlatformTypeId} title={item.title} />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="platform-types__accordion">
            {items.map((item) => (
              <details key={item.id} className="platform-types__details">
                <summary>{item.title}</summary>
                <div className="platform-types__details-body">
                  <ul className="platform-types__points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {item.note && <p className="platform-types__note">{item.note}</p>}
                  <PlatformTypeMock typeId={item.id as PlatformTypeId} title={item.title} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
