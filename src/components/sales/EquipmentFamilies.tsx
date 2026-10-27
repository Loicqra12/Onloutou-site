"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { imageCategoryDisclaimer, salesFamilies, type SalesFamilyId } from "@/content/sales-page";

export function EquipmentFamilies() {
  const baseId = useId();
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<SalesFamilyId>("vehicules");

  useEffect(() => {
    shellRef.current?.classList.add("sales-families--enhanced");
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const match = salesFamilies.items.find((item) => item.id === hash);
      if (match) setActiveId(match.id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const selectFamily = (id: SalesFamilyId) => {
    setActiveId(id);
    if (window.location.hash.replace(/^#/, "") !== id) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const ids = salesFamilies.items.map((item) => item.id);
    const current = ids.indexOf(activeId);
    if (current < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectFamily(ids[(current + 1) % ids.length]);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectFamily(ids[(current - 1 + ids.length) % ids.length]);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectFamily(ids[0]);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectFamily(ids[ids.length - 1]);
    }
  };

  return (
    <section
      id={salesFamilies.id}
      className="sales-families section-spacing scroll-mt-28"
      aria-labelledby="sales-families-title"
    >
      <div className="container-content">
        <Reveal className="sales-families__intro">
          <div>
            <p className="sales-eyebrow">Familles d’équipements</p>
            <TitleReveal as="h2" id="sales-families-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <MarkedPhrase text={salesFamilies.title} highlight={salesFamilies.titleHighlight} />
            </TitleReveal>
          </div>
          <p className="sales-families__note">{salesFamilies.heavyNote}</p>
        </Reveal>

        <div ref={shellRef} className="sales-families__shell">
          <div
            role="tablist"
            aria-label="Familles d’équipements"
            className="sales-families__tabs"
            onKeyDown={onTabKey}
          >
            {salesFamilies.items.map((family) => {
              const selected = family.id === activeId;
              return (
                <button
                  key={family.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${family.id}`}
                  aria-selected={selected}
                  aria-controls={family.id}
                  tabIndex={selected ? 0 : -1}
                  className={`sales-families__tab${selected ? " sales-families__tab--active" : ""}`}
                  onClick={() => selectFamily(family.id)}
                >
                  <span className="sales-families__tab-media">
                    <Image
                      src={family.image.src}
                      alt=""
                      width={family.image.width}
                      height={family.image.height}
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="sales-families__tab-img"
                      style={{ objectPosition: family.image.objectPosition }}
                    />
                  </span>
                  <span className="sales-families__tab-label">
                    {family.title}
                    <span aria-hidden> ↗</span>
                  </span>
                </button>
              );
            })}
          </div>

          {salesFamilies.items.map((family) => {
            const selected = family.id === activeId;
            return (
              <div
                key={family.id}
                role="tabpanel"
                id={family.id}
                aria-labelledby={`${baseId}-tab-${family.id}`}
                aria-hidden={!selected}
                className={`sales-families__panel${selected ? " sales-families__panel--active" : ""}`}
              >
                <div className="sales-families__panel-inner">
                  <h3 className="sales-families__panel-title">{family.title}</h3>
                  <ul className="sales-families__examples">
                    {family.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <p className="sales-families__disclaimer">{imageCategoryDisclaimer}</p>
      </div>
    </section>
  );
}
