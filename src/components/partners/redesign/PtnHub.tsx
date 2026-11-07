import Link from "next/link";
import { ptnBanner, ptnHubHero, ptnProcess, ptnProfiles, ptnProposalHref, ptnSpaces } from "@/content/partners-hub";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnHubHero() {
  return (
    <section className="ptn-hero" aria-labelledby="ptn-hero-title">
      <div className="ptn-hero__copy">
        <p className="ptn-eyebrow">{ptnHubHero.eyebrow}</p>
        <h1 id="ptn-hero-title" className="ptn-h1">
          {ptnHubHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnHubHero.lead}</p>
        <div className="ptn-hero__actions">
          <Link href={ptnHubHero.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnHubHero.primary.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
          <a href={ptnHubHero.secondary.href} className="ptn-textlink">
            {ptnHubHero.secondary.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
        </div>
      </div>
      <PtnPicture
        id={ptnHubHero.image.id}
        alt={ptnHubHero.image.alt}
        scene="hero"
        priority
        sizes="(max-width: 900px) 100vw, 60vw"
        className="ptn-hero__visual"
      />
    </section>
  );
}

export function PtnProfiles() {
  return (
    <section id={ptnProfiles.id} className="ptn-profiles" aria-labelledby="ptn-profiles-title">
      <p className="ptn-eyebrow">{ptnProfiles.eyebrow}</p>
      <h2 id="ptn-profiles-title" className="ptn-h2">
        {ptnProfiles.title}
      </h2>
      <ul className="ptn-cards">
        {ptnProfiles.items.map((item) => (
          <li key={item.id} id={`profil-${item.id}`} className="ptn-card">
            <PtnPicture id={item.image} alt={item.alt} scene={item.scene} sizes="(max-width: 700px) 40vw, 20vw" className="ptn-card__pic" />
            <div className="ptn-card__body">
              <h3 className="ptn-h3">{item.title}</h3>
              <p className="ptn-card__text">{item.text}</p>
              <Link href={ptnProposalHref(item.id)} className="ptn-cta">
                {item.cta}
                <PtnIcon name="arrowRight" className="ptn-cta__icon" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PtnProcess() {
  return (
    <section id={ptnProcess.id} className="ptn-process" aria-labelledby="ptn-process-title">
      <p className="ptn-eyebrow">{ptnProcess.eyebrow}</p>
      <h2 id="ptn-process-title" className="ptn-h2">
        {ptnProcess.title}
      </h2>
      <ol className="ptn-steps">
        {ptnProcess.steps.map((step) => (
          <li key={step.number} className="ptn-step">
            <div className="ptn-step__head">
              <span className="ptn-step__num">{step.number}</span>
              <h3 className="ptn-step__title">{step.title}</h3>
            </div>
            <p className="ptn-step__text">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="ptn-process__note">{ptnProcess.note}</p>
    </section>
  );
}

export function PtnSpaces() {
  return (
    <section id={ptnSpaces.id} className="ptn-spaces" aria-labelledby="ptn-spaces-title">
      <div className="ptn-spaces__copy">
        <p className="ptn-eyebrow">{ptnSpaces.eyebrow}</p>
        <h2 id="ptn-spaces-title" className="ptn-h2 ptn-h2--light">
          {ptnSpaces.title}
        </h2>
        <p className="ptn-spaces__lead">{ptnSpaces.lead}</p>
      </div>
      <ul className="ptn-spaces__list">
        {ptnSpaces.items.map((item) => (
          <li key={item.id} id={item.id} className="ptn-space">
            <div className="ptn-space__visual">
              <span className="ptn-badge">{ptnSpaces.badge}</span>
              <PtnPicture id={item.image} alt={item.alt} scene="dark" sizes="(max-width: 700px) 90vw, 28vw" className="ptn-space__pic" />
            </div>
            <h3 className="ptn-space__title">{item.title}</h3>
            <p className="ptn-space__text">{item.text}</p>
            <Link href={item.cta.href} className="ptn-cta ptn-cta--light">
              {item.cta.label}
              <PtnIcon name="arrowUpRight" className="ptn-cta__icon" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="ptn-spaces__note">{ptnSpaces.note}</p>
    </section>
  );
}

export function PtnBanner() {
  return (
    <section id={ptnBanner.id} className="ptn-banner" aria-labelledby="ptn-banner-title">
      {/* Ancien repère /partenaires#preparer-proposition : mène à ce bandeau de proposition. */}
      <span id="preparer-proposition" className="ptn-alias" aria-hidden="true" />
      <div className="ptn-banner__copy">
        <p className="ptn-eyebrow">{ptnBanner.eyebrow}</p>
        <h2 id="ptn-banner-title" className="ptn-banner__title">
          {ptnBanner.title}
        </h2>
        <p className="ptn-banner__lead">{ptnBanner.lead}</p>
      </div>
      <Link href={ptnBanner.cta.href} className="ptn-btn ptn-btn--yellow">
        {ptnBanner.cta.label}
        <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
      </Link>
    </section>
  );
}