"use client";

import Image from "next/image";
import { mopDaily, mopForm, mopImage, mopImageSize, mopProfilesSection, mopUsages } from "@/content/motos-hub";
import { useMop } from "./MopContext";
import { MopIcon } from "./MopIcon";

export function MopProfiles() {
  const t = useMop();
  const s = mopProfilesSection;
  return (
    <section id={s.id} className="mop-section mop-profiles" aria-labelledby="mop-profiles-title">
      <div className="mop-wrap">
        <p className="mop-kicker">{s.kicker}</p>
        <h2 id="mop-profiles-title" className="mop-h2">
          {s.title}
        </h2>
        <ul className="mop-profiles__grid">
          {mopUsages.map((u) => {
            const [w, h] = mopImageSize[u.image];
            const on = t.usage === u.id;
            return (
              <li key={u.id}>
                <button
                  type="button"
                  className={on ? "mop-card is-on" : "mop-card"}
                  aria-pressed={on}
                  aria-label={`${u.label} : ${s.cta.toLowerCase()}`}
                  onClick={() => t.chooseUsage(u.id)}
                >
                  <span className={`mop-card__media mop-tone--${u.tone}`}>
                    <Image src={mopImage(u.image)} alt={u.alt} width={w} height={h} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 90vw" className="mop-card__img" />
                  </span>
                  <span className="mop-card__body">
                    <strong>{u.label}</strong>
                    <span>{u.text}</span>
                    <span className="mop-card__cta">
                      {s.cta}
                      <MopIcon name="arrowRight" strokeWidth={1.8} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function MopDaily() {
  const t = useMop();
  const d = mopDaily;
  const [w, h] = mopImageSize[d.image.id];
  return (
    <>
      <section className="mop-daily" aria-labelledby="mop-daily-title">
        <div className="mop-wrap mop-daily__grid">
          <div className="mop-daily__main">
            <h2 id="mop-daily-title" className="mop-h2 mop-h2--daily">
              {d.titleLines.map((l) => (
                <span key={l} className="mop-line">
                  {l}{" "}
                </span>
              ))}
            </h2>
            <ul className="mop-daily__cards">
              {d.cards.map((c) => (
                <li key={c.title}>
                  <MopIcon name={c.icon} strokeWidth={1.4} />
                  <div>
                    <strong>{c.title}</strong>
                    <span>{c.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mop-daily__photo">
            <Image src={mopImage(d.image.id)} alt={d.image.alt} width={w} height={h} sizes="(min-width: 900px) 34vw, 90vw" className="mop-daily__img" />
          </div>
        </div>
      </section>

      <div className="mop-wrap mop-bannerwrap">
        <div className="mop-banner">
          <MopIcon name="notePen" strokeWidth={1.3} className="mop-banner__icon" />
          <p>
            <strong>{d.banner.title}</strong>
            <span>{d.banner.text}</span>
          </p>
          <a
            href={`#${mopForm.id}`}
            className="mop-btn mop-btn--yellow mop-btn--sm"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo(mopForm.id);
            }}
          >
            {d.banner.cta}
            <MopIcon name="arrowRight" />
          </a>
        </div>
      </div>
    </>
  );
}
