import Image from "next/image";
import Link from "next/link";
import { secBreadcrumb, secHero, secStrip } from "@/content/security-hub";
import { SecIcon } from "./SecIcon";

export function SecHero() {
  return (
    <>
      <section className="sec-hero" aria-labelledby="sec-hero-title">
        <div className="sec-hero__copy">
          <nav className="sec-crumb" aria-label="Fil d’Ariane">
            <ol>
              {secBreadcrumb.map((item) => (
                <li key={item.label} aria-current={item.href ? undefined : "page"}>
                  {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                </li>
              ))}
            </ol>
          </nav>
          <p className="sec-kicker">{secHero.kicker}</p>
          <h1 id="sec-hero-title" className="sec-h1">
            {secHero.titleLines.map((l) => (
              <span key={l} className="sec-line">
                {l}
              </span>
            ))}
            <span className="sec-line">
              {secHero.titleUnderlineLine.before}
              <span className="sec-underline">{secHero.titleUnderlineLine.underline}</span>
            </span>
            {secHero.titleLinesAfter.map((l) => (
              <span key={l} className="sec-line">
                {l}
              </span>
            ))}
          </h1>
          <p className="sec-hero__lead">{secHero.lead}</p>
          <div className="sec-hero__actions">
            <Link href={secHero.primary.href} className="sec-btn sec-btn--yellow">
              {secHero.primary.label}
              <SecIcon name="arrowUpRight" />
            </Link>
            <a href={secHero.secondary.href} className="sec-textlink">
              {secHero.secondary.label}
              <SecIcon name="arrowDown" />
            </a>
          </div>
        </div>
        <div className="sec-hero__visual">
          <Image
            src={secHero.image.src}
            alt={secHero.image.alt}
            width={secHero.image.width}
            height={secHero.image.height}
            sizes="(min-width: 1200px) 53vw, 100vw"
            priority
            className="sec-hero__img"
          />
          <div className="sec-hero__card">
            <span className="sec-hero__bell">
              <SecIcon name="bell" strokeWidth={1.8} />
            </span>
            <span className="sec-hero__card-text">
              <strong>{secHero.card.title}</strong>
              <span>{secHero.card.meta}</span>
              <span className="sec-hero__card-link">
                {secHero.card.link}
                <SecIcon name="arrowRight" strokeWidth={2} />
              </span>
            </span>
          </div>
          <p className="sec-hero__caption">{secHero.caption}</p>
        </div>
      </section>

      <section className="sec-strip" aria-label="Repères de la solution">
        <ul className="sec-wrap sec-strip__list">
          {secStrip.map((s) => (
            <li key={s.title}>
              <SecIcon name={s.icon} strokeWidth={1.4} />
              <span>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
