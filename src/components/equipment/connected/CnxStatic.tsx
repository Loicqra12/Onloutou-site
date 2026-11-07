import Image from "next/image";
import Link from "next/link";
import { cnxDashboard, cnxIds, cnxImage, cnxImageSize, cnxInfo, cnxSolutions, cnxSteps } from "@/content/connected-hub";
import { CnxIcon } from "./CnxIcon";

function CnxDashboard() {
  const d = cnxDashboard;
  return (
    <figure className="cnx-dash" aria-label={d.label}>
      <div className="cnx-dash__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="cnx-dash__body">
        <nav className="cnx-dash__menu" aria-hidden="true">
          {d.menu.map((m) => (
            <span key={m.label} className={m.active ? "is-on" : undefined}>
              <CnxIcon name={m.icon} strokeWidth={1.6} />
              {m.label}
            </span>
          ))}
        </nav>
        <div className="cnx-dash__map-col">
          <div className="cnx-dash__head">
            <strong>{d.title}</strong>
            <span className="cnx-dash__pill">
              {d.filter}
              <CnxIcon name="chevronDown" strokeWidth={2} />
            </span>
          </div>
          <div className="cnx-dash__map" aria-hidden="true">
            <svg viewBox="0 0 300 250" preserveAspectRatio="xMidYMid slice">
              <rect width="300" height="250" fill="#ebe7df" />
              <path d="M0 150 C40 120 70 150 110 140 C150 130 170 95 215 108 C250 118 280 100 300 90 L300 250 L0 250Z" fill="#c7dcea" />
              <path d="M110 140 C130 175 160 165 175 195 C185 215 215 215 230 240 L300 250 L300 200 C270 190 255 160 230 150 C200 140 190 175 170 160 C150 145 130 120 110 140Z" fill="#d6e6f0" />
              <path d="M0 60 C50 70 90 40 140 52 C190 64 240 30 300 48" stroke="#f3d46a" strokeWidth="3" fill="none" />
              <path d="M40 0 C60 60 90 100 120 135 M180 0 C170 40 190 70 210 105 M0 110 C60 100 90 112 118 128" stroke="#f6e29a" strokeWidth="2.5" fill="none" />
              <path d="M10 200 C70 180 100 205 150 185 M200 120 C230 140 260 130 300 150" stroke="#fff" strokeWidth="2" fill="none" />
              <path d="M70 20 L120 120 M250 0 L225 100 M0 85 L100 95" stroke="#fff" strokeWidth="1.6" fill="none" />
            </svg>
            <span className="cnx-dash__area" style={{ left: "62%", top: "20%" }}>COCODY</span>
            <span className="cnx-dash__city">Abidjan</span>
            <span className="cnx-dash__area" style={{ left: "14%", top: "70%" }}>PLATEAU</span>
            <span className="cnx-dash__area" style={{ left: "58%", top: "86%" }}>MARCORY</span>
            <span className="cnx-dash__area" style={{ left: "30%", top: "96%" }}>TREICHVILLE</span>
            <span className="cnx-pin cnx-pin--a" style={{ left: "46%", top: "13%" }}>
              <b>
                <CnxIcon name="truck" strokeWidth={2} />
              </b>
              <em>Actif A</em>
            </span>
            <span className="cnx-pin cnx-pin--b" style={{ left: "17%", top: "44%" }}>
              <b>
                <CnxIcon name="building" strokeWidth={2} />
              </b>
              <em>Actif B</em>
            </span>
            <span className="cnx-pin cnx-pin--c" style={{ left: "62%", top: "66%" }}>
              <b>
                <CnxIcon name="pin" strokeWidth={2} />
              </b>
              <em>Actif C</em>
            </span>
            <span className="cnx-dash__zoom">
              <i>+</i>
              <i>−</i>
            </span>
          </div>
        </div>
        <div className="cnx-dash__events">
          <div className="cnx-dash__head">
            <strong>{d.eventsTitle}</strong>
            <span className="cnx-dash__pill">
              {d.eventsFilter}
              <CnxIcon name="chevronDown" strokeWidth={2} />
            </span>
          </div>
          <ul>
            {d.events.map((e, i) => (
              <li key={i}>
                <span className={`cnx-dash__ev cnx-dash__ev--${e.tone}`}>
                  <CnxIcon name={e.icon} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>{e.asset}</strong>
                  <span>{e.when}</span>
                  <span>{e.what}</span>
                </div>
                <CnxIcon name="chevronRight" strokeWidth={2} className="cnx-dash__go" />
              </li>
            ))}
          </ul>
          <p>{d.footer}</p>
        </div>
      </div>
    </figure>
  );
}

export function CnxInfo() {
  const s = cnxInfo;
  return (
    <section className="cnx-info" aria-labelledby="cnx-info-title">
      <div className="cnx-wrap cnx-info__grid">
        <div className="cnx-info__copy">
          <h2 id="cnx-info-title" className="cnx-h2 cnx-h2--info">
            {s.title.map((l) => (
              <span key={l} className="cnx-line">
                {l}{" "}
              </span>
            ))}
          </h2>
          <span className="cnx-info__bar" aria-hidden="true" />
          <p className="cnx-info__lead">{s.lead}</p>
          <ul className="cnx-info__rows">
            {s.rows.map((r) => (
              <li key={r.title}>
                <span className="cnx-info__icon" aria-hidden="true">
                  <CnxIcon name={r.icon} strokeWidth={1.6} />
                </span>
                <div>
                  <strong>{r.title}</strong>
                  <span>{r.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="cnx-info__visual">
          <CnxDashboard />
          <p className="cnx-info__note">
            <CnxIcon name="info" strokeWidth={1.5} />
            {s.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CnxSteps() {
  const s = cnxSteps;
  return (
    <section id={cnxIds.steps} className="cnx-section cnx-steps" aria-labelledby="cnx-steps-title">
      <div className="cnx-wrap">
        <h2 id="cnx-steps-title" className="cnx-h2 cnx-h2--md cnx-h2--bar">
          {s.title}
        </h2>
        <ol className="cnx-steps__list">
          {s.items.map((it, i) => (
            <li key={it.title}>
              <div className="cnx-steps__card">
                <span className="cnx-steps__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CnxIcon name={it.icon} strokeWidth={1.5} className="cnx-steps__icon" />
                <strong>{it.title}</strong>
                <span>{it.text}</span>
              </div>
              {i < s.items.length - 1 ? <CnxIcon name="arrowRight" strokeWidth={1.8} className="cnx-steps__arrow" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CnxSolutions() {
  const s = cnxSolutions;
  return (
    <div className="cnx-solutions" aria-labelledby="cnx-solutions-title">
      <h2 id="cnx-solutions-title" className="cnx-h2 cnx-h2--xs">
        {s.title}
      </h2>
      <ul className="cnx-solutions__grid">
        {s.cards.map((c) => {
          const [w, h] = cnxImageSize[c.image];
          return (
            <li key={c.title}>
              <Link href={c.href} className="cnx-scard">
                <span className={`cnx-scard__media cnx-stone--${c.tone}`}>
                  <Image src={cnxImage(c.image)} alt={c.alt} width={w} height={h} sizes="(min-width: 1100px) 14vw, 30vw" className="cnx-scard__img" />
                </span>
                <span className="cnx-scard__body">
                  <strong>
                    {c.title}
                    <CnxIcon name="arrowRight" strokeWidth={1.8} />
                  </strong>
                  <span>{c.text}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
