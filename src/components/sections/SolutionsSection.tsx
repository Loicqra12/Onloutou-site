"use client";

import { useState } from "react";
import { solutionPillars, solutionsIntro } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

function RentalVisual() {
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-[var(--radius-card)] bg-brand-yellow">
      <div className="absolute left-7 top-9 flex h-[100px] w-[105px] flex-col items-center justify-center rounded-xl bg-white font-bold shadow-md -rotate-6 sm:h-[126px] sm:w-[132px]">
        <span className="text-3xl" aria-hidden>▣</span>
        <small className="text-[10px]">Électroménager</small>
      </div>
      <div className="absolute right-8 top-12 flex h-[100px] w-[105px] flex-col items-center justify-center rounded-xl bg-white font-bold shadow-md rotate-6 sm:h-[126px] sm:w-[132px]">
        <span className="text-3xl" aria-hidden>⚒</span>
        <small className="text-[10px]">Équipement</small>
      </div>
      <div className="absolute bottom-5 right-16 flex h-[100px] w-[105px] flex-col items-center justify-center rounded-xl bg-white font-bold shadow-md -rotate-3 sm:h-[126px] sm:w-[132px]">
        <span className="text-3xl" aria-hidden>▰</span>
        <small className="text-[10px]">Engins</small>
      </div>
      <div className="absolute left-1/2 top-1/2 z-[2] flex h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-brand-ink text-center text-white sm:h-[210px] sm:w-[210px]">
        <small className="text-[9px] uppercase tracking-[0.15em] text-[#999999]">Catalogue</small>
        <strong className="mt-1 font-display text-xl font-extrabold leading-tight">
          Tout devient
          <br />
          accessible.
        </strong>
        <span className="mt-1 text-brand-yellow" aria-hidden>→</span>
      </div>
    </div>
  );
}

function ConnectVisual() {
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-[var(--radius-card)] bg-brand-ink">
      <div className="absolute left-1/2 top-1/2 h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3c3c3c]">
        <span className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#333333]" />
        <span className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#333333]" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-yellow text-2xl">
          ⌖
        </span>
      </div>
      <div className="absolute left-10 top-11 rounded-lg bg-white px-3 py-2 text-[10px]">
        Véhicule 024 <strong className="block text-[#148258]">En ligne</strong>
      </div>
      <div className="absolute right-10 top-24 rounded-lg bg-white px-3 py-2 text-[10px]">
        Balise 118 <strong className="block text-[#148258]">Active</strong>
      </div>
      <div className="absolute bottom-9 left-16 rounded-lg bg-white px-3 py-2 text-[10px]">
        Zone 03 <strong className="block text-[#148258]">Sécurisée</strong>
      </div>
    </div>
  );
}

function BuildVisual() {
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-[var(--radius-card)] bg-[#171717]">
      <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#383838] bg-[#242424] text-[#eeeeee] shadow-2xl">
        <div className="border-b border-[#393939] px-3 py-2.5">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-yellow" />
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#666666]" />
          <span className="inline-block h-2 w-2 rounded-full bg-[#666666]" />
        </div>
        <p className="p-5 font-mono text-sm leading-relaxed">
          <b className="text-brand-yellow">ONLOUTOU</b>.connect({"{"}
          <br />
          &nbsp;&nbsp;fleet: <em className="text-[#78dba7]">&quot;live&quot;</em>,
          <br />
          &nbsp;&nbsp;insights: <em className="text-[#78dba7]">true</em>
          <br />
          {"}"});
        </p>
      </div>
      <span className="absolute left-6 top-10 rounded-full bg-brand-yellow px-3 py-2 text-[10px] font-extrabold">
        API
      </span>
      <span className="absolute right-6 top-20 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold">
        Mobile
      </span>
      <span className="absolute bottom-8 right-11 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold">
        Dashboard
      </span>
    </div>
  );
}

const visuals = {
  louer: RentalVisual,
  connecter: ConnectVisual,
  construire: BuildVisual,
};

export function SolutionsSection() {
  const [activeId, setActiveId] = useState(solutionPillars[0].id);
  const active =
    solutionPillars.find((pillar) => pillar.id === activeId) ?? solutionPillars[0];
  const Visual = visuals[active.id as keyof typeof visuals];

  return (
    <section id="solutions" className="bg-brand-paper py-20 sm:py-28">
      <div className="container-content">
        <SectionHeading
          number={solutionsIntro.number}
          eyebrow={solutionsIntro.eyebrow}
          title={solutionsIntro.title}
          markerHighlight={solutionsIntro.titleHighlight}
          description={solutionsIntro.description}
        />
        <div
          role="tablist"
          aria-label="Solutions ONLOUTOU"
          className="grid grid-cols-3 border-b border-[#c8c5bc]"
        >
          {solutionPillars.map((pillar, index) => {
            const selected = pillar.id === activeId;
            return (
              <button
                key={pillar.id}
                id={`tab-${pillar.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${pillar.id}`}
                tabIndex={selected ? 0 : -1}
                className={`relative py-4 text-left text-sm font-bold sm:text-base ${
                  selected ? "text-brand-ink" : "text-[#8a8a8a]"
                }`}
                onClick={() => setActiveId(pillar.id)}
                onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                  event.preventDefault();
                  const direction = event.key === "ArrowRight" ? 1 : -1;
                  const next =
                    solutionPillars[
                      (index + direction + solutionPillars.length) %
                        solutionPillars.length
                    ];
                  setActiveId(next.id);
                  document.getElementById(`tab-${next.id}`)?.focus();
                }}
              >
                <span className="mr-2 hidden text-[10px] sm:inline">{pillar.number}</span>
                {pillar.tabLabel}
                <span
                  className={`tab-indicator absolute bottom-0 left-0 h-0.5 bg-brand-yellow ${
                    selected ? "w-[calc(100%-1.25rem)]" : "w-0"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
        {solutionPillars.map((pillar) => {
          const isActive = pillar.id === activeId;
          return (
            <div
              key={pillar.id}
              id={`panel-${pillar.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${pillar.id}`}
              hidden={!isActive}
              className="grid items-center gap-10 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16"
            >
              <div className={isActive ? "tab-panel-fade" : ""}>
                <Tag>{pillar.tag}</Tag>
                <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight text-brand-ink sm:text-4xl">
                  <span>{pillar.tabLabel}</span>
                  {" · "}
                  {pillar.title}
                </h3>
                <p className="mt-4 text-brand-muted">{pillar.description}</p>
                <ul className="mt-4 space-y-0 border-t border-[#ddd9ce]">
                  {pillar.bullets.map((item) => (
                    <li
                      key={item}
                      className="border-b border-[#ddd9ce] py-2.5 text-sm before:mr-2 before:text-[#ad8a00] before:content-['↗']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-[var(--radius-card)] border border-brand-border bg-brand-white p-4 shadow-[var(--shadow-card)]">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-muted">
                    Domaines couverts
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-brand-ink">
                    {pillar.activityDomains.map((domain) => (
                      <li key={domain}>{domain}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {isActive && Visual ? <Visual /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
