import Image from "next/image";
import Link from "next/link";
import { eqpConfirm, eqpFinalCta, eqpProcess, eqpRentBuy, eqpTerrain, eqpTracking } from "@/content/equipment-hub";
import { EqpIcon } from "./EqpIcon";

export function EqpRentBuy() {
  const { rent, buy } = eqpRentBuy;
  return (
    <section className="eqp-section eqp-rentbuy" aria-labelledby="eqp-rentbuy-title">
      <div className="eqp-wrap">
        <p className="eqp-kicker">{eqpRentBuy.kicker}</p>
        <h2 id="eqp-rentbuy-title" className="eqp-h2 eqp-h2--lg">
          <span className="eqp-underline">Deux</span> façons de vous équiper.
        </h2>
        <div className="eqp-rentbuy__grid">
          {[
            { key: "rent", data: rent, dark: false },
            { key: "buy", data: buy, dark: true },
          ].map(({ key, data, dark }) => (
            <article key={key} className={`eqp-card${dark ? " eqp-card--dark" : ""}`}>
              <div className="eqp-card__head">
                <EqpIcon name={data.icon} strokeWidth={1.5} />
                <div>
                  <h3>{data.title}</h3>
                  <p>{data.lead}</p>
                </div>
              </div>
              <ul className="eqp-card__points">
                {data.points.map((p) => (
                  <li key={p.label}>
                    <EqpIcon name={p.icon} strokeWidth={1.5} />
                    <span>{p.label}</span>
                  </li>
                ))}
              </ul>
              <Link href={data.cta.href} className={`eqp-btn eqp-btn--block ${dark ? "eqp-btn--yellow" : "eqp-btn--black"}`}>
                {data.cta.label}
                <EqpIcon name="arrowUpRight" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EqpTerrain() {
  return (
    <section className="eqp-terrain" aria-labelledby="eqp-terrain-title">
      <figure className="eqp-terrain__media">
        <Image
          src={eqpTerrain.image.src}
          alt={eqpTerrain.image.alt}
          width={eqpTerrain.image.width}
          height={eqpTerrain.image.height}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </figure>
      <div className="eqp-terrain__copy">
        <p className="eqp-kicker eqp-kicker--plain">{eqpTerrain.kicker}</p>
        <h2 id="eqp-terrain-title" className="eqp-h2">
          <span className="eqp-line">{eqpTerrain.titleLines[0]}</span>
          <span className="eqp-line">
            <span className="eqp-underline">{eqpTerrain.titleLines[1]}</span>
          </span>
        </h2>
        <ol className="eqp-terrain__list">
          {eqpTerrain.items.map((item) => (
            <li key={item.number}>
              <span className="eqp-terrain__n">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="eqp-note eqp-note--bar">{eqpTerrain.note}</p>
      </div>
    </section>
  );
}

export function EqpTracking() {
  return (
    <section className="eqp-tracking" aria-labelledby="eqp-tracking-title">
      <div className="eqp-wrap eqp-tracking__grid">
        <div className="eqp-tracking__copy">
          <p className="eqp-kicker eqp-kicker--plain">{eqpTracking.kicker}</p>
          <h2 id="eqp-tracking-title" className="eqp-h2">
            <span className="eqp-line">{eqpTracking.titleLines[0]}</span>
            <span className="eqp-line">
              <span className="eqp-underline">mieux</span> suivis.
            </span>
          </h2>
          <p className="eqp-tracking__lead">{eqpTracking.lead}</p>
          <div className="eqp-tracking__links">
            {eqpTracking.links.map((l) => (
              <Link key={l.href} href={l.href} className="eqp-link eqp-link--yellow">
                {l.label}
                <EqpIcon name="arrowUpRight" />
              </Link>
            ))}
          </div>
        </div>
        <div className="eqp-tracking__visual">
          <div className="eqp-mock" role="img" aria-label="Aperçu illustratif d’un tableau de suivi : véhicule A, engin B et équipement C, avec position, dernier événement et suivi configuré">
            <div className="eqp-mock__bar" aria-hidden="true">
              <span>{eqpTracking.mockTitle}</span>
              <span className="eqp-mock__dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <ul className="eqp-mock__rows" aria-hidden="true">
              {eqpTracking.rows.map((row) => (
                <li key={row.name}>
                  <span className="eqp-mock__thumb">
                    <EqpIcon name={row.icon} strokeWidth={1.4} />
                  </span>
                  <strong>{row.name}</strong>
                  {eqpTracking.columns.map((col, ci) => (
                    <span key={ci} className={`eqp-mock__cell eqp-mock__cell--${ci}`}>
                      <EqpIcon name={col.icon} strokeWidth={1.8} />
                      <span>
                        {col.label[0]}
                        <br />
                        {col.label[1]}
                      </span>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <p className="eqp-tracking__caption">{eqpTracking.caption}</p>
        </div>
      </div>
    </section>
  );
}

export function EqpProcess() {
  return (
    <section className="eqp-section eqp-process" aria-labelledby="eqp-process-title">
      <div className="eqp-wrap">
        <p className="eqp-kicker">{eqpProcess.kicker}</p>
        <h2 id="eqp-process-title" className="eqp-h2 eqp-h2--lg">
          <span className="eqp-underline">Qualifier</span> avant de proposer.
        </h2>
        <ol className="eqp-process__grid">
          {eqpProcess.steps.map((s) => (
            <li key={s.number}>
              <span className="eqp-process__n">{s.number}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <a className="eqp-btn eqp-btn--yellow" href={eqpProcess.cta.href}>
          {eqpProcess.cta.label}
          <EqpIcon name="arrowDownRight" />
        </a>
      </div>
    </section>
  );
}

export function EqpConfirm() {
  return (
    <section className="eqp-section eqp-confirm" aria-labelledby="eqp-confirm-title">
      <div className="eqp-wrap">
        <h2 id="eqp-confirm-title" className="eqp-h2 eqp-h2--dot">
          {eqpConfirm.title}
          <span className="eqp-dot" aria-hidden="true">.</span>
        </h2>
        <ul className="eqp-confirm__grid">
          {eqpConfirm.items.map((item) => (
            <li key={item.title}>
              <EqpIcon name={item.icon} strokeWidth={1.4} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="eqp-note eqp-note--info">
          <EqpIcon name="info" />
          {eqpConfirm.note}
        </p>
      </div>
    </section>
  );
}

export function EqpFinalCta() {
  return (
    <section className="eqp-final" aria-labelledby="eqp-final-title">
      <div className="eqp-wrap eqp-final__inner">
        <h2 id="eqp-final-title" className="eqp-final__title">
          {eqpFinalCta.titleLines.map((line) => (
            <span key={line} className="eqp-line">
              {line}
            </span>
          ))}
        </h2>
        <Link href={eqpFinalCta.cta.href} className="eqp-btn eqp-btn--black">
          {eqpFinalCta.cta.label}
          <EqpIcon name="arrowUpRight" />
        </Link>
      </div>
    </section>
  );
}
