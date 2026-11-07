import Link from "next/link";
import { ptnEslCta, ptnEslFeatures, ptnEslHero, ptnEslNotice, ptnEslUsage } from "@/content/partner-spaces-hub";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnEslHero() {
  return (
    <section className="ptn-hero ptn-esl-hero" aria-labelledby="ptn-esl-title">
      <div className="ptn-hero__copy">
        <p className="ptn-kicker-row">
          <span className="ptn-eyebrow">{ptnEslHero.eyebrow}</span>
          <span className="ptn-badge-inline">{ptnEslHero.badge}</span>
        </p>
        <h1 id="ptn-esl-title" className="ptn-h1">
          {ptnEslHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnEslHero.lead}</p>
        <div className="ptn-hero__actions">
          <a href={ptnEslHero.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnEslHero.primary.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
          <Link href={ptnEslHero.secondary.href} className="ptn-btn ptn-btn--ghost">
            {ptnEslHero.secondary.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
        </div>
        <p className="ptn-hero__note">{ptnEslHero.note}</p>
      </div>
      <PtnPicture
        id={ptnEslHero.image.id}
        alt={ptnEslHero.image.alt}
        scene="esl"
        priority
        sizes="(max-width: 900px) 70vw, 40vw"
        className="ptn-hero__visual ptn-esl-hero__visual"
      />
    </section>
  );
}

export function PtnEslPreview() {
  return (
    <div id={ptnEslFeatures.id} className="ptn-esl-preview">
      <section className="ptn-esl-features" aria-labelledby="ptn-esl-features-title">
        <p className="ptn-esl-features__caption">{ptnEslHero.caption}</p>
        <p className="ptn-eyebrow">{ptnEslFeatures.eyebrow}</p>
        <h2 id="ptn-esl-features-title" className="ptn-h2 ptn-h2--feat">
          {ptnEslFeatures.title}
        </h2>
        <ul className="ptn-feats ptn-feats--two">
          {ptnEslFeatures.items.map((item) => (
            <li key={item.title} className="ptn-feat">
              <span className="ptn-feat__icon">
                <PtnIcon name={item.icon} />
              </span>
              <div>
                <h3 className="ptn-feat__title">{item.title}</h3>
                <p className="ptn-feat__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="ptn-esl-usage" aria-labelledby="ptn-esl-usage-title">
        <div className="ptn-esl-usage__photo">
          <PtnPicture
            id={ptnEslUsage.image.id}
            alt={ptnEslUsage.image.alt}
            scene="green"
            sizes="(max-width: 900px) 100vw, 58vw"
            className="ptn-esl-usage__pic"
          />
          <span className="ptn-esl-usage__caption">{ptnEslUsage.caption}</span>
        </div>
        <div className="ptn-esl-usage__copy">
          <h2 id="ptn-esl-usage-title" className="ptn-h2 ptn-h2--usage">
            {ptnEslUsage.title}
          </h2>
          <ul className="ptn-rows">
            {ptnEslUsage.items.map((item) => (
              <li key={item.title}>
                <span className="ptn-rows__icon">
                  <PtnIcon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function PtnEslNoticeCta() {
  return (
    <>
      <p className="ptn-notice">
        <PtnIcon name="info" className="ptn-notice__icon" />
        <span>{ptnEslNotice}</span>
      </p>
      <section className="ptn-spc-cta" aria-labelledby="ptn-esl-cta-title">
        <div className="ptn-spc-cta__copy">
          <h2 id="ptn-esl-cta-title" className="ptn-spc-cta__title">
            {ptnEslCta.title}
          </h2>
          <p className="ptn-spc-cta__lead">{ptnEslCta.lead}</p>
        </div>
        <div className="ptn-spc-cta__actions">
          <Link href={ptnEslCta.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnEslCta.primary.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
          <Link href={ptnEslCta.secondary.href} className="ptn-btn ptn-btn--outline">
            {ptnEslCta.secondary.label}
            <PtnIcon name="arrowRight" className="ptn-btn__icon" />
          </Link>
        </div>
      </section>
    </>
  );
}