import Image from "next/image";
import Link from "next/link";
import { glxHero, glxStrip } from "@/content/geolocation-hub";
import { GlxIcon } from "./GlxIcon";

export function GlxHero() {
  const [l1, , l3] = glxHero.titleLines;
  return (
    <>
      <section className="glx-hero" aria-labelledby="glx-hero-title">
        <div className="glx-wrap glx-hero__grid">
          <div className="glx-hero__copy">
            <nav aria-label="Fil d’Ariane" className="glx-crumb">
              <ol>
                {glxHero.breadcrumb.map((item) => (
                  <li key={item.label}>
                    {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="glx-kicker">{glxHero.kicker}</p>
            <h1 id="glx-hero-title" className="glx-h1">
              <span className="glx-line">{l1}</span>
              <span className="glx-line">
                <span className="glx-underline">le lien</span> avec
              </span>
              <span className="glx-line">{l3}</span>
            </h1>
            <p className="glx-hero__intro">{glxHero.intro}</p>
            <div className="glx-hero__actions">
              <Link className="glx-btn glx-btn--yellow" href={glxHero.primaryCta.href}>
                {glxHero.primaryCta.label}
                <GlxIcon name="arrowUpRight" />
              </Link>
              <a className="glx-btn glx-btn--ghost" href={glxHero.secondaryCta.href}>
                {glxHero.secondaryCta.label}
                <GlxIcon name="arrowDownRight" />
              </a>
            </div>
            <p className="glx-hero__caveat">{glxHero.caveat}</p>
          </div>
          <figure className="glx-hero__visual">
            <Image
              src={glxHero.image.src}
              alt={glxHero.image.alt}
              width={glxHero.image.width}
              height={glxHero.image.height}
              sizes="(max-width: 900px) 100vw, 56vw"
              className="glx-hero__img"
              priority
            />
            <p className="glx-badge">
              <GlxIcon name="info" strokeWidth={2} />
              <span>
                <strong>{glxHero.badge.title}</strong>
                <small>{glxHero.badge.text}</small>
              </span>
            </p>
          </figure>
        </div>
      </section>

      <section className="glx-strip" aria-label="Repères de la solution">
        <ul className="glx-wrap glx-strip__list">
          {glxStrip.map((item) => (
            <li key={item.label}>
              <span className="glx-strip__icon">
                <GlxIcon name={item.icon} strokeWidth={1.6} />
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
