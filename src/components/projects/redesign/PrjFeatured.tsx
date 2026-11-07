import { prjFeatured } from "@/content/projects-hub";
import { PrjIcon } from "./PrjIcon";
import { PrjPicture } from "./PrjPicture";

export function PrjFeatured() {
  return (
    <section id={prjFeatured.id} className="prj-featured" aria-labelledby="prj-featured-title">
      <p className="prj-eyebrow">{prjFeatured.eyebrow}</p>
      <div className="prj-featured__title-row">
        <h2 id="prj-featured-title" className="prj-h2">
          {prjFeatured.title}
        </h2>
        <span className="prj-badge prj-badge--outline">{prjFeatured.badge}</span>
      </div>
      <p className="prj-lead">{prjFeatured.lead}</p>

      <div className="prj-featured__grid">
        <figure className="prj-featured__figure">
          <PrjPicture
            id={prjFeatured.image.id}
            alt={prjFeatured.image.alt}
            scene="chapechape"
            sizes="(max-width: 900px) 100vw, 58vw"
            className="prj-featured__pic"
          />
          <figcaption className="prj-figcaption">{prjFeatured.image.caption}</figcaption>
        </figure>

        <div className="prj-featured__side">
          <ul className="prj-points">
            {prjFeatured.points.map((point) => (
              <li key={point.title} className="prj-point">
                <span className="prj-point__icon">
                  <PrjIcon name={point.icon} />
                </span>
                <div>
                  <h3 className="prj-point__title">{point.title}</h3>
                  <p className="prj-point__text">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="prj-tiles">
            {prjFeatured.tiles.map((tile) => (
              <li key={tile.label} className="prj-tile">
                <PrjIcon name={tile.icon} className="prj-tile__icon" />
                <span>{tile.label}</span>
              </li>
            ))}
          </ul>
          <a href={prjFeatured.cta.href} className="prj-btn prj-btn--yellow prj-btn--block">
            {prjFeatured.cta.label}
            <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
          </a>
        </div>
      </div>

      <p className="prj-featured__note">{prjFeatured.note}</p>
    </section>
  );
}