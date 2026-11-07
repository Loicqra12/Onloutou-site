"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { rentalCategories, rentalHero, type RentalCategoryId } from "@/content/rental-page";

export function RentalCategories() {
  const baseId = useId();
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<RentalCategoryId>("vehicules");
  const active = rentalCategories.items.find((item) => item.id === activeId) ?? rentalCategories.items[0];

  useEffect(() => {
    shellRef.current?.classList.add("rental-categories--enhanced");
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const match = rentalCategories.items.find((item) => item.id === hash);
      if (match) setActiveId(match.id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const ids = rentalCategories.items.map((item) => item.id);
    const current = ids.indexOf(activeId);
    if (current < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveId(ids[(current + 1) % ids.length]);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveId(ids[(current - 1 + ids.length) % ids.length]);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveId(ids[0]);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveId(ids[ids.length - 1]);
    }
  };

  return (
    <section
      id={rentalCategories.id}
      className="rental-categories section-spacing scroll-mt-28"
      aria-labelledby="rental-categories-title"
    >
      <div className="container-content">
        <Reveal className="rental-categories__intro">
          <div>
            <h2 id="rental-categories-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {rentalCategories.title}
            </h2>
          </div>
          <p className="rental-categories__disclaimer">{rentalCategories.disclaimer}</p>
        </Reveal>

        <div ref={shellRef} className="rental-categories__shell">
          <div
            role="tablist"
            aria-label="Familles de location"
            aria-orientation="vertical"
            className="rental-categories__tabs"
            onKeyDown={onTabKey}
          >
            {rentalCategories.items.map((cat, index) => {
              const selected = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${cat.id}`}
                  aria-selected={selected}
                  aria-controls={cat.id}
                  tabIndex={selected ? 0 : -1}
                  className={`rental-categories__tab${selected ? " rental-categories__tab--active" : ""}`}
                  onClick={() => setActiveId(cat.id)}
                >
                  <span className="rental-categories__tab-num" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rental-categories__tab-label">{cat.title}</span>
                  <span className="rental-categories__tab-arrow" aria-hidden>
                    →
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rental-categories__stage">
            {rentalCategories.items.map((cat) => {
              const selected = cat.id === activeId;
              return (
                <div
                  key={cat.id}
                  role="tabpanel"
                  id={cat.id}
                  aria-labelledby={`${baseId}-tab-${cat.id}`}
                  aria-hidden={!selected}
                  className={`rental-categories__panel${selected ? " rental-categories__panel--active" : ""}`}
                >
                  <div className="rental-categories__panel-inner">
                    {cat.image ? (
                      <figure className="rental-categories__visual">
                        <Image
                          src={cat.image.src}
                          alt={cat.image.alt}
                          width={cat.image.width}
                          height={cat.image.height}
                          sizes="(max-width: 1023px) 150vw, 80vw" quality={86}
                          className="rental-categories__visual-img"
                          style={{ objectPosition: cat.image.objectPosition }}
                        />
                      </figure>
                    ) : (
                      <div className="rental-categories__typo">
                        <span className="rental-categories__typo-mark" aria-hidden />
                        <p className="rental-categories__typo-text">
                          Catégorie qualifiée avec vous — sans engagement sur un modèle précis.
                        </p>
                      </div>
                    )}
                    <div className="rental-categories__panel-copy">
                      <h3 className="rental-categories__panel-title">{cat.title}</h3>
                      <ul className="rental-categories__examples">
                        {cat.examples.map((ex) => (
                          <li key={ex}>{ex}</li>
                        ))}
                      </ul>
                      <a href={rentalHero.primaryCta.href} className="rental-categories__cta">
                        {rentalHero.primaryCta.label}
                        <span aria-hidden> →</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="rental-categories__foot">{active.title} — {rentalCategories.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
