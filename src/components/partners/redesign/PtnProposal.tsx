import Link from "next/link";
import { ptnAfter, ptnProposalHero } from "@/content/partners-hub";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnProposalHero() {
  const crumbs = ptnProposalHero.breadcrumb;
  return (
    <section className="ptn-hero ptn-hero--proposal" aria-labelledby="ptn-proposal-title">
      <div className="ptn-hero__copy">
        <nav aria-label="Fil d’Ariane" className="ptn-crumbs">
          <ol>
            {crumbs.map((crumb, index) => (
              <li key={crumb.label}>
                {"href" in crumb && crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 ? <span aria-hidden="true"> / </span> : null}
              </li>
            ))}
          </ol>
        </nav>
        <h1 id="ptn-proposal-title" className="ptn-h1">
          {ptnProposalHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnProposalHero.lead}</p>
        <div className="ptn-hero__actions">
          <a href={ptnProposalHero.cta.href} className="ptn-btn ptn-btn--yellow">
            {ptnProposalHero.cta.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
        </div>
        <p className="ptn-hero__note">{ptnProposalHero.note}</p>
      </div>
      <PtnPicture
        id={ptnProposalHero.image.id}
        alt={ptnProposalHero.image.alt}
        scene="proposal"
        priority
        sizes="(max-width: 900px) 100vw, 56vw"
        className="ptn-hero__visual"
      />
    </section>
  );
}

export function PtnAfter() {
  return (
    <section className="ptn-after" aria-labelledby="ptn-after-title">
      <h2 id="ptn-after-title" className="ptn-h2 ptn-h2--md">
        {ptnAfter.title}
      </h2>
      <ol className="ptn-steps">
        {ptnAfter.steps.map((step) => (
          <li key={step.number} className="ptn-step">
            <div className="ptn-step__head">
              <span className="ptn-step__num">{step.number}</span>
              <h3 className="ptn-step__title">{step.title}</h3>
            </div>
            <p className="ptn-step__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}