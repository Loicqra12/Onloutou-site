import { IlluCompatibility, IlluContext, IlluScope } from "@/components/illustrations/StepIllustrations";
import Link from "next/link";
import {
  ptnTechBanner,
  ptnTechDomains,
  ptnTechHero,
  ptnTechProcess,
  ptnTechProposal,
} from "@/content/partners-subpages";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnTechHero() {
  return (
    <section className="ptn-hero ptn-hero--light ptn-hero--tech" aria-labelledby="ptn-tech-title">
      <div className="ptn-hero__copy">
        <p className="ptn-eyebrow">{ptnTechHero.eyebrow}</p>
        <h1 id="ptn-tech-title" className="ptn-h1">
          {ptnTechHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnTechHero.lead}</p>
        <div className="ptn-hero__actions">
          <Link href={ptnTechHero.cta.href} className="ptn-btn ptn-btn--yellow">
            {ptnTechHero.cta.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
        </div>
      </div>
      <PtnPicture
        id={ptnTechHero.image.id}
        alt={ptnTechHero.image.alt}
        scene="workshop"
        priority
        sizes="(max-width: 900px) 100vw, 56vw"
        className="ptn-hero__visual"
      />
      <span className="ptn-hero__caption">{ptnTechHero.caption}</span>
    </section>
  );
}

export function PtnTechDomains() {
  return (
    <section id={ptnTechDomains.id} className="ptn-tiles" aria-labelledby="ptn-tech-domains-title">
      <p className="ptn-eyebrow">{ptnTechDomains.eyebrow}</p>
      <h2 id="ptn-tech-domains-title" className="ptn-h2">
        {ptnTechDomains.title}
      </h2>
      <ul className="ptn-tiles__grid">
        {ptnTechDomains.items.map((item) => (
          <li key={item.title} className="ptn-tile">
            <span className="ptn-tile__icon">
              <PtnIcon name={item.icon} />
            </span>
            <div className="ptn-tile__body">
              <h3 className="ptn-tile__title">{item.title}</h3>
              <p className="ptn-tile__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TECH_ILLU = [<IlluContext key="c" />, <IlluCompatibility key="k" />, <IlluScope key="s" />];

export function PtnTechProcess() {
  return (
    <section id={ptnTechProcess.id} className="ptn-dark-flow" aria-labelledby="ptn-tech-process-title">
      <p className="ptn-eyebrow">{ptnTechProcess.eyebrow}</p>
      <h2 id="ptn-tech-process-title" className="ptn-h2 ptn-h2--light">
        {ptnTechProcess.title}
      </h2>
      <ol className="ptn-flow ptn-flow--dark">
        {ptnTechProcess.steps.map((step, index) => (
          <li key={step.number} className="ptn-flow__item">
            <span className="step-illu">{TECH_ILLU[index]}</span>
            <span className="ptn-flow__num">{step.number}</span>
            <span className="ptn-flow__icon">
              <PtnIcon name={step.icon} />
            </span>
            <div className="ptn-flow__copy">
              <h3 className="ptn-flow__title">
                {step.titleLines.map((line) => (
                  <span key={line} className="ptn-line">
                    {line}{" "}
                  </span>
                ))}
              </h3>
              <p className="ptn-flow__text">{step.text}</p>
            </div>
            {index < ptnTechProcess.steps.length - 1 ? <PtnIcon name="arrowRight" className="ptn-flow__arrow" /> : null}
          </li>
        ))}
      </ol>
      <p className="ptn-dark-flow__note">{ptnTechProcess.note}</p>
    </section>
  );
}

export function PtnTechProposal() {
  const card = ptnTechProposal.card;
  return (
    <section id={ptnTechProposal.id} className="ptn-tech-proposal" aria-labelledby="ptn-tech-proposal-title">
      <div className="ptn-tech-proposal__copy">
        <p className="ptn-eyebrow">{ptnTechProposal.eyebrow}</p>
        <h2 id="ptn-tech-proposal-title" className="ptn-h2 ptn-h2--md">
          {ptnTechProposal.title}
        </h2>
        <p className="ptn-tech-proposal__lead">{ptnTechProposal.lead}</p>
        <ul className="ptn-ticks">
          {ptnTechProposal.checklist.map((item) => (
            <li key={item}>
              <span className="ptn-ticks__mark" aria-hidden="true">
                <PtnIcon name="check" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="ptn-tech-proposal__visual ptn-scene-yellowblur">
        <PtnPicture
          id={ptnTechProposal.image.id}
          alt={ptnTechProposal.image.alt}
          scene="clear"
          sizes="(max-width: 900px) 70vw, 30vw"
          className="ptn-tech-proposal__pic"
        />
        <div className="ptn-tech-card">
          <p className="ptn-tech-card__badge">{card.badge}</p>
          <h3 className="ptn-tech-card__title">{card.title}</h3>
          <ul className="ptn-tech-card__rows">
            {card.rows.map((row) => (
              <li key={row.label}>
                <PtnIcon name={row.icon} className="ptn-tech-card__icon" />
                <strong>{row.label}</strong>
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PtnTechBanner() {
  return (
    <section id={ptnTechBanner.id} className="ptn-cta-band" aria-labelledby="ptn-tech-banner-title">
      <div className="ptn-cta-band__copy">
        <p className="ptn-eyebrow">{ptnTechBanner.eyebrow}</p>
        <h2 id="ptn-tech-banner-title" className="ptn-cta-band__title">
          {ptnTechBanner.title}
        </h2>
        <p className="ptn-cta-band__lead">{ptnTechBanner.lead}</p>
      </div>
      <div className="ptn-cta-band__actions">
        <Link href={ptnTechBanner.primary.href} className="ptn-btn ptn-btn--yellow">
          {ptnTechBanner.primary.label}
          <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
        </Link>
        <Link href={ptnTechBanner.secondary.href} className="ptn-textlink ptn-textlink--dark">
          {ptnTechBanner.secondary.label}
          <PtnIcon name="arrowRight" className="ptn-btn__icon" />
        </Link>
      </div>
      <p className="ptn-cta-band__note">{ptnTechBanner.note}</p>
    </section>
  );
}