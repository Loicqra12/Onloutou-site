import Image from "next/image";
import { temFlow, temProposal, temShowroom, temSteps, temImage } from "@/content/tools-hub";
import { TemIcon } from "./TemIcon";
import { TemLink } from "./TemLink";

export function TemShowroom() {
  return (
    <section className="tem-showroom" aria-labelledby="tem-showroom-title">
      <div className="tem-showroom__copy">
        <span className="tem-showroom__dash" aria-hidden="true" />
        <h2 id="tem-showroom-title" className="tem-h2 tem-h2--cta">
          {temShowroom.title.map((l) => (
            <span key={l} className="tem-line">
              {l}
            </span>
          ))}
        </h2>
        <p>{temShowroom.text}</p>
        <TemLink target="demande-materiel" className="tem-btn tem-btn--yellow">
          {temShowroom.cta}
          <TemIcon name="arrowUpRight" />
        </TemLink>
      </div>
      <div className="tem-showroom__media">
        <Image
          src={temShowroom.image.src}
          alt={temShowroom.image.alt}
          width={temShowroom.image.width}
          height={temShowroom.image.height}
          sizes="(min-width: 900px) 50vw, 100vw"
          className="tem-showroom__img"
        />
      </div>
    </section>
  );
}

export function TemSteps() {
  return (
    <section className="tem-steps" aria-label="Comment se déroule votre demande">
      <ol className="tem-wrap tem-steps__list">
        {temSteps.map((s, i) => (
          <li key={s.title}>
            <span className="tem-steps__num">{String(i + 1).padStart(2, "0")}</span>
            <TemIcon name={s.icon} strokeWidth={1.4} />
            <span className="tem-steps__text">
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TemFlow() {
  return (
    <section className="tem-flow-wrap" aria-label="Étapes après votre demande">
      <div className="tem-wrap">
        <ol className="tem-flow">
          {temFlow.map((s, i) => (
            <li key={s.title}>
              <span className="tem-flow__num">{i + 1}</span>
              <TemIcon name={s.icon} strokeWidth={1.4} className="tem-flow__icon" />
              <span className="tem-flow__text">
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </span>
              {i < temFlow.length - 1 ? <TemIcon name="chevronRight" strokeWidth={2} className="tem-flow__sep" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TemProposal() {
  return (
    <section id="proposition" className="tem-section tem-proposal" aria-labelledby="tem-proposal-title">
      <div className="tem-wrap">
        <h2 id="tem-proposal-title" className="tem-h2 tem-h2--sm">
          <span className="tem-underline">{temProposal.titleBefore}</span>
          {temProposal.titleAfter}
        </h2>
        <ul className="tem-proposal__grid">
          {temProposal.cards.map((c) => (
            <li key={c.title.join(" ")} className="tem-pcard">
              <div className="tem-pcard__media" aria-hidden="true">
                <Image src={temImage(c.image)} alt="" width={c.size[0]} height={c.size[1]} sizes="(min-width: 900px) 20vw, 50vw" className="tem-pcard__img" />
              </div>
              <span className="tem-pcard__icon">
                <TemIcon name={c.icon} strokeWidth={1.6} />
              </span>
              <h3>
                {c.title.map((l) => (
                  <span key={l} className="tem-line">
                    {l}
                  </span>
                ))}
              </h3>
              <ul className="tem-pcard__items">
                {c.items.map((it) => (
                  <li key={it}>
                    <TemIcon name="check" strokeWidth={2.4} />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
