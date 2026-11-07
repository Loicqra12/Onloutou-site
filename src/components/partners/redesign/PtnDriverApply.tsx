import { IlluExchange, IlluProfileReview, IlluTerms } from "@/components/illustrations/StepIllustrations";
import Link from "next/link";
import { ptnDlAfter, ptnDlBand, ptnDlHero } from "@/content/partner-spaces-hub";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnDlHero() {
  return (
    <section className="ptn-hero ptn-hero--light ptn-dl-hero" aria-labelledby="ptn-dl-title">
      <div className="ptn-hero__copy">
        <p className="ptn-pill">{ptnDlHero.badge}</p>
        <h1 id="ptn-dl-title" className="ptn-h1">
          {ptnDlHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnDlHero.lead}</p>
        <div className="ptn-hero__actions">
          <a href={ptnDlHero.cta.href} className="ptn-btn ptn-btn--yellow">
            {ptnDlHero.cta.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
        </div>
        <p className="ptn-hero__note">{ptnDlHero.note}</p>
      </div>
      <PtnPicture
        id={ptnDlHero.image.id}
        alt={ptnDlHero.image.alt}
        scene="dlhero"
        priority
        sizes="(max-width: 900px) 100vw, 55vw"
        className="ptn-hero__visual"
      />
    </section>
  );
}

const DL_ILLU = [<IlluProfileReview key="p" />, <IlluExchange key="e" />, <IlluTerms key="t" />];

export function PtnDlAfter() {
  return (
    <section className="ptn-dl-after" aria-labelledby="ptn-dl-after-title">
      <div className="ptn-dl-after__intro">
        <h2 id="ptn-dl-after-title" className="ptn-dl-after__title">
          {ptnDlAfter.title}
        </h2>
        <p>{ptnDlAfter.lead}</p>
      </div>
      <ol className="ptn-flow ptn-flow--after">
        {ptnDlAfter.steps.map((step) => (
          <li key={step.number} className="ptn-flow__item">
            <span className="step-illu">{DL_ILLU[Number(step.number) - 1]}</span>
            <span className="ptn-flow__num">{step.number}</span>
            <span className="ptn-flow__icon">
              <PtnIcon name={step.icon} />
            </span>
            <div className="ptn-flow__copy">
              <h3 className="ptn-flow__title">{step.title}</h3>
              <p className="ptn-flow__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PtnDlBand() {
  return (
    <section className="ptn-dl-band" aria-labelledby="ptn-dl-band-title">
      <div className="ptn-dl-band__copy">
        <div className="ptn-dl-band__head">
          <h2 id="ptn-dl-band-title">{ptnDlBand.title}</h2>
          <span className="ptn-badge-inline ptn-badge-inline--soft">{ptnDlBand.badge}</span>
        </div>
        <p>{ptnDlBand.lead}</p>
      </div>
      <div className="ptn-dl-band__action">
        <Link href={ptnDlBand.cta.href} className="ptn-textlink ptn-textlink--light">
          {ptnDlBand.cta.label}
          <PtnIcon name="arrowRight" className="ptn-btn__icon" />
        </Link>
        <p>{ptnDlBand.note}</p>
      </div>
    </section>
  );
}