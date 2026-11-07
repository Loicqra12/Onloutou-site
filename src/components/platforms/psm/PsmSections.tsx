import Image from "next/image";
import Link from "next/link";
import {
  psmAdoption,
  psmConnect,
  psmFinalCta,
  psmImages,
  psmInfo,
  psmMethod,
  psmModules,
  psmOversight,
  psmResponsibilities,
} from "@/content/platform-page";
import { site } from "@/content/site";
import { PsmIcon } from "./PsmIcon";

function Title({ lines, id, as: Tag = "h2" }: { lines: readonly string[]; id: string; as?: "h2" | "h3" }) {
  return (
    <Tag id={id} className="psm-h2">
      {lines.map((line) => (
        <span key={line} className="psm-line">
          {line}
        </span>
      ))}
    </Tag>
  );
}

/* Du terrain au numérique */
export function PsmConnect() {
  return (
    <section className="psm-section psm-section--dark" aria-labelledby="psm-connect-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmConnect.kicker}</p>
        <Title lines={psmConnect.titleLines} id="psm-connect-title" />
        <p className="psm-lead">{psmConnect.lead}</p>
        <ul className="psm-trio">
          {psmConnect.cards.map((card) => {
            const img = psmImages[card.key];
            return (
              <li key={card.key}>
                <div className="psm-trio-photo">
                  <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 900px) 30vw, 100vw" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="psm-note">{psmConnect.note}</p>
      </div>
    </section>
  );
}

/* La bonne information */
export function PsmInfo() {
  return (
    <section className="psm-section psm-section--paper" aria-labelledby="psm-info-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmInfo.kicker}</p>
        <Title lines={psmInfo.titleLines} id="psm-info-title" />
        <p className="psm-lead">{psmInfo.lead}</p>
        <ul className="psm-info-grid">
          {psmInfo.cards.map((card) => (
            <li key={card.title}>
              <PsmIcon name={card.icon} className="psm-info-icon" strokeWidth={1.5} />
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="psm-note">{psmInfo.note}</p>
      </div>
    </section>
  );
}

/* Pilotage métier */
export function PsmOversight() {
  return (
    <section className="psm-section psm-section--dark" aria-labelledby="psm-oversight-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmOversight.kicker}</p>
        <Title lines={psmOversight.titleLines} id="psm-oversight-title" />
        <p className="psm-lead">{psmOversight.lead}</p>
        <ul className="psm-bullets">
          {psmOversight.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="psm-oversight-visual">
          <Image
            src={psmImages.dashboard.src}
            alt={psmImages.dashboard.alt}
            width={psmImages.dashboard.width}
            height={psmImages.dashboard.height}
            sizes="(min-width: 1024px) 1300px, 100vw"
          />
        </div>
        <p className="psm-note">{psmOversight.caption}</p>
      </div>
    </section>
  );
}

/* Méthode */
export function PsmMethod() {
  return (
    <section className="psm-section psm-section--white" aria-labelledby="psm-method-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmMethod.kicker}</p>
        <Title lines={psmMethod.titleLines} id="psm-method-title" />
        <p className="psm-lead">{psmMethod.lead}</p>
        <div className="psm-method">
          <div className="psm-method-head" aria-hidden="true">
            <span>{psmMethod.headStep}</span>
            <span>{psmMethod.headDeliverable}</span>
          </div>
          <ol>
            {psmMethod.steps.map((step) => (
              <li key={step.n}>
                <span className="psm-step-n">{step.n}</span>
                <strong className="psm-step-title">{step.title}</strong>
                <span className="psm-step-text">{step.text}</span>
                <span className="psm-step-deliverable">
                  <span className="psm-icon-disc psm-icon-disc--sm" aria-hidden="true">
                    <PsmIcon name={step.icon} />
                  </span>
                  <span>
                    <span className="psm-sr">Livrable indicatif : </span>
                    {step.deliverable}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Adoption */
export function PsmAdoption() {
  return (
    <section className="psm-section psm-section--paper" aria-labelledby="psm-adoption-title">
      <div className="psm-wrap psm-adoption">
        <div className="psm-adoption-copy">
          <p className="psm-kicker">{psmAdoption.kicker}</p>
          <Title lines={psmAdoption.titleLines} id="psm-adoption-title" />
          <p className="psm-lead">{psmAdoption.lead}</p>
          <ul className="psm-adoption-list">
            {psmAdoption.items.map((item) => (
              <li key={item.title}>
                <span className="psm-icon-disc" aria-hidden="true">
                  <PsmIcon name={item.icon} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="psm-note">{psmAdoption.note}</p>
        </div>
        <div className="psm-adoption-photo">
          <Image
            src={psmImages.adoption.src}
            alt={psmImages.adoption.alt}
            width={psmImages.adoption.width}
            height={psmImages.adoption.height}
            sizes="(min-width: 900px) 48vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

/* Modules */
export function PsmModules() {
  return (
    <section className="psm-section psm-section--white psm-section--modules" aria-labelledby="psm-modules-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmModules.kicker}</p>
        <h2 id="psm-modules-title" className="psm-h2">
          {psmModules.title}
        </h2>
        <ul className="psm-modules">
          {psmModules.groups.map((group) => (
            <li key={group.title}>
              <span className="psm-icon-disc psm-icon-disc--yellow" aria-hidden="true">
                <PsmIcon name={group.icon} />
              </span>
              <div>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="psm-note">{psmModules.note}</p>
      </div>
    </section>
  );
}

/* Responsabilités */
export function PsmResponsibilities() {
  return (
    <section className="psm-section psm-section--dark psm-section--cadre" aria-labelledby="psm-resp-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmResponsibilities.kicker}</p>
        <Title lines={psmResponsibilities.titleLines} id="psm-resp-title" />
        <ul className="psm-resp">
          {psmResponsibilities.items.map((item) => (
            <li key={item.title}>
              <span className="psm-icon-disc psm-icon-disc--dark" aria-hidden="true">
                <PsmIcon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="psm-note">{psmResponsibilities.note}</p>
      </div>
    </section>
  );
}

/* CTA final */
export function PsmFinalCta() {
  return (
    <section className="psm-cta" aria-labelledby="psm-cta-title">
      <div className="psm-cta-photo" aria-hidden="true">
        <Image
          src={psmImages.cta.src}
          alt=""
          fill
          sizes="60vw"
          style={{ objectFit: "cover", objectPosition: "72% 40%" }}
        />
      </div>
      <div className="psm-wrap psm-cta-inner">
        <h2 id="psm-cta-title" className="psm-cta-title">
          <span className="psm-line">{psmFinalCta.titleLine1}</span>
          <span className="psm-line">
            {psmFinalCta.titleBefore}
            <span className="psm-underline">{psmFinalCta.titleHighlight}</span>
          </span>
        </h2>
        <p className="psm-cta-lead">{psmFinalCta.lead}</p>
        <div className="psm-cta-actions">
          <Link href={psmFinalCta.primary.href} className="psm-btn psm-btn--yellow">
            {psmFinalCta.primary.label}
            <PsmIcon name="arrowUpRight" strokeWidth={2.2} />
          </Link>
          <a href={`tel:${site.phoneTel}`} className="psm-cta-phone">
            <span className="psm-icon-disc psm-icon-disc--light" aria-hidden="true">
              <PsmIcon name="phone" strokeWidth={2} />
            </span>
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
