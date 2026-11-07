"use client";

import Image from "next/image";
import { vhpForm, vhpImage, vhpImageSize, vhpProfiles, vhpProfilesSection } from "@/content/vehicles-hub";
import { useVhp } from "./VhpContext";
import { VhpIcon } from "./VhpIcon";

export function VhpProfiles() {
  const t = useVhp();
  const s = vhpProfilesSection;
  return (
    <section id={s.id} className="vhp-section vhp-profiles" aria-labelledby="vhp-profiles-title">
      <div className="vhp-wrap">
        <p className="vhp-kicker">{s.kicker}</p>
        <h2 id="vhp-profiles-title" className="vhp-h2">
          {s.title}
        </h2>
        <ul className="vhp-profiles__grid">
          {vhpProfiles.map((p) => {
            const [w, h] = vhpImageSize[p.image];
            const on = t.type === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={on ? "vhp-card is-on" : "vhp-card"}
                  aria-pressed={on}
                  aria-label={`${p.label} : ${s.cta.toLowerCase()}`}
                  onClick={() => t.chooseType(p.id)}
                >
                  <span className={`vhp-card__media vhp-tone--${p.tone}`}>
                    <Image src={vhpImage(p.image)} alt={p.alt} width={w} height={h} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw" className="vhp-card__img" />
                  </span>
                  <span className="vhp-card__body">
                    <strong>{p.label}</strong>
                    <span>{p.text}</span>
                    <span className="vhp-card__cta">
                      {s.cta}
                      <VhpIcon name="arrowRight" strokeWidth={1.8} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="vhp-banner">
          <VhpIcon name="notePen" strokeWidth={1.3} className="vhp-banner__icon" />
          <p>
            <strong>{s.banner.title}</strong>
            <span>{s.banner.text}</span>
          </p>
          <a
            href={`#${vhpForm.id}`}
            className="vhp-btn vhp-btn--yellow vhp-btn--sm"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo(vhpForm.id);
            }}
          >
            {s.banner.cta}
            <VhpIcon name="arrowUpRight" />
          </a>
        </div>

        <ul className="vhp-criteria" aria-label="Critères d’étude">
          {s.criteria.map((c) => (
            <li key={c.title}>
              <VhpIcon name={c.icon} strokeWidth={1.4} />
              <div>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
