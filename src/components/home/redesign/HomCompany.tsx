import Image from "next/image";
import Link from "next/link";
import { homCompany, homIds } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomCompany() {
  return (
    <section id={homIds.company} data-section="company" className="hom-company" aria-labelledby="hom-company-title">
      <span className="hom-worlddots" aria-hidden />
      <div className="hom-wrap hom-company__grid">
        <div className="hom-company__media">
          <div className="hom-company__mosaic">
            {homCompany.photos.map((photo, index) => (
              <figure key={photo.src} className={`hom-company__photo hom-company__photo--${index + 1}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={index === 0 ? "(max-width: 900px) 100vw, 44vw" : "(max-width: 900px) 50vw, 22vw"}
                  className="hom-company__img"
                  style={{ objectPosition: photo.position }}
                />
              </figure>
            ))}
          </div>
          <p className="hom-company__caption">
            <span>{homCompany.captionArchives}</span>
            <span className="hom-company__caption-rule" aria-hidden />
          </p>
        </div>

        <div className="hom-company__copy">
          <p className="hom-eyebrow hom-eyebrow--rule-after">{homCompany.eyebrow}</p>
          <h2 id="hom-company-title" className="hom-h2 hom-h2--xl">
            {homCompany.title}
          </h2>
          <p className="hom-company__lead">{homCompany.lead}</p>
          <dl className="hom-company__facts">
            {homCompany.facts.map((fact) => (
              <div key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
          <p className="hom-company__text">{homCompany.text}</p>
          <Link href={homCompany.primary.href} className="hom-btn hom-btn--dark">
            {homCompany.primary.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
          </Link>
          <Link href={homCompany.team.href} className="hom-link hom-company__team">
            {homCompany.team.label}
            <HomIcon name="arrowRight" className="hom-link__icon" />
          </Link>
          <div className="hom-canal">
            <span className="hom-canal__play" aria-hidden>
              <HomIcon name="play" />
            </span>
            <span className="hom-canal__text">
              <strong>{homCompany.canal.title}</strong>
              <span>{homCompany.canal.detail}</span>
              <Link href={homCompany.canal.link.href} className="hom-link hom-link--small">
                {homCompany.canal.link.label}
                <HomIcon name="arrowUpRight" className="hom-link__icon" />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}