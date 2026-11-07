import Image from "next/image";
import Link from "next/link";
import {
  flxCta,
  flxCycle,
  flxDeploy,
  flxExplore,
  flxFeatures,
  flxPilotage,
  flxReporting,
  flxUsages,
} from "@/content/fleet-hub";
import { FlxIcon } from "./FlxIcon";

export function FlxPilotage() {
  return (
    <section id={flxPilotage.id} className="flx-section flx-pilotage" aria-labelledby="flx-pilotage-title">
      <div className="flx-wrap flx-pilotage__grid">
        <div className="flx-pilotage__copy">
          <p className="flx-kicker">{flxPilotage.kicker}</p>
          <h2 id="flx-pilotage-title" className="flx-h2 flx-h2--md">
            {flxPilotage.titleLines.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
          </h2>
          <p className="flx-lead">{flxPilotage.lead}</p>
        </div>
        <ol className="flx-pilotage__steps">
          {flxPilotage.steps.map((s, i) => (
            <li key={s.title}>
              <Link href={s.href} className="flx-pstep">
                <span className="flx-ico flx-ico--lg">
                  <FlxIcon name={s.icon} strokeWidth={1.5} />
                </span>
                <span className="flx-pstep__text">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </Link>
              {i < flxPilotage.steps.length - 1 ? (
                <FlxIcon name="arrowDown" className="flx-pilotage__arrow" strokeWidth={1.5} />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FlxCycle() {
  return (
    <section id={flxCycle.id} className="flx-section flx-cycle" aria-labelledby="flx-cycle-title">
      <div className="flx-wrap">
        <p className="flx-kicker">Le cycle opérationnel</p>
        <h2 id="flx-cycle-title" className="flx-h2 flx-h2--md">
          {flxCycle.title}
          <span className="flx-dotmark" aria-hidden="true" />
        </h2>
        <p className="flx-lead">{flxCycle.lead}</p>
        <ol className="flx-cycle__list">
          {flxCycle.steps.map((s, i) => (
            <li key={s.title}>
              <span className="flx-cycle__icon">
                <FlxIcon name={s.icon} strokeWidth={1.6} />
              </span>
              <p className="flx-cycle__title">
                <span className="flx-num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{s.title}</strong>
              </p>
              <p className="flx-cycle__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FlxFeatures() {
  return (
    <section id={flxFeatures.id} className="flx-features" aria-labelledby="flx-features-title">
      <div className="flx-wrap">
        <h2 id="flx-features-title" className="flx-h2 flx-h2--md">
          {flxFeatures.title}
          <span className="flx-dotmark" aria-hidden="true" />
        </h2>
        <p className="flx-lead">{flxFeatures.lead}</p>
        <ul className="flx-features__grid">
          {flxFeatures.groups.map((g, i) => (
            <li key={g.title} className="flx-fcard">
              <div className="flx-fcard__head">
                <span className="flx-fcard__icon">
                  <FlxIcon name={g.icon} strokeWidth={1.6} />
                </span>
                <p className="flx-fcard__title">
                  <span className="flx-num">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{g.title}</strong>
                </p>
                <p className="flx-fcard__text">{g.text}</p>
              </div>
              <ul className="flx-fcard__items">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <FlxIcon name={it.icon} strokeWidth={1.5} />
                    <span>{it.label}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="flx-note flx-note--bar">{flxFeatures.note}</p>
      </div>
    </section>
  );
}

export function FlxUsages() {
  return (
    <section id={flxUsages.id} className="flx-section flx-usages" aria-labelledby="flx-usages-title">
      <div className="flx-wrap">
        <h2 id="flx-usages-title" className="flx-h2 flx-h2--md">
          {flxUsages.title}
          <span className="flx-dotmark" aria-hidden="true" />
        </h2>
        <p className="flx-lead">{flxUsages.lead}</p>
        <div className="flx-usages__grid">
          <div className="flx-usages__media">
            <Image
              src={flxUsages.image.src}
              alt={flxUsages.image.alt}
              width={flxUsages.image.width}
              height={flxUsages.image.height}
              sizes="(min-width: 900px) 45vw, 100vw"
              className="flx-usages__img"
            />
          </div>
          <ul className="flx-usages__list">
            {flxUsages.items.map((u) => (
              <li key={u.title}>
                <Link href={u.href} className="flx-usage">
                  <span className="flx-ico flx-ico--lg">
                    <FlxIcon name={u.icon} strokeWidth={1.5} />
                  </span>
                  <span className="flx-usage__text">
                    <strong>{u.title}</strong>
                    <span>{u.text}</span>
                  </span>
                  <FlxIcon name="arrowRight" className="flx-usage__arrow" strokeWidth={1.8} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function FlxReporting() {
  return (
    <section id={flxReporting.id} className="flx-section flx-reporting" aria-labelledby="flx-reporting-title">
      <div className="flx-wrap flx-reporting__grid">
        <div className="flx-reporting__copy">
          <h2 id="flx-reporting-title" className="flx-h2 flx-h2--md">
            {flxReporting.titleLines.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
            <span className="flx-dotmark" aria-hidden="true" />
          </h2>
          <p className="flx-lead">{flxReporting.lead}</p>
          <ul className="flx-reporting__points">
            {flxReporting.points.map((p) => (
              <li key={p.title}>
                <span className="flx-ico">
                  <FlxIcon name={p.icon} strokeWidth={1.6} />
                </span>
                <span>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href={flxReporting.cta.href} className="flx-btn flx-btn--yellow">
            {flxReporting.cta.label}
            <FlxIcon name="arrowUpRight" />
          </Link>
        </div>
        <figure className="flx-reporting__fig">
          <Image
            src={flxReporting.image.src}
            alt={flxReporting.image.alt}
            width={flxReporting.image.width}
            height={flxReporting.image.height}
            sizes="(min-width: 900px) 56vw, 100vw"
            className="flx-reporting__img"
          />
          <figcaption className="flx-note">{flxReporting.note}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function FlxDeploy() {
  return (
    <section id={flxDeploy.id} className="flx-section flx-deploy" aria-labelledby="flx-deploy-title">
      <div className="flx-wrap flx-deploy__grid">
        <div className="flx-deploy__left">
          <p className="flx-kicker">{flxDeploy.kicker}</p>
          <h2 id="flx-deploy-title" className="flx-h2">
            {flxDeploy.titleLines.map((l) => (
              <span key={l} className="flx-line">
                {l}
              </span>
            ))}
            <span className="flx-line">
              <span className="flx-underline">{flxDeploy.titleUnderline}</span>
            </span>
          </h2>
          <div className="flx-deploy__stage">
            <p className="flx-deploy__lead">{flxDeploy.lead}</p>
            <div className="flx-deploy__media">
              <Image
                src={flxDeploy.image.src}
                alt={flxDeploy.image.alt}
                width={flxDeploy.image.width}
                height={flxDeploy.image.height}
                sizes="(min-width: 900px) 44vw, 100vw"
                className="flx-deploy__img"
              />
            </div>
          </div>
        </div>
        <div className="flx-deploy__right">
          <ol className="flx-deploy__steps">
            {flxDeploy.steps.map((s, i) => (
              <li key={s.title}>
                <span className="flx-step-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="flx-deploy__step-text">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="flx-note flx-note--info">
            <FlxIcon name="info" strokeWidth={1.6} />
            {flxDeploy.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export function FlxCta() {
  return (
    <section className="flx-cta" aria-labelledby="flx-cta-title">
      <Image
        src={flxCta.image.src}
        alt={flxCta.image.alt}
        width={flxCta.image.width}
        height={flxCta.image.height}
        sizes="100vw"
        className="flx-cta__img"
      />
      <div className="flx-wrap flx-cta__inner">
        <h2 id="flx-cta-title" className="flx-h2 flx-h2--cta">
          {flxCta.titleLines.map((l) => (
            <span key={l} className="flx-line">
              {l}
            </span>
          ))}
          <span className="flx-line">
            <span className="flx-underline">{flxCta.titleUnderline}</span>
            {flxCta.titleAfter}
          </span>
        </h2>
        <p className="flx-cta__lead">{flxCta.lead}</p>
        <div className="flx-cta__actions">
          <Link href={flxCta.primary.href} className="flx-btn flx-btn--yellow">
            {flxCta.primary.label}
            <FlxIcon name="arrowUpRight" />
          </Link>
          <Link href={flxCta.secondary.href} className="flx-btn flx-btn--outline">
            {flxCta.secondary.label}
            <FlxIcon name="arrowUpRight" />
          </Link>
        </div>
        <a href={flxCta.phone.href} className="flx-cta__phone">
          <FlxIcon name="phone" strokeWidth={1.8} />
          {flxCta.phone.label}
        </a>
      </div>
    </section>
  );
}

export function FlxExplore() {
  return (
    <nav className="flx-explore" aria-labelledby="flx-explore-title">
      <div className="flx-wrap">
        <p id="flx-explore-title" className="flx-kicker">
          {flxExplore.kicker}
        </p>
        <ul className="flx-explore__list">
          {flxExplore.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <FlxIcon name={l.icon} strokeWidth={1.4} />
                <span className="flx-explore__text">
                  <strong>
                    {l.title}
                    <FlxIcon name="arrowRight" className="flx-explore__arrow" strokeWidth={1.8} />
                  </strong>
                  <span>{l.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
