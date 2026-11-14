import Link from "next/link";
import {
  dpBreadcrumb,
  dpClosing,
  dpDifferent,
  dpFamiliesTitle,
  dpFamilyCards,
  dpFamilyChips,
  dpFaq,
  dpHero,
  dpPillars,
  dpSteps,
  dpStepsTitle,
} from "@/content/devenir-partenaire";
import { DpIcon } from "@/components/partners/DpIcon";
import { DpPicture } from "@/components/partners/DpPicture";

export function DpLanding() {
  return (
    <div className="dp-page">
      <div className="dp-wrap">
        <nav className="dp-crumb" aria-label="Fil d’Ariane">
          {dpBreadcrumb.map((item, index) => (
            <span key={item.label}>
              {index > 0 ? " / " : null}
              {"href" in item && item.href ? <Link href={item.href}>{item.label}</Link> : <span className="dp-crumb__current">{item.label}</span>}
            </span>
          ))}
        </nav>

        <section className="dp-hero" aria-labelledby="dp-hero-title">
          <div>
            <p className="dp-badge">{dpHero.badge}</p>
            <h1 id="dp-hero-title" className="dp-h1">{dpHero.title}</h1>
            <p className="dp-lead">{dpHero.lead}</p>
            <div className="dp-hero__actions">
              <Link href={dpHero.primary.href} className="dp-btn dp-btn--yellow">
                {dpHero.primary.label} <DpIcon name="arrow" className="dp-btn-ico" />
              </Link>
              <Link href={dpHero.secondary.href} className="dp-btn dp-btn--ghost">
                {dpHero.secondary.label}
              </Link>
            </div>
            <p className="dp-note">
              <DpIcon name="info" className="dp-note__icon" />
              <span>{dpHero.note}</span>
            </p>
          </div>
          <DpPicture image={dpHero.image} className="dp-hero__visual" sizes="(max-width: 900px) 100vw, 50vw" priority />
        </section>

        <ul className="dp-pillars">
          {dpPillars.map((item) => (
            <li key={item.id} className="dp-pillar">
              <DpIcon name={item.icon} className="dp-pillar__icon" />
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="dp-h2">{dpStepsTitle}</h2>
        <ol className="dp-steps">
          {dpSteps.map((step) => (
            <li key={step.id} className="dp-step">
              <DpIcon name={step.icon} className="dp-step__icon" />
              <div>
                <span className="dp-step__num">{step.number}</span>{" "}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="dp-h2">{dpFamiliesTitle}</h2>
        <ul className="dp-cards">
          {dpFamilyCards.map((card) => (
            <li key={card.id}>
              <Link href={card.href} className="dp-card">
                <DpPicture image={card.image} sizes="(max-width: 700px) 100vw, 25vw" />
                <span className="dp-card__label">
                  {card.title}
                  <DpIcon name="arrow" className="dp-card__chevron" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="dp-chips">
          {dpFamilyChips.map((chip) => (
            <li key={chip.id}>
              <Link href={chip.href} className="dp-chip">
                <DpIcon name={chip.icon} />
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={dpDifferent.href} className="dp-diff" id="preparer-proposition">
          <span>{dpDifferent.label}</span> →
        </Link>

        <div className="dp-faq">
          {dpFaq.items.map((item, index) => (
            <details key={item.id} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>

        <section className="dp-close" aria-labelledby="dp-close-title">
          <h2 id="dp-close-title">{dpClosing.title}</h2>
          <div className="dp-close__actions">
            <Link href={dpClosing.primary.href} className="dp-btn dp-btn--yellow">
              {dpClosing.primary.label} <DpIcon name="arrow" className="dp-btn-ico" />
            </Link>
            <p className="dp-close__already">
              {dpClosing.already}{" "}
              <Link href={dpClosing.loginHref}>
                <span className="dp-close__login">{dpClosing.loginLabel}</span>
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
