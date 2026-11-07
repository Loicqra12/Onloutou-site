import Image from "next/image";
import { vhpImage, vhpImageSize, vhpMission, vhpProposal } from "@/content/vehicles-hub";
import { VhpIcon } from "./VhpIcon";

export function VhpMission() {
  const m = vhpMission;
  const [w, h] = vhpImageSize[m.image.id];
  return (
    <section className="vhp-mission" aria-labelledby="vhp-mission-title">
      <div className="vhp-mission__photo">
        <div className="vhp-mission__bg" aria-hidden="true" />
        <Image src={vhpImage(m.image.id)} alt={m.image.alt} width={w} height={h} sizes="(min-width: 900px) 60vw, 100vw" className="vhp-mission__img" />
      </div>
      <div className="vhp-mission__panel">
        <h2 id="vhp-mission-title" className="vhp-h2 vhp-h2--mission">
          <span className="vhp-line">{m.titleLines[0]}</span>{" "}
          <span className="vhp-line">
            <span className="vhp-underline">{m.titleLines[1]}</span>
          </span>
        </h2>
        <ul className="vhp-mission__rows">
          {m.rows.map((r) => (
            <li key={r.title}>
              <span className="vhp-mission__icon" aria-hidden="true">
                <VhpIcon name={r.icon} strokeWidth={1.6} />
              </span>
              <div>
                <strong>{r.title}</strong>
                <span>{r.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function VhpProposal() {
  const p = vhpProposal;
  return (
    <section id="proposition" className="vhp-section vhp-proposal" aria-labelledby="vhp-proposal-title">
      <div className="vhp-wrap">
        <h2 id="vhp-proposal-title" className="vhp-h2 vhp-h2--sm">
          {p.title}
        </h2>
        <ul className="vhp-proposal__grid">
          {p.cards.map((c) => {
            const [w, h] = vhpImageSize[c.image];
            return (
              <li key={c.title} className="vhp-pcard">
                <div className="vhp-pcard__media">
                  <Image src={vhpImage(c.image)} alt={c.alt} width={w} height={h} sizes="(min-width: 900px) 14vw, 40vw" className="vhp-pcard__img" />
                </div>
                <div className="vhp-pcard__body">
                  <h3>
                    <span className="vhp-pcard__icon" aria-hidden="true">
                      <VhpIcon name={c.icon} strokeWidth={1.6} />
                    </span>
                    {c.title}
                  </h3>
                  <ul>
                    {c.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
