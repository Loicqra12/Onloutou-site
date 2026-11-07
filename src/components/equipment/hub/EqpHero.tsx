import Image from "next/image";
import Link from "next/link";
import { eqpHero } from "@/content/equipment-hub";
import { EqpIcon } from "./EqpIcon";

export function EqpHero() {
  const [first, second, third] = eqpHero.titleLines;
  return (
    <>
      <section className="eqp-hero" aria-labelledby="eqp-hero-title">
        <div className="eqp-hero__copy">
          <nav aria-label="Fil d’Ariane" className="eqp-crumb">
            <ol>
              {eqpHero.breadcrumb.map((item) => (
                <li key={item.label}>
                  {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <p className="eqp-kicker eqp-kicker--plain">{eqpHero.eyebrow}</p>
          <h1 id="eqp-hero-title" className="eqp-h1">
            <span className="eqp-line">{first}</span>
            <span className="eqp-line">
              <span className="eqp-underline">{second}</span>
            </span>
            <span className="eqp-line">{third}</span>
          </h1>
          <p className="eqp-hero__intro">{eqpHero.intro}</p>
          <div className="eqp-hero__actions">
            <a className="eqp-btn eqp-btn--yellow" href={eqpHero.primaryCta.href}>
              {eqpHero.primaryCta.label}
              <EqpIcon name="arrowDownRight" />
            </a>
            <a className="eqp-link" href={eqpHero.secondaryCta.href}>
              {eqpHero.secondaryCta.label}
              <EqpIcon name="arrowUpRight" />
            </a>
          </div>
          <p className="eqp-hero__caveat">{eqpHero.caveat}</p>
        </div>
        <figure className="eqp-hero__visual">
          <Image
            src={eqpHero.image.src}
            alt={eqpHero.image.alt}
            width={eqpHero.image.width}
            height={eqpHero.image.height}
            sizes="(max-width: 900px) 100vw, 56vw"
            className="eqp-hero__img"
            priority
          />
        </figure>
      </section>
    </>
  );
}
