import Image from "next/image";
import Link from "next/link";
import { homIds, homMethod } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";
import { HomTitle } from "@/components/home/redesign/HomMark";

export function HomMethod() {
  return (
    <section id={homIds.method} data-section="terrain" className="hom-method" aria-labelledby="hom-method-title">
      <div className="hom-wrap hom-method__grid">
        <div className="hom-method__copy">
          <p className="hom-eyebrow hom-eyebrow--rule-before">{homMethod.eyebrow}</p>
          <h2 id="hom-method-title" className="hom-h2 hom-h2--xl">
            <HomTitle text={homMethod.title} mark={homMethod.titleMark} variant="line" />
          </h2>
          <p className="hom-method__lead">{homMethod.lead}</p>
          <Link href={homMethod.cta.href} className="hom-btn hom-btn--dark">
            {homMethod.cta.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
          </Link>
          <p className="hom-footnote">{homMethod.note}</p>
        </div>

        <div className="hom-cycle">
          <span className="hom-cycle__ring" aria-hidden />
          <span className="hom-cycle__core" aria-hidden>
            <Image
              src={homMethod.emblem.src}
              alt=""
              width={homMethod.emblem.width}
              height={homMethod.emblem.height}
              sizes="160px"
              className="hom-cycle__emblem"
            />
          </span>
          <ol className="hom-cycle__steps" aria-label="Méthode ONLOUTOU">
            {homMethod.steps.map((step, index) => (
              <li key={step.number} className={`hom-step hom-step--${index + 1}${step.active ? " is-active" : ""}`}>
                <span className="hom-step__dot" aria-hidden />
                <strong>
                  {step.number} · {step.title}
                </strong>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}