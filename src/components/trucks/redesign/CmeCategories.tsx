"use client";

import Image from "next/image";
import { cmeCategories, cmeCategoriesSection, cmeCatalog, cmeForm, cmeImage, cmeImageSize } from "@/content/trucks-hub";
import { useCme } from "./CmeContext";
import { CmeIcon } from "./CmeIcon";

export function CmeCategories() {
  const t = useCme();
  return (
    <section id="categories" className="cme-section cme-categories" aria-labelledby="cme-categories-title">
      <div className="cme-wrap">
        <p className="cme-kicker">{cmeCategoriesSection.kicker}</p>
        <h2 id="cme-categories-title" className="cme-h2">
          {cmeCategoriesSection.title}
        </h2>
        <ul className="cme-categories__grid">
          {cmeCategories.map((c) => {
            const [w, h] = cmeImageSize[c.image];
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className="cme-cat"
                  aria-label={`${c.label} : voir les équipements`}
                  onClick={() => {
                    t.selectCategory(c.id);
                    t.scrollTo(cmeCatalog.id);
                  }}
                >
                  <span className={`cme-cat__media cme-tone--${c.tone}`}>
                    <Image
                      src={cmeImage(c.image)}
                      alt=""
                      width={w}
                      height={h}
                      sizes="(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="cme-cat__img"
                    />
                  </span>
                  <span className="cme-cat__body">
                    <span className="cme-cat__title">
                      <span>{c.label}</span>
                      <CmeIcon name="arrowRight" strokeWidth={1.8} />
                    </span>
                    <span className="cme-cat__text">{c.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cme-banner">
          <CmeIcon name="helmet" strokeWidth={1.3} className="cme-banner__icon" />
          <p>
            <strong>{cmeCategoriesSection.banner.title}</strong>
            <span>{cmeCategoriesSection.banner.text}</span>
          </p>
          <a
            href={`#${cmeForm.id}`}
            className="cme-btn cme-btn--yellow cme-btn--sm"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo(cmeForm.id);
            }}
          >
            {cmeCategoriesSection.banner.cta}
            <CmeIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}
