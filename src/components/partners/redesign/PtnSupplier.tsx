import Link from "next/link";
import { ptnSupBand, ptnSupFamilies, ptnSupHero, ptnSupOffer, ptnSupTagline } from "@/content/partners-subpages";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnSupHero() {
  return (
    <>
      <section className="ptn-hero ptn-hero--light ptn-hero--sup" aria-labelledby="ptn-sup-title">
        <div className="ptn-hero__copy">
          <p className="ptn-eyebrow">{ptnSupHero.eyebrow}</p>
          <h1 id="ptn-sup-title" className="ptn-h1">
            {ptnSupHero.titleLines.map((line) => (
              <span key={line} className="ptn-line">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="ptn-hero__lead">{ptnSupHero.lead}</p>
          <div className="ptn-hero__actions">
            <Link href={ptnSupHero.primary.href} className="ptn-btn ptn-btn--yellow">
              {ptnSupHero.primary.label}
              <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
            </Link>
            <a href={ptnSupHero.secondary.href} className="ptn-textlink ptn-textlink--dark">
              {ptnSupHero.secondary.label}
              <PtnIcon name="arrowDown" className="ptn-btn__icon" />
            </a>
          </div>
          <p className="ptn-hero__note">{ptnSupHero.note}</p>
        </div>
        <PtnPicture
          id={ptnSupHero.image.id}
          alt={ptnSupHero.image.alt}
          scene="warehouse"
          priority
          sizes="(max-width: 900px) 100vw, 55vw"
          className="ptn-hero__visual"
        />
      </section>
      <p className="ptn-tagline">{ptnSupTagline}</p>
    </>
  );
}

export function PtnSupFamilies() {
  return (
    <section id={ptnSupFamilies.id} className="ptn-sup-families" aria-labelledby="ptn-sup-families-title">
      <p className="ptn-eyebrow">{ptnSupFamilies.eyebrow}</p>
      <h2 id="ptn-sup-families-title" className="ptn-h2 ptn-h2--wide">
        {ptnSupFamilies.title}
      </h2>
      <p className="ptn-sup-families__lead">{ptnSupFamilies.lead}</p>
      <ul className="ptn-sup-grid">
        {ptnSupFamilies.items.map((item) => (
          <li key={item.label} className="ptn-sup-family">
            <PtnPicture
              id={item.image}
              alt={item.alt}
              scene={item.scene}
              sizes="(max-width: 700px) 90vw, 30vw"
              className="ptn-sup-family__pic"
            />
            <h3 className="ptn-sup-family__label">{item.label}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PtnSupOffer() {
  const example = ptnSupOffer.example;
  return (
    <section className="ptn-sup-offer" aria-labelledby="ptn-sup-offer-title">
      <div className="ptn-sup-offer__steps">
        <p className="ptn-eyebrow">{ptnSupOffer.eyebrow}</p>
        <h2 id="ptn-sup-offer-title" className="ptn-h2 ptn-h2--md">
          {ptnSupOffer.title}
        </h2>
        <ol className="ptn-sup-list">
          {ptnSupOffer.steps.map((step) => (
            <li key={step.number}>
              <span className="ptn-sup-list__num">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <article className="ptn-sup-example" aria-label={example.title}>
        <p className="ptn-sup-example__badge">{example.badge}</p>
        <div className="ptn-sup-example__body">
          <PtnPicture
            id={example.image.id}
            alt={example.image.alt}
            scene="warehouse"
            sizes="(max-width: 700px) 40vw, 14vw"
            className="ptn-sup-example__pic"
          />
          <div className="ptn-sup-example__copy">
            <h3>{example.title}</h3>
            <ul>
              {example.rows.map((row) => (
                <li key={row.label}>
                  <PtnIcon name={row.icon} className="ptn-sup-example__icon" />
                  <span>
                    <strong>{row.label} :</strong> {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}

export function PtnSupBand() {
  return (
    <section id={ptnSupBand.id} className="ptn-sup-band" aria-labelledby="ptn-sup-band-title">
      <div className="ptn-sup-band__copy">
        <p className="ptn-eyebrow">{ptnSupBand.eyebrow}</p>
        <h2 id="ptn-sup-band-title" className="ptn-sup-band__title">
          {ptnSupBand.title}
        </h2>
        <p className="ptn-sup-band__lead">{ptnSupBand.lead}</p>
        <div className="ptn-hero__actions">
          <Link href={ptnSupBand.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnSupBand.primary.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
          <Link href={ptnSupBand.secondary.href} className="ptn-textlink ptn-textlink--light ptn-textlink--yellow">
            {ptnSupBand.secondary.label}
            <PtnIcon name="arrowRight" className="ptn-btn__icon" />
          </Link>
        </div>
      </div>
      <PtnPicture
        id={ptnSupBand.image.id}
        alt={ptnSupBand.image.alt}
        scene="dark"
        sizes="(max-width: 900px) 100vw, 45vw"
        className="ptn-sup-band__visual"
      />
    </section>
  );
}