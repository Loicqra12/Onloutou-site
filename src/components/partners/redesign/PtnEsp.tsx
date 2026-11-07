import Image from "next/image";
import Link from "next/link";
import { ptnImages } from "@/content/partners-hub";
import { ptnEspContact, ptnEspDashboard, ptnEspFeatures, ptnEspHero, ptnEspNotice } from "@/content/partner-spaces-hub";
import { siteMedia } from "@/content/media";
import { PtnIcon } from "./PtnIcon";
import { PtnPicture } from "./PtnPicture";

export function PtnEspHero() {
  return (
    <section className="ptn-hero ptn-esp-hero" aria-labelledby="ptn-esp-title">
      <div className="ptn-hero__copy">
        <p className="ptn-kicker-row">
          <span className="ptn-eyebrow">{ptnEspHero.eyebrow}</span>
          <span className="ptn-badge-inline">{ptnEspHero.badge}</span>
        </p>
        <h1 id="ptn-esp-title" className="ptn-h1">
          {ptnEspHero.titleLines.map((line) => (
            <span key={line} className="ptn-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="ptn-hero__lead">{ptnEspHero.lead}</p>
        <div className="ptn-hero__actions">
          <a href={ptnEspHero.primary.href} className="ptn-btn ptn-btn--yellow">
            {ptnEspHero.primary.label}
            <PtnIcon name="arrowDown" className="ptn-btn__icon" />
          </a>
          <Link href={ptnEspHero.secondary.href} className="ptn-btn ptn-btn--ghost">
            {ptnEspHero.secondary.label}
            <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
          </Link>
        </div>
        <p className="ptn-hero__note">{ptnEspHero.note}</p>
      </div>
      <PtnPicture
        id={ptnEspHero.image.id}
        alt={ptnEspHero.image.alt}
        scene="esp"
        priority
        sizes="(max-width: 900px) 100vw, 55vw"
        className="ptn-hero__visual ptn-esp-hero__visual"
      />
    </section>
  );
}

function Thumb({ id, name }: { id: keyof typeof ptnImages; name: string }) {
  const image = ptnImages[id];
  if (!image) return <span className="ptn-esp-thumb"><span className="ptn-sr">{name}</span></span>;
  return (
    <span className="ptn-esp-thumb">
      <Image src={image.src} alt="" width={image.width} height={image.height} sizes="60px" aria-hidden="true" />
      <span className="ptn-sr">{name}</span>
    </span>
  );
}

/** Maquette HTML/CSS du tableau de bord : données fictives, aucune connexion, aucune action. */
export function PtnEspDashboard() {
  const d = ptnEspDashboard;
  return (
    <section id={d.id} className="ptn-esp-dash" aria-label={d.label}>
      <div className="ptn-esp-dash__frame">
        <p className="ptn-esp-dash__bar">{d.bar}</p>
        <div className="ptn-esp-dash__body">
          <div className="ptn-esp-dash__side" aria-hidden="true">
            <p className="ptn-esp-dash__brand">
              <Image src={siteMedia.logo.src} alt="" width={siteMedia.logo.width} height={siteMedia.logo.height} sizes="56px" />
              <span>
                <b>ON</b>LOUTOU
              </span>
            </p>
            <p className="ptn-esp-dash__space">{d.brand}</p>
            <ul>
              {d.nav.map((item) => (
                <li key={item.label} className={item.active ? "is-active" : ""}>
                  <PtnIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="ptn-esp-dash__main">
            <h2 className="ptn-esp-dash__title">{d.title}</h2>
            <p className="ptn-esp-dash__lead">{d.lead}</p>
            <ul className="ptn-esp-dash__cards">
              {d.cards.map((card) => (
                <li key={card.title}>
                  <span className="ptn-esp-dash__ico">
                    <PtnIcon name={card.icon} />
                  </span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                  <span className="ptn-esp-chip">{card.chip}</span>
                </li>
              ))}
            </ul>
            <div className="ptn-esp-dash__grid">
              <div className="ptn-esp-panel">
                <div className="ptn-esp-panel__head">
                  <h3>{d.equipment.title}</h3>
                  <span className="ptn-esp-dash__link">
                    {d.equipment.link}
                  </span>
                </div>
                <table className="ptn-esp-table">
                  <thead>
                    <tr>
                      {d.equipment.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.equipment.rows.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <Thumb id={row.image} name={row.name} />
                          <b aria-hidden="true">{row.name}</b>
                        </td>
                        <td>
                          <span className="ptn-esp-chip ptn-esp-chip--grey">{row.availability}</span>
                        </td>
                        <td>
                          <span className="ptn-esp-chip ptn-esp-chip--grey">{row.zone}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ptn-esp-panel">
                <h3>{d.todo.title}</h3>
                <p className="ptn-esp-panel__lead">{d.todo.lead}</p>
                <ul className="ptn-esp-todo">
                  {d.todo.items.map((item) => (
                    <li key={item.title}>
                      <span className="ptn-esp-dash__ico ptn-esp-dash__ico--sm">
                        <PtnIcon name={item.icon} />
                      </span>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </div>
                      <span className="ptn-esp-dot" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PtnEspFeatures() {
  return (
    <>
      <section className="ptn-esp-features" aria-labelledby="ptn-esp-features-title">
        <p className="ptn-eyebrow">{ptnEspFeatures.eyebrow}</p>
        <h2 id="ptn-esp-features-title" className="ptn-h2 ptn-h2--feat">
          {ptnEspFeatures.title}
        </h2>
        <ul className="ptn-feats ptn-feats--three">
          {ptnEspFeatures.items.map((item) => (
            <li key={item.title} className="ptn-feat">
              <span className="ptn-feat__icon">
                <PtnIcon name={item.icon} />
              </span>
              <div>
                <h3 className="ptn-feat__title">{item.title}</h3>
                <p className="ptn-feat__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <p className="ptn-notice">
        <PtnIcon name="info" className="ptn-notice__icon" />
        <span>{ptnEspNotice}</span>
      </p>
    </>
  );
}

export function PtnEspContact() {
  return (
    <section className="ptn-esp-contact" aria-labelledby="ptn-esp-contact-title">
      <p className="ptn-eyebrow">{ptnEspContact.eyebrow}</p>
      <h2 id="ptn-esp-contact-title" className="ptn-h2 ptn-h2--feat">
        {ptnEspContact.title}
      </h2>
      <ul className="ptn-esp-contact__grid">
        {ptnEspContact.cards.map((card) => (
          <li key={card.id} className="ptn-esp-contact__card">
            <PtnPicture
              id={card.image.id}
              alt={card.image.alt}
              scene="office"
              sizes="(max-width: 700px) 90vw, 20vw"
              className="ptn-esp-contact__pic"
            />
            <div className="ptn-esp-contact__body">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link href={card.cta.href} className={`ptn-btn ptn-btn--sm ptn-btn--${card.variant}`}>
                {card.cta.label}
                <PtnIcon name="arrowUpRight" className="ptn-btn__icon" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}