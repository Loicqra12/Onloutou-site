"use client";

import { useEffect, useId, useState } from "react";

type TocSection = { id: string; title: string };

type LegalTableOfContentsProps = {
  sections: readonly TocSection[];
  ariaLabel: string;
  topHref?: string;
};

export function LegalTableOfContents({
  sections,
  ariaLabel,
  topHref = "#leg-hero-title",
}: LegalTableOfContentsProps) {
  const panelId = useId();
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    function update() {
      const offset = 120;
      let current = sections[0]?.id ?? "";
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= offset) current = node.id;
      }
      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  function closeOnSmallScreen() {
    if (window.matchMedia("(max-width: 1023px)").matches) setOpen(false);
  }

  return (
    <nav className={`leg-toc${open ? " is-open" : ""}`} aria-label={ariaLabel}>
      <button
        type="button"
        className="leg-toc__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Sommaire</span>
        <span className="leg-toc__toggle-state">{open ? "Fermer" : "Ouvrir"}</span>
      </button>
      <div className="leg-toc__panel" id={panelId}>
        <p className="leg-toc__title">Sommaire</p>
        <ol className="leg-toc__list">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="leg-toc__link"
                aria-current={active === section.id ? "true" : undefined}
                onClick={closeOnSmallScreen}
              >
                <span className="leg-toc__num">{index + 1}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <a href={topHref} className="leg-toc__top" onClick={closeOnSmallScreen}>
          Retour en haut
        </a>
      </div>
    </nav>
  );
}
