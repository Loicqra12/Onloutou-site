"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { psmHero, psmImages } from "@/content/platform-page";
import { PsmIcon } from "./PsmIcon";
import { PsmPhoneMock, PsmWindowMock } from "./PsmMock";
import { onTabKeyDown } from "./tabKeys";

const tabId = (i: number) => `psm-hero-tab-${i}`;
const panelId = "psm-hero-panel";

export function PsmHero() {
  const [active, setActive] = useState(0);
  const tab = psmHero.tabs[active];

  return (
    <section className="psm-hero" id="types-plateformes" aria-labelledby="psm-hero-title">
      <div className="psm-wrap">
        <div className="psm-hero-head">
          <p className="psm-kicker">{psmHero.kicker}</p>
          <h1 id="psm-hero-title" className="psm-h1">
            {psmHero.titleLines.map((line) => (
              <span key={line} className="psm-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="psm-lead">{psmHero.lead}</p>
        </div>

        <div className="psm-hero-grid">
          <div className="psm-hero-copy">
            <div className="psm-hero-tabs" role="tablist" aria-label="Types d’interfaces">
              {psmHero.tabs.map((t, i) => (
                <button
                  key={t.id}
                  id={tabId(i)}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={panelId}
                  tabIndex={i === active ? 0 : -1}
                  className="psm-hero-tab"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i, psmHero.tabs.length, setActive, tabId, "both")}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="psm-hero-content" role="tabpanel" id={panelId} aria-labelledby={tabId(active)} key={tab.id}>
              <h2 className="psm-hero-subtitle">
                {tab.title.map((line) => (
                  <span key={line} className="psm-line">
                    {line}
                  </span>
                ))}
              </h2>
              <ul className="psm-hero-points">
                {tab.items.map((item) => (
                  <li key={item.title}>
                    <span className="psm-icon-disc" aria-hidden="true">
                      <PsmIcon name={item.icon} />
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={psmHero.cta.href} className="psm-btn psm-btn--yellow">
                {psmHero.cta.label}
                <PsmIcon name="arrowUpRight" strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          <figure className="psm-hero-visual">
            <div className="psm-hero-stage" key={tab.id}>
              {tab.id === "web" ? (
                <Image
                  src={psmImages.hero.src}
                  alt={psmImages.hero.alt}
                  width={psmImages.hero.width}
                  height={psmImages.hero.height}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
              ) : null}
              {tab.id === "dashboard" ? (
                <Image
                  src={psmImages.dashboard.src}
                  alt={psmImages.dashboard.alt}
                  width={psmImages.dashboard.width}
                  height={psmImages.dashboard.height}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              ) : null}
              {tab.id === "mobile" ? <PsmPhoneMock label="Exemple illustratif : application mobile « Mes interventions »." /> : null}
              {tab.id === "partenaire" ? (
                <PsmWindowMock variant="partenaire" label="Exemple illustratif : espace partenaire." />
              ) : null}
              {tab.id === "livreur" ? <PsmWindowMock variant="livreur" label="Exemple illustratif : espace livreur." /> : null}
              {tab.id === "portail" ? <PsmWindowMock variant="portail" label="Exemple illustratif : portail client." /> : null}
            </div>
            <figcaption>
              <span className="psm-hero-note">{psmHero.note}</span>
              <span className="psm-hero-disclaimer">{psmHero.disclaimer}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
