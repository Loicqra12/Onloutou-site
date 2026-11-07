import Link from "next/link";
import { expFinal } from "@/content/expertise-hub";
import { ExpIcon } from "./ExpIcon";

export function ExpFinal() {
  return (
    <section className="exp-final" aria-labelledby="exp-final-title">
      <ExpIcon name="people" className="exp-final__icon" />
      <div className="exp-final__copy">
        <h2 id="exp-final-title" className="exp-final__title">
          {expFinal.titleLines.map((line) => (
            <span key={line} className="exp-h2__line">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="exp-final__text">{expFinal.text}</p>
      </div>
      <div className="exp-final__actions">
        <Link href={expFinal.primary.href} className="exp-btn exp-btn--black">
          {expFinal.primary.label}
          <ExpIcon name="arrowUpRight" className="exp-btn__icon" />
        </Link>
        <Link href={expFinal.secondary.href} className="exp-link exp-link--dark">
          {expFinal.secondary.label}
          <ExpIcon name="arrowRight" className="exp-link__icon" />
        </Link>
      </div>
    </section>
  );
}