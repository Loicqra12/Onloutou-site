import Link from "next/link";
import { expMethod, expTender } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";
import { ExpPicture } from "./ExpPicture";

export function ExpMethod() {
  return (
    <>
      <section className="exp-method" aria-labelledby="exp-method-title">
        <div className="exp-method__panel">
          <p className="exp-eyebrow">{expMethod.kicker}</p>
          <h2 id="exp-method-title" className="exp-h2 exp-h2--light">
            {expMethod.titleLines.map((line) => (
              <span key={line} className="exp-h2__line">
                {line}{" "}
              </span>
            ))}
          </h2>
          <ol className="exp-steps">
            {expMethod.steps.map((step) => (
              <li key={step.number} className="exp-step">
                <p className="exp-step__rule">
                  <span className="exp-step__number">{step.number}</span>
                </p>
                <h3 className="exp-step__title">{step.title}</h3>
                <p className="exp-step__text">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="exp-method__note">{expMethod.note}</p>
        </div>
        <figure className="exp-method__visual">
          <ExpPicture
            id={expMethod.image.id}
            alt={expMethod.image.alt}
            scene="method"
            sizes="(max-width: 900px) 100vw, 44vw"
          />
          <figcaption className="exp-caption">{expMethod.image.caption}</figcaption>
        </figure>
      </section>

      <section className="exp-tender" aria-labelledby="exp-tender-title">
        <ExpIcon name="doc" className="exp-tender__icon" />
        <div className="exp-tender__copy">
          <h2 id="exp-tender-title" className="exp-tender__title">
            {expTender.title}
          </h2>
          <p className="exp-tender__text">{expTender.text}</p>
        </div>
        <Link href={expTender.cta.href} className="exp-btn exp-btn--black">
          {expTender.cta.label}
          <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
        </Link>
      </section>
    </>
  );
}