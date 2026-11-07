import Image from "next/image";
import { mopImage, mopImageSize, mopPrep, mopProposal } from "@/content/motos-hub";
import { MopIcon } from "./MopIcon";

export function MopPrep() {
  const p = mopPrep;
  const [w, h] = mopImageSize[p.image.id];
  return (
    <section className="mop-prep" aria-labelledby="mop-prep-title">
      <div className="mop-prep__bg" aria-hidden="true" />
      <div className="mop-wrap mop-prep__grid">
        <div className="mop-prep__copy">
          <p className="mop-kicker">{p.eyebrow}</p>
          <h2 id="mop-prep-title" className="mop-h2 mop-h2--prep">
            <span className="mop-line">{p.titleLines[0]} </span>
            <span className="mop-line">
              {p.titleLines[1]} <span className="mop-underline">{p.titleUnderline}</span>{" "}
            </span>
            <span className="mop-line">{p.titleAfter}</span>
          </h2>
          <p className="mop-prep__lead">{p.lead}</p>
        </div>
        <div className="mop-prep__photo">
          <Image src={mopImage(p.image.id)} alt={p.image.alt} width={w} height={h} sizes="(min-width: 900px) 40vw, 90vw" className="mop-prep__img" />
        </div>
        <div className="mop-prep__steps">
          <ol aria-label={p.stepsTitle}>
            {p.steps.map((s, i) => (
              <li key={s.title}>
                <span className="mop-prep__num" aria-hidden="true">
                  {i + 1}
                </span>
                <MopIcon name={s.icon} strokeWidth={1.5} />
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="mop-prep__note">
            <MopIcon name="info" strokeWidth={1.5} />
            {p.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export function MopProposal() {
  const p = mopProposal;
  return (
    <section id="proposition" className="mop-section mop-proposal" aria-labelledby="mop-proposal-title">
      <div className="mop-wrap">
        <h2 id="mop-proposal-title" className="mop-sr">
          {p.title}
        </h2>
        <ul className="mop-proposal__grid">
          {p.cards.map((c) => (
            <li key={c.title} className="mop-pcard">
              <span className="mop-pcard__icon" aria-hidden="true">
                <MopIcon name={c.icon} strokeWidth={1.6} />
              </span>
              <div>
                <h3>{c.title}</h3>
                <ul>
                  {c.lines.map((l) => (
                    <li key={l}>
                      <MopIcon name="check" strokeWidth={2.4} />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
