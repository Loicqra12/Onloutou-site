import { IlluConfirm, IlluDescribe, IlluPropose, IlluStudy } from "@/components/illustrations/StepIllustrations";
import Image from "next/image";
import { cmeConditions, cmeImage, cmeImageSize, cmeSteps } from "@/content/trucks-hub";
import { CmeIcon } from "./CmeIcon";

export function CmeConditions() {
  const c = cmeConditions;
  return (
    <section id="conditions" className="cme-section cme-conditions" aria-labelledby="cme-conditions-title">
      <div className="cme-wrap">
        <h2 id="cme-conditions-title" className="cme-h2 cme-h2--sm">
          <span className="cme-underline">{c.title.slice(0, 3)}</span>
          {c.title.slice(3)}
        </h2>
        <p className="cme-lead">{c.lead}</p>
        <ul className="cme-cond">
          {c.cards.map((card) => {
            const [w, h] = cmeImageSize[card.image];
            return (
              <li key={card.title} className="cme-cond__card">
                <div className="cme-cond__head">
                  <div className="cme-cond__media">
                    <Image src={cmeImage(card.image)} alt={card.alt} width={w} height={h} sizes="(min-width: 900px) 16vw, 40vw" className="cme-cond__img" />
                  </div>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </div>
                <ul className="cme-cond__rows">
                  {card.rows.map((r) => (
                    <li key={r.label}>
                      <CmeIcon name={r.icon} strokeWidth={1.4} />
                      <strong>{r.label}</strong>
                      <span>{r.text}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="cme-cond__note">
          <CmeIcon name="info" strokeWidth={1.5} />
          {c.note}
        </p>
      </div>
    </section>
  );
}

const CME_ILLU = [<IlluDescribe key="d" />, <IlluStudy key="s" />, <IlluPropose key="p" />, <IlluConfirm key="c" />];

export function CmeSteps() {
  const s = cmeSteps;
  return (
    <section id="comment-ca-marche" className="cme-section cme-steps" aria-labelledby="cme-steps-title">
      <div className="cme-wrap">
        <h2 id="cme-steps-title" className="cme-h2 cme-h2--xs">
          <span className="cme-underline">{s.title.slice(0, 7)}</span>
          {s.title.slice(7)}
        </h2>
        <ol className="cme-steps__list">
          {s.items.map((it) => (
            <li key={it.n}>
              <span className="step-illu">{CME_ILLU[it.n - 1]}</span>
              <span className="cme-steps__num" aria-hidden="true">
                {it.n}
              </span>
              <CmeIcon name={it.icon} strokeWidth={1.4} className="cme-steps__icon" />
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
