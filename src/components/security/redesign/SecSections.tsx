import Image from "next/image";
import Link from "next/link";
import { secCta, secDevice, secExplore, secFrame, secReferences } from "@/content/security-hub";
import { SecIcon } from "./SecIcon";

export function SecDevice() {
  return (
    <section id={secDevice.id} className="sec-section sec-device" aria-labelledby="sec-device-title">
      <div className="sec-wrap">
        <p className="sec-kicker">{secDevice.kicker}</p>
        <h2 id="sec-device-title" className="sec-h2">
          {secDevice.title}
        </h2>
        <p className="sec-lead">{secDevice.lead}</p>
        <ul className="sec-device__grid">
          {secDevice.cards.map((c, i) => (
            <li key={c.title}>
              <Link href={c.href} className="sec-card">
                <span className="sec-card__top">
                  <span className="sec-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <SecIcon name={c.icon} strokeWidth={1.4} />
                  <SecIcon name="arrowRight" className="sec-card__arrow" strokeWidth={1.8} />
                </span>
                <strong>{c.title}</strong>
                <span className="sec-card__text">{c.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="sec-note sec-note--bar">{secDevice.note}</p>
      </div>
    </section>
  );
}

export function SecFrame() {
  return (
    <section id={secFrame.id} className="sec-frame" aria-labelledby="sec-frame-title">
      <div className="sec-frame__left">
        <p className="sec-kicker">{secFrame.kicker}</p>
        <h2 id="sec-frame-title" className="sec-h2 sec-h2--md">
          {secFrame.titleLines.map((l) => (
            <span key={l} className="sec-line">
              {l}
            </span>
          ))}
          <span className="sec-line">
            <span className="sec-underline">{secFrame.titleUnderline}</span>
          </span>
        </h2>
        <p className="sec-lead">{secFrame.lead}</p>
        <ul className="sec-frame__rows">
          {secFrame.rows.map((r) => (
            <li key={r.label}>
              <Link href={r.href}>
                <span className="sec-frame__ico">
                  <SecIcon name={r.icon} strokeWidth={1.6} />
                </span>
                <span>{r.label}</span>
                <SecIcon name="arrowRight" strokeWidth={1.8} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sec-frame__media">
        <Image
          src={secFrame.image.src}
          alt={secFrame.image.alt}
          width={secFrame.image.width}
          height={secFrame.image.height}
          sizes="(min-width: 900px) 30vw, 100vw"
          className="sec-frame__img"
        />
      </div>
      <div id={secFrame.brief.id} className="sec-frame__right">
        <div className="sec-brief">
          <h3>{secFrame.brief.title}</h3>
          <ol>
            {secFrame.brief.items.map((it, i) => (
              <li key={it}>
                <Link href={secFrame.brief.href}>
                  <span className="sec-brief__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{it}</span>
                  <SecIcon name="arrowRight" strokeWidth={1.8} />
                </Link>
              </li>
            ))}
          </ol>
          <p className="sec-brief__warn">
            <SecIcon name="info" strokeWidth={1.8} />
            {secFrame.brief.warning}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SecReferences() {
  return (
    <section id={secReferences.id} className="sec-refs" aria-labelledby="sec-refs-title">
      <div className="sec-wrap sec-refs__grid">
        <div>
          <p className="sec-kicker">{secReferences.kicker}</p>
          <h2 id="sec-refs-title" className="sec-h2 sec-h2--md">
            {secReferences.titleLines.map((l) => (
              <span key={l} className="sec-line">
                {l}
              </span>
            ))}
          </h2>
        </div>
        <div className="sec-refs__text">
          <p>{secReferences.text}</p>
          <p className="sec-refs__disclaimer">{secReferences.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

export function SecCta() {
  return (
    <section id={secCta.id} className="sec-cta" aria-labelledby="sec-cta-title">
      <div className="sec-cta__copy">
        <p className="sec-kicker sec-kicker--dark">{secCta.kicker}</p>
        <h2 id="sec-cta-title" className="sec-h2 sec-h2--cta">
          {secCta.titleLines.map((l) => (
            <span key={l} className="sec-line">
              {l}
            </span>
          ))}
        </h2>
        <p className="sec-cta__lead">{secCta.lead}</p>
        <div className="sec-cta__actions">
          <Link href={secCta.primary.href} className="sec-btn sec-btn--black">
            {secCta.primary.label}
            <SecIcon name="arrowUpRight" />
          </Link>
          <a href={secCta.whatsapp.href} className="sec-btn sec-btn--outline" target="_blank" rel="noopener noreferrer">
            <SecIcon name="whatsapp" className="sec-btn__wa" />
            {secCta.whatsapp.label}
            <SecIcon name="arrowUpRight" />
          </a>
        </div>
        <a href={secCta.phone.href} className="sec-cta__phone">
          <SecIcon name="phone" strokeWidth={1.8} />
          {secCta.phone.label}
        </a>
      </div>
      <div className="sec-cta__media">
        <Image
          src={secCta.image.src}
          alt={secCta.image.alt}
          width={secCta.image.width}
          height={secCta.image.height}
          sizes="(min-width: 900px) 46vw, 100vw"
          className="sec-cta__img"
        />
      </div>
    </section>
  );
}

export function SecExplore() {
  return (
    <nav className="sec-explore" aria-labelledby="sec-explore-title">
      <div className="sec-wrap">
        <p id="sec-explore-title" className="sec-kicker">
          {secExplore.kicker}
        </p>
        <ul className="sec-explore__list">
          {secExplore.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <span className="sec-explore__head">
                  <SecIcon name={l.icon} strokeWidth={1.4} />
                  <strong>{l.title}</strong>
                </span>
                <span className="sec-explore__text">{l.text}</span>
                <SecIcon name="arrowRight" className="sec-explore__arrow" strokeWidth={1.8} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
