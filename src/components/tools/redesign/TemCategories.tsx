"use client";

import Image from "next/image";
import { temCategories, temCategoriesSection, temImage } from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemIcon } from "./TemIcon";

export function TemCategories() {
  const t = useTem();
  return (
    <section id="categories" className="tem-section tem-categories" aria-labelledby="tem-categories-title">
      <div className="tem-wrap">
        <p className="tem-kicker">{temCategoriesSection.kicker}</p>
        <h2 id="tem-categories-title" className="tem-h2">
          {temCategoriesSection.title}
        </h2>
        <ul className="tem-categories__grid">
          {temCategories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="tem-cat"
                onClick={() => {
                  t.selectCategory(c.id);
                  t.scrollTo("familles-materiels");
                }}
                aria-label={`${c.label} : voir les équipements`}
              >
                <span className="tem-cat__media">
                  <Image
                    src={temImage(c.image)}
                    alt=""
                    width={420}
                    height={300}
                    sizes="(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="tem-cat__img"
                  />
                </span>
                <span className="tem-cat__label">
                  <span>{c.label}</span>
                  <TemIcon name="arrowRight" strokeWidth={1.8} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="tem-banner">
          <TemIcon name="headset" strokeWidth={1.4} className="tem-banner__icon" />
          <p>
            <strong>{temCategoriesSection.banner.title}</strong>
            <span>{temCategoriesSection.banner.text}</span>
          </p>
          <a
            href="#demande-materiel"
            className="tem-btn tem-btn--ghost"
            onClick={(e) => {
              e.preventDefault();
              t.scrollTo("demande-materiel");
            }}
          >
            {temCategoriesSection.banner.cta}
            <TemIcon name="arrowRight" strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
