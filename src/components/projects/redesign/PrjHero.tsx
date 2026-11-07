import { prjBar, prjHero } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";
import { PrjPicture } from "./PrjPicture";

export function PrjHero() {
  return (
    <>
      <section className="prj-hero" aria-labelledby="prj-hero-title">
        <div className="prj-hero__copy">
          <p className="prj-eyebrow">{prjHero.eyebrow}</p>
          <h1 id="prj-hero-title" className="prj-h1">
            {prjHero.titleLines.map((line) => (
              <span key={line} className="prj-line">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="prj-hero__lead">{prjHero.lead}</p>
          <div className="prj-hero__actions">
            <a href={prjHero.primary.href} className="prj-btn prj-btn--yellow">
              {prjHero.primary.label}
              <PrjIcon name="arrowDown" className="prj-btn__icon" />
            </a>
            <a href={prjHero.secondary.href} className="prj-btn prj-btn--ghost">
              {prjHero.secondary.label}
              <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
            </a>
          </div>
        </div>
        <PrjPicture
          id={prjHero.image.id}
          alt={prjHero.image.alt}
          scene="hero"
          priority
          sizes="(max-width: 900px) 100vw, 52vw"
          caption={prjHero.image.caption}
          className="prj-hero__visual"
        />
      </section>

      <nav className="prj-bar" aria-label="Accès rapide aux sections">
        <ul className="prj-bar__list">
          {prjBar.map((item) => (
            <li key={item.href} className="prj-bar__item">
              <a href={item.href} className="prj-bar__link">
                <span className="prj-bar__number">{item.number}</span>
                <span className="prj-bar__label">{item.label}</span>
                <PrjIcon name="arrowDown" className="prj-bar__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}