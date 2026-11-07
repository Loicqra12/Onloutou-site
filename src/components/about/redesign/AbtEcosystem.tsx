import Image from "next/image";
import Link from "next/link";
import { abtBand, abtEcosystem, abtIds, abtImages } from "@/content/about-hub";
import { AbtLink } from "./AbtHero";
import { AbtIcon } from "./AbtIcon";

export function AbtEcosystem() {
  const e = abtEcosystem;
  return (
    <>
      <section id={abtIds.projects} className="abt-eco" aria-labelledby="abt-eco-title">
        <p className="abt-eyebrow">{e.eyebrow}</p>
        <h2 id="abt-eco-title" className="abt-h2">
          {e.title}
        </h2>
        <p className="abt-eco__lead">{e.lead}</p>

        <article className="abt-featured">
          <div className="abt-featured__pic">
            <Image
              src={abtImages.chapechape.src}
              alt={e.featured.alt}
              width={abtImages.chapechape.width}
              height={abtImages.chapechape.height}
              sizes="(max-width: 700px) 100vw, 46vw"
              className="abt-featured__img"
            />
            <span className="abt-pill-dark">{e.featured.caption}</span>
          </div>
          <div className="abt-featured__body">
            <h3 className="abt-featured__title">{e.featured.title}</h3>
            <span className="abt-tag">{e.featured.badge}</span>
            <p className="abt-featured__text">{e.featured.text}</p>
            <p className="abt-featured__tags">{e.featured.tags}</p>
            <Link href={e.featured.cta.href} className="abt-btn abt-btn--yellow">
              {e.featured.cta.label}
              <AbtIcon name="arrowUpRight" className="abt-btn__icon" />
            </Link>
          </div>
        </article>

        <h2 className="abt-h2 abt-h2--md abt-eco__sub">{e.collab.title}</h2>
        <ul className="abt-rows">
          {e.collab.items.map((item) => (
            <li key={item.name} className="abt-row">
              <span className="abt-row__name">{item.name}</span>
              <span className="abt-row__text">{item.text}</span>
              <span className="abt-tag">{e.collab.badge}</span>
            </li>
          ))}
        </ul>
        <p className="abt-eco__note">{e.collab.note}</p>
      </section>

      <section className="abt-init" aria-labelledby="abt-init-title">
        <h2 id="abt-init-title" className="abt-h2 abt-h2--light abt-h2--md">
          {e.initiatives.title}
        </h2>
        <ul className="abt-init__grid">
          {e.initiatives.items.map((item) => (
            <li key={item.name} className="abt-init__card">
              <span className="abt-circle">
                <AbtIcon name={item.icon} />
              </span>
              <div>
                <h3 className="abt-init__name">{item.name}</h3>
                <span className="abt-tag">{item.badge}</span>
                <p className="abt-init__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <AbtLink href={e.initiatives.cta.href} light>
          {e.initiatives.cta.label}
        </AbtLink>
      </section>

      <section className="abt-needs" aria-labelledby="abt-needs-title">
        <h2 id="abt-needs-title" className="abt-h2 abt-h2--md">
          {e.needs.title}
        </h2>
        <p className="abt-needs__lead">{e.needs.lead}</p>
        <ul className="abt-needs__grid">
          {e.needs.items.map((item) => (
            <li key={item.label} className="abt-need">
              <span className="abt-circle">
                <AbtIcon name={item.icon} />
              </span>
              <span className="abt-need__label">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="abt-needs__foot">
          <p className="abt-needs__note">{e.needs.note}</p>
          <Link href={e.needs.cta.href} className="abt-btn abt-btn--yellow">
            {e.needs.cta.label}
            <AbtIcon name="arrowUpRight" className="abt-btn__icon" />
          </Link>
        </div>
      </section>

      <section className="abt-band" aria-labelledby="abt-band-title">
        <h2 id="abt-band-title" className="abt-h2 abt-h2--light abt-h2--md">
          {abtBand.title}
        </h2>
        <div className="abt-band__actions">
          <Link href={abtBand.primary.href} className="abt-btn abt-btn--yellow">
            {abtBand.primary.label}
            <AbtIcon name="arrowUpRight" className="abt-btn__icon" />
          </Link>
          <Link href={abtBand.secondary.href} className="abt-textlink abt-textlink--light">
            {abtBand.secondary.label}
            <AbtIcon name="arrowRight" className="abt-textlink__icon" />
          </Link>
        </div>
      </section>
    </>
  );
}