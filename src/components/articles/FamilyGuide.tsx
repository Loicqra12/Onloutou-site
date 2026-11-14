import type { ReactNode } from "react";
import Link from "next/link";
import { VhpIcon, type VhpIconName } from "@/components/vehicles/redesign/VhpIcon";

export type FamilyGuideItem = { icon: VhpIconName; title: string; text?: string };

export function FamilyGuide({
  prefix,
  title,
  uses,
  criteria,
  precisTitle,
  precis,
  otherHref,
  otherCta,
  otherLead,
}: {
  prefix: "elm" | "inf" | "mob" | "rec" | "enf";
  title: string;
  uses: FamilyGuideItem[];
  criteria: FamilyGuideItem[];
  precisTitle: string;
  precis: FamilyGuideItem[];
  otherHref: string;
  otherCta: string;
  otherLead: string;
}): ReactNode {
  return (
    <section className={`${prefix}-guide`} aria-labelledby={`${prefix}-guide-title`}>
      <h2 id={`${prefix}-guide-title`} className={`${prefix}-h2 ${prefix}-guide__title`}>
        {title}
      </h2>
      {uses.length ? (
        <ul className={`${prefix}-guide__uses`} aria-label="Principaux usages">
          {uses.map((item) => (
            <li key={item.title}>
              <VhpIcon name={item.icon} strokeWidth={1.5} />
              {item.title}
            </li>
          ))}
        </ul>
      ) : null}
      <div className={`${prefix}-guide__grid`}>
        <div>
          <h3>Critères à préciser</h3>
          <ul className={`${prefix}-guide__criteria`}>
            {criteria.map((item) => (
              <li key={item.title}>
                <VhpIcon name={item.icon} strokeWidth={1.4} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{precisTitle}</h3>
          <ul className={`${prefix}-guide__precis`}>
            {precis.map((item) => (
              <li key={item.title}>
                <VhpIcon name={item.icon} strokeWidth={1.4} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`${prefix}-other`}>
        <VhpIcon name="notePen" strokeWidth={1.3} className={`${prefix}-other__icon`} />
        <p className={`${prefix}-other__copy`}>
          <strong>{otherCta}</strong>
          <span>{otherLead}</span>
        </p>
        <Link href={otherHref} className={`${prefix}-btn ${prefix}-btn--yellow`}>
          {otherCta}
          <VhpIcon name="arrowUpRight" />
        </Link>
      </div>
    </section>
  );
}
