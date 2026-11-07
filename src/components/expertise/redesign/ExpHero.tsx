import Link from "next/link";
import { expHero, expShortcuts } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";
import { ExpPicture } from "./ExpPicture";

export function ExpHero() {
  return (
    <>
      <section className="exp-hero" aria-labelledby="exp-hero-title">
        <div className="exp-hero__copy">
          <p className="exp-eyebrow">{expHero.eyebrow}</p>
          <h1 id="exp-hero-title" className="exp-h1">
            {expHero.titleLines.map((line) => (
              <span key={line} className="exp-h1__line">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="exp-hero__lead">{expHero.lead}</p>
          <div className="exp-hero__actions">
            <Link href={expHero.primary.href} className="exp-btn exp-btn--yellow">
              {expHero.primary.label}
              <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
            </Link>
            <a href={expHero.secondary.href} className="exp-link">
              {expHero.secondary.label}
              <ExpIcon name="arrowDown" className="exp-link__icon" />
            </a>
          </div>
        </div>
        <figure className="exp-hero__visual">
          <ExpPicture
            id={expHero.image.id}
            alt={expHero.image.alt}
            scene="hero"
            priority
            sizes="(max-width: 900px) 100vw, 54vw"
          />
          <figcaption className="exp-caption">{expHero.image.caption}</figcaption>
        </figure>
      </section>

      <nav className="exp-shortcuts" aria-label="Accès rapide aux expertises">
        <ul className="exp-shortcuts__list">
          {expShortcuts.map((item) => (
            <li key={item.href} className="exp-shortcuts__item">
              <a href={item.href} className="exp-shortcuts__link">
                <ExpIcon name={item.icon} className="exp-shortcuts__icon" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}