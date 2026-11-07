"use client";

import Image from "next/image";
import { cnxChain, cnxDevicesSection, cnxIds, cnxImage, cnxImageSize } from "@/content/connected-hub";
import { useCnx } from "./CnxContext";
import { CnxIcon } from "./CnxIcon";

export function CnxDevices() {
  const t = useCnx();
  const s = cnxDevicesSection;
  return (
    <section id={cnxIds.devices} className="cnx-section cnx-devices" aria-labelledby="cnx-devices-title">
      <div className="cnx-wrap">
        <h2 id="cnx-devices-title" className="cnx-h2">
          {s.title}
        </h2>
        <ul className="cnx-devices__grid">
          {s.cards.map((c) => {
            const [w, h] = cnxImageSize[c.image];
            const on = t.config === c.id;
            return (
              <li key={c.id}>
                <button type="button" className={on ? "cnx-card is-on" : "cnx-card"} aria-pressed={on} aria-label={`${c.title} : ${s.cta.toLowerCase()}`} onClick={() => t.chooseDevice(c.id)}>
                  <span className="cnx-card__media">
                    <Image src={cnxImage(c.image)} alt={c.alt} width={w} height={h} sizes="(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 90vw" className="cnx-card__img" />
                  </span>
                  <span className="cnx-card__body">
                    <strong>{c.title}</strong>
                    <span>{c.text}</span>
                    <span className="cnx-card__cta">
                      {s.cta}
                      <CnxIcon name="arrowRight" strokeWidth={1.8} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="cnx-note">
          <CnxIcon name="info" strokeWidth={1.5} />
          {s.note}
        </p>
      </div>
    </section>
  );
}

export function CnxChain() {
  const t = useCnx();
  const c = cnxChain;
  return (
    <section id={cnxIds.chain} className="cnx-section cnx-chain" aria-labelledby="cnx-chain-title">
      <div className="cnx-wrap">
        <h2 id="cnx-chain-title" className="cnx-h2 cnx-h2--md">
          {c.title}
        </h2>
        <ol className="cnx-chain__list">
          {c.steps.map((s, i) => {
            const [w, h] = cnxImageSize[s.image];
            return (
              <li key={s.title} className="cnx-chain__item">
                <div className="cnx-chain__card">
                  <span className="cnx-chain__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <CnxIcon name={s.icon} strokeWidth={1.4} className="cnx-chain__icon" />
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </div>
                <div className={`cnx-chain__photo cnx-tone--${s.tone}`}>
                  <Image src={cnxImage(s.image)} alt={s.alt} width={w} height={h} sizes="(min-width: 1100px) 16vw, 40vw" className="cnx-chain__img" />
                </div>
                {i < c.steps.length - 1 ? <CnxIcon name="arrowRight" strokeWidth={1.8} className="cnx-chain__arrow" /> : null}
              </li>
            );
          })}
        </ol>

        <div className="cnx-practical">
          <div className="cnx-practical__main">
            <h3>{c.practical.title}</h3>
            <ul>
              {c.practical.items.map((it) => (
                <li key={it.title}>
                  <span className="cnx-practical__icon" aria-hidden="true">
                    <CnxIcon name={it.icon} strokeWidth={1.5} />
                  </span>
                  <div>
                    <strong>{it.title}</strong>
                    <span>{it.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="cnx-practical__cta" onClick={t.haveEquipment}>
            <strong>{c.practical.cardTitle}</strong>
            <span>
              {c.practical.cardText}
              <CnxIcon name="arrowUpRight" strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
