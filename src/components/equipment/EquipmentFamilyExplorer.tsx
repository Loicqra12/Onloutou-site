"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import {
  TOOLS_FAMILY_PREFILL_KEY,
  toolsEquipmentFamilies,
  toolsFamilyRequestLabels,
  type ToolsFamilyId,
} from "@/content/tools-equipment-page";

function prepareFamilyRequest(familyId: ToolsFamilyId) {
  try {
    sessionStorage.setItem(TOOLS_FAMILY_PREFILL_KEY, familyId);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("onloutou-tools-family", { detail: familyId }));
  document.getElementById("demande-materiel")?.scrollIntoView({ behavior: "smooth" });
}

export function EquipmentFamilyExplorer() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = toolsEquipmentFamilies.items;

  useEffect(() => {
    rootRef.current?.classList.add("tem-families--enhanced");
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    }
  };

  return (
    <section
      id={toolsEquipmentFamilies.id}
      className="tem-families section-spacing bg-brand-white scroll-mt-28"
      aria-labelledby="tem-families-title"
      ref={rootRef}
    >
      <div className="container-content">
        <Reveal>
          <h2 id="tem-families-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {toolsEquipmentFamilies.title}
          </h2>
        </Reveal>

        <div className="tem-families__layout">
          <div role="tablist" aria-label="Familles de matériels" className="tem-families__nav" onKeyDown={onKeyDown}>
            {items.map((family, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={family.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${family.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${family.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`tem-families__nav-btn${selected ? " tem-families__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="tem-families__nav-num">{family.number}</span>
                  {family.title}
                </button>
              );
            })}
          </div>

          <div className="tem-families__stage">
            {items.map((family, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={family.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${family.id}`}
                  aria-labelledby={`${baseId}-tab-${family.id}`}
                  className={`tem-families__panel${selected ? " tem-families__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <FamilyDetail family={family} onPrepare={() => prepareFamilyRequest(family.id)} />
                </article>
              );
            })}
          </div>

          <div className="tem-families__stack">
            {items.map((family) => (
              <article key={family.id} className="tem-families__stack-item">
                <h3>
                  <span className="tem-families__nav-num">{family.number}</span>
                  {family.title}
                </h3>
                <FamilyDetail family={family} onPrepare={() => prepareFamilyRequest(family.id)} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyDetail({
  family,
  onPrepare,
}: {
  family: (typeof toolsEquipmentFamilies.items)[number];
  onPrepare: () => void;
}) {
  return (
    <div className="tem-families__detail">
      <p>{family.description}</p>
      {family.examples.length > 0 && (
        <>
          <p className="tem-families__label">Exemples indicatifs</p>
          <ul>
            {family.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </>
      )}
      <p className="tem-families__label">Contextes d’usage</p>
      <ul>
        {family.contexts.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="tem-families__label">Questions à clarifier</p>
      <ul>
        {family.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <button type="button" className="tem-families__cta" onClick={onPrepare}>
        Préparer une demande — {toolsFamilyRequestLabels[family.id]}
      </button>
    </div>
  );
}
