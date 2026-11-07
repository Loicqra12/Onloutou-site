"use client";

import Image from "next/image";
import { cnxHero, cnxIds, cnxImage, cnxImageSize } from "@/content/connected-hub";
import { useCnx } from "./CnxContext";
import { CnxIcon } from "./CnxIcon";

export function CnxHero() {
  const t = useCnx();
  const [w, h] = cnxImageSize[cnxHero.image.id];
  return (
    <section className="cnx-hero" aria-labelledby="cnx-hero-title">
      <div className="cnx-hero__bg" aria-hidden="true" />
      <Image src={cnxImage(cnxHero.image.id)} alt={cnxHero.image.alt} width={w} height={h} priority sizes="(min-width: 1100px) 62vw, 100vw" className="cnx-hero__img" />
      <div className="cnx-hero__shade" aria-hidden="true" />
      <div className="cnx-wrap cnx-hero__copy">
        <p className="cnx-kicker">{cnxHero.eyebrow}</p>
        <h1 id="cnx-hero-title" className="cnx-h1">
          {cnxHero.titleLines.map((l) => (
            <span key={l} className="cnx-line">
              {l}{" "}
            </span>
          ))}
          <span className="cnx-line">
            <span className="cnx-underline">{cnxHero.titleUnderline}</span>
          </span>
        </h1>
        <p className="cnx-hero__lead">{cnxHero.lead}</p>
        <div className="cnx-hero__actions">
          <a
            href={`#${cnxIds.form}`}
            className="cnx-btn cnx-btn--yellow"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo(cnxIds.form);
            }}
          >
            {cnxHero.primary}
            <CnxIcon name="arrowUpRight" />
          </a>
          <a
            href={`#${cnxIds.devices}`}
            className="cnx-btn cnx-btn--ghost"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo(cnxIds.devices);
            }}
          >
            {cnxHero.secondary}
            <CnxIcon name="arrowDown" />
          </a>
        </div>
      </div>
    </section>
  );
}
