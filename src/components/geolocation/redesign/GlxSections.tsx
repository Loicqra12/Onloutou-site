import Image from "next/image";
import Link from "next/link";
import {
  glxCta,
  glxExplore,
  glxFeatures,
  glxField,
  glxInstall,
  glxPilotage,
  glxProcess,
  glxUsages,
} from "@/content/geolocation-hub";
import { GlxIcon } from "./GlxIcon";

export function GlxField() {
  return (
    <section className="glx-section glx-field" aria-labelledby="glx-field-title">
      <div className="glx-wrap glx-field__grid">
        <figure className="glx-field__media">
          <Image
            src={glxField.image.src}
            alt={glxField.image.alt}
            width={glxField.image.width}
            height={glxField.image.height}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
        </figure>
        <div className="glx-field__copy">
          <p className="glx-kicker">{glxField.kicker}</p>
          <h2 id="glx-field-title" className="glx-h2">
            {glxField.titleLines.map((l) => (
              <span key={l} className="glx-line">
                {l}
              </span>
            ))}
          </h2>
          <p className="glx-lead">{glxField.lead}</p>
          <ol className="glx-field__steps">
            {glxField.steps.map((step, i) => (
              <li key={step}>
                <a href="#installation-terrain">
                  <span className="glx-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="glx-field__label">{step}</span>
                  <GlxIcon name="chevronRight" />
                </a>
              </li>
            ))}
          </ol>
          <a className="glx-btn glx-btn--yellow" href={glxField.cta.href}>
            {glxField.cta.label}
            <GlxIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function GlxProcess() {
  return (
    <section id={glxProcess.id} className="glx-section glx-process" aria-labelledby="glx-process-title">
      <div className="glx-wrap">
        <p className="glx-kicker">{glxProcess.kicker}</p>
        <h2 id="glx-process-title" className="glx-h2 glx-h2--md">
          {glxProcess.title}
        </h2>
        <ol className="glx-process__grid">
          {glxProcess.steps.map((s) => (
            <li key={s.number}>
              <span className="glx-num glx-num--lg">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GlxFeatures() {
  return (
    <section id={glxFeatures.id} className="glx-section glx-features" aria-labelledby="glx-features-title">
      <div className="glx-wrap">
        <p className="glx-kicker">{glxFeatures.kicker}</p>
        <h2 id="glx-features-title" className="glx-h2 glx-h2--md">
          <span className="glx-underline">Les informations</span> qui comptent.
        </h2>
        <ul className="glx-features__grid">
          {glxFeatures.items.map((item) => (
            <li key={item.title}>
              <GlxIcon name={item.icon} strokeWidth={1.5} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <GlxIcon name="arrowRight" className="glx-features__arrow" />
            </li>
          ))}
        </ul>
        <p className="glx-note glx-note--bar">{glxFeatures.note}</p>
      </div>
    </section>
  );
}

export function GlxUsages() {
  return (
    <section className="glx-section glx-usages" aria-labelledby="glx-usages-title">
      <div className="glx-wrap">
        <p className="glx-kicker">{glxUsages.kicker}</p>
        <h2 id="glx-usages-title" className="glx-h2 glx-h2--md">
          {glxUsages.title}
        </h2>
        <ul className="glx-usages__grid">
          {glxUsages.cards.map((card) => (
            <li key={card.title}>
              <Link href={card.href} className="glx-usage">
                <span className="glx-usage__media">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    width={1200}
                    height={640}
                    sizes="(max-width: 700px) 100vw, 46vw"
                    style={{ objectPosition: card.image.position }}
                  />
                </span>
                <span className="glx-usage__body">
                  <span>
                    <strong>{card.title}</strong>
                    <small>{card.text}</small>
                  </span>
                  <GlxIcon name="arrowRight" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GlxInstall() {
  return (
    <section id={glxInstall.id} className="glx-section glx-install" aria-labelledby="glx-install-title">
      <div className="glx-wrap glx-install__grid">
        <div className="glx-install__copy">
          <p className="glx-kicker">{glxInstall.kicker}</p>
          <h2 id="glx-install-title" className="glx-h2">
            <span className="glx-line">{glxInstall.titleLines[0]}</span>
            <span className="glx-line">{glxInstall.titleLines[1]}</span>
            <span className="glx-line">
              <span className="glx-underline">{glxInstall.titleLines[2]}</span>
            </span>
          </h2>
          <p className="glx-lead">{glxInstall.lead}</p>
          <figure className="glx-install__media">
            <Image
              src={glxInstall.image.src}
              alt={glxInstall.image.alt}
              width={glxInstall.image.width}
              height={glxInstall.image.height}
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </figure>
        </div>
        <ol className="glx-install__steps">
          {glxInstall.steps.map((s) => (
            <li key={s.number}>
              <span className="glx-num glx-num--lg">{s.number}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <GlxIcon name="arrowRight" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GlxPilotage() {
  return (
    <section className="glx-pilotage" aria-labelledby="glx-pilotage-title">
      <div className="glx-wrap">
        <div className="glx-pilotage__box">
          <GlxIcon name="layers" strokeWidth={1.4} className="glx-pilotage__icon" />
          <div className="glx-pilotage__text">
            <h2 id="glx-pilotage-title">{glxPilotage.title}</h2>
            <p>{glxPilotage.text}</p>
          </div>
          <Link href={glxPilotage.cta.href} className="glx-btn glx-btn--yellow">
            {glxPilotage.cta.label}
            <GlxIcon name="arrowUpRight" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function GlxCta() {
  return (
    <section className="glx-cta" aria-labelledby="glx-cta-title">
      <Image
        src={glxCta.image.src}
        alt={glxCta.image.alt}
        width={glxCta.image.width}
        height={glxCta.image.height}
        sizes="100vw"
        className="glx-cta__img"
      />
      <div className="glx-wrap glx-cta__inner">
        <p className="glx-kicker">{glxCta.kicker}</p>
        <h2 id="glx-cta-title" className="glx-h2 glx-h2--cta">
          {glxCta.titleLines.map((l) => (
            <span key={l} className="glx-line">
              {l}
            </span>
          ))}
        </h2>
        <p className="glx-cta__lead">
          {glxCta.lead.map((l) => (
            <span key={l} className="glx-line">
              {l}
            </span>
          ))}
        </p>
        <div className="glx-cta__actions">
          <Link href={glxCta.primary.href} className="glx-btn glx-btn--yellow">
            {glxCta.primary.label}
            <GlxIcon name="arrowUpRight" />
          </Link>
          <a href={glxCta.phone.href} className="glx-btn glx-btn--ghost">
            {glxCta.phone.label}
            <GlxIcon name="arrowUpRight" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function GlxExplore() {
  return (
    <nav className="glx-explore" aria-labelledby="glx-explore-title">
      <div className="glx-wrap">
        <p id="glx-explore-title" className="glx-kicker">
          {glxExplore.kicker}
        </p>
        <ul className="glx-explore__list">
          {glxExplore.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <GlxIcon name={l.icon} strokeWidth={1.5} />
                <span>
                  {l.lines[0]}
                  <br />
                  {l.lines[1]}
                </span>
                <GlxIcon name="arrowRight" className="glx-explore__arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
