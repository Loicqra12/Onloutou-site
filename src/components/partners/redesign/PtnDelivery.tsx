import { IlluConditions, IlluFeasibility, IlluOrganisation } from "@/components/illustrations/StepIllustrations";
import Link from "next/link";
import { ptnDrvChoices, ptnDrvHero, ptnDrvSteps } from "@/content/partners-subpages";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnDrvHero() {
  return (
    <section className="ptn-hero ptn-hero--drv" aria-labelledby="ptn-drv-title">
      <div className="ptn-hero__copy">
        <p className="ptn-pill">{ptnDrvHero.badge}</p>
        <h1 id="ptn-drv-title" className="ptn-h1">
          {ptnDrvHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnDrvHero.lead}</p>
        <div className="ptn-hero__actions">
          <a href={ptnDrvHero.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnDrvHero.primary.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
          <Link href={ptnDrvHero.secondary.href} className="ptn-textlink ptn-textlink--light">
            {ptnDrvHero.secondary.label}
            <PtnIcon name="arrowRight" className="ptn-btn__icon" />
          </Link>
        </div>
      </div>
      <PtnPicture
        id={ptnDrvHero.image.id}
        alt={ptnDrvHero.image.alt}
        scene="street"
        priority
        sizes="(max-width: 900px) 100vw, 55vw"
        className="ptn-hero__visual"
      />
      <span className="ptn-hero__caption">{ptnDrvHero.caption}</span>
    </section>
  );
}

export function PtnDrvChoices({ id }: { id?: string } = {}) {
  return (
    <section id={id} className="ptn-tiles ptn-tiles--choices" aria-label="Choisir votre démarche">
      <ul className="ptn-tiles__grid">
        {ptnDrvChoices.map((choice) => (
          <li key={choice.id} className="ptn-tile ptn-tile--choice">
            <span className="ptn-tile__icon">
              <PtnIcon name={choice.icon} />
            </span>
            <div className="ptn-tile__body">
              <h2 className="ptn-tile__title">{choice.title}</h2>
              <p className="ptn-tile__text">{choice.text}</p>
              {choice.cta.href.startsWith("#") ? (
                <a href={choice.cta.href} className={`ptn-btn ptn-btn--sm ptn-btn--${choice.variant}`}>
                  {choice.cta.label}
                  <PtnIcon name="arrowDown" className="ptn-btn__icon" />
                </a>
              ) : (
                <Link href={choice.cta.href} className={`ptn-btn ptn-btn--sm ptn-btn--${choice.variant}`}>
                  {choice.cta.label}
                  <PtnIcon name="arrowRight" className="ptn-btn__icon" />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const DRV_ILLU = [<IlluFeasibility key="f" />, <IlluConditions key="c" />, <IlluOrganisation key="o" />];

export function PtnDrvSteps({ id }: { id?: string } = {}) {
  return (
    <section id={id} className="ptn-flow-section" aria-labelledby="ptn-drv-steps-title">
      <p className="ptn-eyebrow">{ptnDrvSteps.eyebrow}</p>
      <h2 id="ptn-drv-steps-title" className="ptn-h2 ptn-h2--md">
        {ptnDrvSteps.title}
      </h2>
      <ol className="ptn-flow">
        {ptnDrvSteps.items.map((item) => (
          <li key={item.number} className="ptn-flow__item">
            <span className="step-illu">{DRV_ILLU[Number(item.number) - 1]}</span>
            <span className="ptn-flow__num">{item.number}</span>
            <span className="ptn-flow__icon">
              <PtnIcon name={item.icon} />
            </span>
            <div className="ptn-flow__copy">
              <h3 className="ptn-flow__title">{item.title}</h3>
              <p className="ptn-flow__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}