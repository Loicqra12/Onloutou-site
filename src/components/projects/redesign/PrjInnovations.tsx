import { prjInnovations } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";
import { PrjPicture } from "./PrjPicture";

export function PrjInnovations() {
  return (
    <section id={prjInnovations.id} className="prj-innov" aria-labelledby="prj-innov-title">
      {/* Ancien repère /projets#bazar-onloutou : mène à cette section. */}
      <span id="bazar-onloutou" className="prj-alias" aria-hidden="true" />
      <header className="prj-head">
        <p className="prj-eyebrow">{prjInnovations.eyebrow}</p>
        <h2 id="prj-innov-title" className="prj-h2">
          {prjInnovations.titleLines.map((line, index) => (
            <span key={line} className="prj-line">
              {line}
              {index === prjInnovations.titleLines.length - 1 ? <span className="prj-dot">.</span> : " "}
            </span>
          ))}
        </h2>
        <p className="prj-lead">{prjInnovations.lead}</p>
        <p className="prj-innov__note">{prjInnovations.note}</p>
      </header>

      {prjInnovations.mvps.map((item) => (
        <article
          key={item.id}
          id={item.id}
          className={`prj-showcase prj-showcase--mvp${item.reverse ? " prj-showcase--reverse" : ""}`}
          aria-labelledby={`${item.id}-title`}
        >
          <PrjPicture
            id={item.image}
            alt={item.alt}
            scene="dark"
            sizes="(max-width: 900px) 100vw, 62vw"
            caption={item.caption}
            className="prj-showcase__pic"
          />
          <div className="prj-showcase__copy">
            <span className="prj-badge prj-badge--yellow">{item.badge}</span>
            <h3 id={`${item.id}-title`} className="prj-h2 prj-h2--md">
              {item.title}
            </h3>
            <p className="prj-showcase__subtitle">{item.subtitle}</p>
            <p className="prj-showcase__text">{item.text}</p>
            <ul className="prj-chips">
              {item.chips.map((chip) => (
                <li key={chip.label} className="prj-chip">
                  <PrjIcon name={chip.icon} className="prj-chip__icon" />
                  {chip.label}
                </li>
              ))}
            </ul>
            <p className="prj-showcase__cta">
              <a href={item.cta.href} className="prj-btn prj-btn--yellow">
                {item.cta.label}
                <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
              </a>
            </p>
          </div>
        </article>
      ))}

      <ul className="prj-concepts">
        {prjInnovations.concepts.map((item) => (
          <li key={item.id} id={item.id} className="prj-concept">
            <PrjPicture
              id={item.image}
              alt={item.alt}
              scene={item.scene}
              sizes="(max-width: 700px) 92vw, 46vw"
              caption={item.caption}
              className="prj-concept__pic"
            />
            <div className="prj-concept__body">
              <span className="prj-badge prj-badge--soft">{item.badge}</span>
              <h3 className="prj-h3 prj-h3--lg">{item.title}</h3>
              {item.subtitle ? <p className="prj-concept__subtitle">{item.subtitle}</p> : null}
              <p className="prj-concept__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}