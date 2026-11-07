import Link from "next/link";
import { prjMissions } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";
import { PrjPicture } from "./PrjPicture";

export function PrjMissions() {
  return (
    <section id={prjMissions.id} className="prj-missions" aria-labelledby="prj-missions-title">
      {/* Anciens repères /projets#mobilite et /projets#supervision : mènent à cette section. */}
      <span id="mobilite" className="prj-alias" aria-hidden="true" />
      <span id="supervision" className="prj-alias" aria-hidden="true" />
      <div className="prj-missions__hero">
        <div className="prj-missions__copy">
          <p className="prj-eyebrow">{prjMissions.eyebrow}</p>
          <h2 id="prj-missions-title" className="prj-h2 prj-h2--light">
            {prjMissions.titleLines.map((line) => (
              <span key={line} className="prj-line">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="prj-missions__lead">{prjMissions.lead}</p>
          <ul className="prj-missions__chips">
            {prjMissions.chips.map((chip) => (
              <li key={chip.label}>
                <PrjIcon name={chip.icon} className="prj-missions__chip-icon" />
                <span>{chip.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <PrjPicture
          id={prjMissions.image.id}
          alt={prjMissions.image.alt}
          scene="missions"
          sizes="(max-width: 900px) 100vw, 50vw"
          caption={prjMissions.image.caption}
          className="prj-missions__visual"
        />
      </div>

      <ul className="prj-cases">
        {prjMissions.items.map((item) => (
          <li key={item.id} id={item.id} className="prj-case">
            <PrjPicture id={item.image} alt={item.alt} scene={item.scene} sizes="(max-width: 700px) 92vw, 46vw" className="prj-case__pic" />
            <div className="prj-case__body">
              <p className="prj-eyebrow">{item.kicker}</p>
              <h3 className="prj-h3">{item.title}</h3>
              <p className="prj-case__text">{item.text}</p>
              <dl className="prj-case__facts">
                <div className="prj-case__fact">
                  <dt>
                    <PrjIcon name="wrench" className="prj-case__fact-icon" />
                    <span>{prjMissions.labels.intervention}</span>
                  </dt>
                  <dd>{item.intervention}</dd>
                </div>
                <div className="prj-case__fact">
                  <dt>
                    <PrjIcon name="car" className="prj-case__fact-icon" />
                    <span>{prjMissions.labels.perimeter}</span>
                  </dt>
                  <dd>{item.perimeter}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>

      <div className="prj-band prj-band--yellow">
        <div className="prj-band__copy">
          <p className="prj-band__title">{prjMissions.band.title}</p>
          <p className="prj-band__text">{prjMissions.band.text}</p>
        </div>
        <a href={prjMissions.band.primary.href} className="prj-btn prj-btn--black">
          {prjMissions.band.primary.label}
          <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
        </a>
        <Link href={prjMissions.band.secondary.href} className="prj-link prj-link--dark">
          {prjMissions.band.secondary.label}
          <PrjIcon name="arrowUpRight" className="prj-link__icon" />
        </Link>
      </div>
    </section>
  );
}