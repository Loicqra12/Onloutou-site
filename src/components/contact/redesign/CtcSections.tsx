import Link from "next/link";
import { ctcBand, ctcCards, ctcClaims, ctcDirect, ctcHero, ctcPrecisions } from "@/content/contact-hub";
import { CtcIcon } from "./CtcIcon";

export function CtcHero() {
  return (
    <section className="ctc-hero" aria-labelledby="ctc-title">
      <p className="ctc-eyebrow">{ctcHero.eyebrow}</p>
      <h1 id="ctc-title" className="ctc-h1">
        {ctcHero.title}
      </h1>
      <p className="ctc-hero__lead">{ctcHero.lead}</p>
      <span className="ctc-hero__bar" aria-hidden="true" />
    </section>
  );
}

export function CtcDirect() {
  const d = ctcDirect;
  return (
    <aside className="ctc-direct" aria-labelledby="ctc-direct-title">
      <h2 id="ctc-direct-title" className="ctc-h2 ctc-h2--light">
        {d.title}
      </h2>
      <div className="ctc-direct__block">
        <span className="ctc-circle">
          <CtcIcon name="phone" />
        </span>
        <div>
          <p className="ctc-direct__label">{d.phone.label}</p>
          <p className="ctc-direct__value">{d.phone.value}</p>
          <a href={d.phone.tel} className="ctc-textlink ctc-textlink--light">
            {d.phone.cta}
            <CtcIcon name="arrowUpRight" className="ctc-textlink__icon" />
          </a>
        </div>
      </div>
      <div className="ctc-direct__block">
        <span className="ctc-circle">
          <CtcIcon name="whatsapp" />
        </span>
        <div>
          <p className="ctc-direct__label">{d.whatsapp.label}</p>
          <p className="ctc-direct__text">{d.whatsapp.text}</p>
          <a href={d.whatsapp.href} target="_blank" rel="noopener noreferrer" className="ctc-btn ctc-btn--yellow ctc-btn--sm">
            {d.whatsapp.cta}
            <CtcIcon name="arrowUpRight" className="ctc-btn__icon" />
          </a>
        </div>
      </div>
      <div className="ctc-direct__block ctc-direct__block--place">
        <span className="ctc-circle">
          <CtcIcon name="pin" />
        </span>
        <p className="ctc-direct__value">{d.place}</p>
      </div>
      <div className="ctc-direct__help">
        <p className="ctc-direct__label">{d.help.question}</p>
        <Link href={d.help.href} className="ctc-textlink ctc-textlink--light">
          {d.help.cta}
          <CtcIcon name="arrowRight" className="ctc-textlink__icon" />
        </Link>
      </div>
    </aside>
  );
}

export function CtcPrecisions() {
  return (
    <section className="ctc-precisions" aria-labelledby="ctc-precisions-title">
      <h2 id="ctc-precisions-title" className="ctc-h2 ctc-h2--sm">
        {ctcPrecisions.title}
      </h2>
      <ol className="ctc-precisions__list">
        {ctcPrecisions.items.map((item) => (
          <li key={item.number} className="ctc-precisions__item">
            <span className="ctc-step">{item.number}</span>
            <div>
              <h3 className="ctc-precisions__title">{item.title}</h3>
              <p className="ctc-precisions__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CtcCards() {
  return (
    <ul className="ctc-cards">
      {ctcCards.map((card) => (
        <li key={card.id} className="ctc-card">
          <span className="ctc-circle ctc-circle--soft">
            <CtcIcon name={card.icon} />
          </span>
          <div>
            <h2 className="ctc-card__title">{card.title}</h2>
            <Link href={card.cta.href} className="ctc-textlink">
              {card.cta.label}
              <CtcIcon name="arrowUpRight" className="ctc-textlink__icon" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CtcClaims() {
  return (
    <section className="ctc-claims" id="reclamations" aria-labelledby="ctc-claims-title">
      <p className="ctc-eyebrow">{ctcClaims.eyebrow}</p>
      <h2 id="ctc-claims-title" className="ctc-h2 ctc-h2--sm">
        {ctcClaims.title}
      </h2>
      <div className="ctc-claims__head">
        <p className="ctc-claims__lead">{ctcClaims.lead}</p>
        <a href={ctcClaims.cta.href} className="ctc-btn ctc-btn--yellow">
          {ctcClaims.cta.label}
        </a>
      </div>
      <ol className="ctc-claims__list">
        {ctcClaims.steps.map((step, index) => (
          <li key={step.title} className="ctc-claims__item">
            <span className="ctc-step">{index + 1}</span>
            <div>
              <h3 className="ctc-precisions__title">{step.title}</h3>
              <p className="ctc-precisions__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="ctc-claims__after">{ctcClaims.after}</p>
    </section>
  );
}

export function CtcBand() {
  return (
    <section className="ctc-band" aria-labelledby="ctc-band-title">
      <span className="ctc-circle">
        <CtcIcon name="book" />
      </span>
      <h2 id="ctc-band-title" className="ctc-band__title">
        {ctcBand.title}
      </h2>
      <Link href={ctcBand.cta.href} className="ctc-btn ctc-btn--yellow">
        {ctcBand.cta.label}
        <CtcIcon name="arrowUpRight" className="ctc-btn__icon" />
      </Link>
    </section>
  );
}