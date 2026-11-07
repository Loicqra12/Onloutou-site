import Link from "next/link";
import { prjDigital } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";
import { PrjPicture } from "./PrjPicture";

export function PrjDigital() {
  return (
    <section id={prjDigital.id} className="prj-digital" aria-labelledby="prj-digital-title">
      {/* Ancien repère /projets#plateformes : mène à cette section. */}
      <span id="plateformes" className="prj-alias" aria-hidden="true" />
      <header className="prj-head">
        <p className="prj-eyebrow prj-eyebrow--square">{prjDigital.eyebrow}</p>
        <h2 id="prj-digital-title" className="prj-h2">
          {prjDigital.titleLines.map((line) => (
            <span key={line} className="prj-line">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="prj-lead">{prjDigital.lead}</p>
      </header>

      {prjDigital.items.map((item) => (
        <article
          key={item.id}
          id={item.id}
          className={`prj-showcase${item.reverse ? " prj-showcase--reverse" : ""}`}
          aria-labelledby={`${item.id}-title`}
        >
          <PrjPicture
            id={item.image}
            alt={item.alt}
            scene={item.scene}
            sizes="(max-width: 900px) 100vw, 62vw"
            caption={item.caption}
            className="prj-showcase__pic"
          />
          <div className="prj-showcase__copy">
            <p className="prj-eyebrow">{item.kicker}</p>
            <h3 id={`${item.id}-title`} className="prj-h2 prj-h2--md">
              {item.title}
            </h3>
            <p className="prj-showcase__text">{item.text}</p>
            <ul className="prj-rows">
              {item.rows.map((row) => (
                <li key={row.label} className="prj-row">
                  <span className="prj-row__icon">
                    <PrjIcon name={row.icon} />
                  </span>
                  <p>
                    <strong>{row.label}</strong>
                    <span>{row.text}</span>
                  </p>
                </li>
              ))}
            </ul>
            <ul className="prj-chips">
              {item.chips.map((chip) => (
                <li key={chip} className="prj-chip">
                  {chip}
                </li>
              ))}
            </ul>
            {item.cta ? (
              <p className="prj-showcase__cta">
                <a
                  href={item.cta.href}
                  className="prj-btn prj-btn--yellow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.cta.label}
                  <span className="prj-sr"> (nouvel onglet)</span>
                  <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
                </a>
                <span className="prj-showcase__domain">{item.cta.note}</span>
              </p>
            ) : null}
          </div>
        </article>
      ))}

      <div className="prj-band prj-band--dark">
        <PrjIcon name="target" className="prj-band__icon" />
        <p className="prj-band__title">{prjDigital.band.title}</p>
        <Link href={prjDigital.band.cta.href} className="prj-link prj-link--light">
          {prjDigital.band.cta.label}
          <PrjIcon name="arrowUpRight" className="prj-link__icon" />
        </Link>
      </div>
    </section>
  );
}