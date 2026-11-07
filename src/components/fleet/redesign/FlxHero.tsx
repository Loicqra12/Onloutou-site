import Image from "next/image";
import Link from "next/link";
import { flxBreadcrumb, flxHero, flxStrip } from "@/content/fleet-hub";
import { FlxIcon } from "./FlxIcon";

export function FlxHero() {
  return (
    <>
      <section className="flx-hero" aria-labelledby="flx-hero-title">
        <div className="flx-hero__copy">
          <nav className="flx-crumb" aria-label="Fil d’Ariane">
            <ol>
              {flxBreadcrumb.map((item) => (
                <li key={item.label} aria-current={item.href ? undefined : "page"}>
                  {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                </li>
              ))}
            </ol>
          </nav>
          <p className="flx-kicker">{flxHero.kicker}</p>
          <h1 id="flx-hero-title" className="flx-h1">
            {flxHero.titleLines.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
            <span className="flx-line">
              <span className="flx-underline">{flxHero.titleUnderline}</span>
            </span>
          </h1>
          <p className="flx-hero__lead">
            {flxHero.lead.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
          </p>
          <div className="flx-hero__actions">
            <Link href={flxHero.primary.href} className="flx-btn flx-btn--yellow">
              {flxHero.primary.label}
              <FlxIcon name="arrowUpRight" />
            </Link>
            <a href={flxHero.secondary.href} className="flx-textlink">
              {flxHero.secondary.label}
              <FlxIcon name="arrowDown" />
            </a>
          </div>
        </div>
        <div className="flx-hero__visual">
          <Image
            src={flxHero.image.src}
            alt={flxHero.image.alt}
            width={flxHero.image.width}
            height={flxHero.image.height}
            sizes="(min-width: 1200px) 56vw, 100vw"
            priority
            className="flx-hero__img"
          />
          <div className="flx-hero__card">
            <ul>
              {flxHero.card.items.map((it) => (
                <li key={it.label}>
                  <FlxIcon name="van" strokeWidth={1.5} />
                  <span className="flx-hero__card-text">
                    <strong>{it.label}</strong>
                    <span>
                      <i className={`flx-dot flx-dot--${it.tone}`} aria-hidden="true" />
                      {it.status}
                    </span>
                  </span>
                  <FlxIcon name="chevronRight" strokeWidth={2} />
                </li>
              ))}
            </ul>
            <p>{flxHero.card.note}</p>
          </div>
        </div>
      </section>

      <section className="flx-strip" aria-label="Ce que permet la gestion de flotte">
        <ul className="flx-wrap flx-strip__list">
          {flxStrip.map((s) => (
            <li key={s.title}>
              <FlxIcon name={s.icon} strokeWidth={1.5} />
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
