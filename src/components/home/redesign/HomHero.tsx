import Link from "next/link";
import { homHero, homIds } from "@/content/home-hub";
import { LcpPicture } from "@/components/ui/LcpPicture";
import { HomIcon } from "@/components/home/redesign/HomIcon";
import { HomMark } from "@/components/home/redesign/HomMark";

export function HomHero() {
  const photo = homHero.photo;

  return (
    <section id={homIds.hero} data-section="hero" className="hom-hero" aria-labelledby="hom-hero-title">
      <div className="hom-hero__photo">
        <LcpPicture
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority
          sizes="(max-width: 1024px) 100vw, 64vw"
          className="hom-hero__img"
        />
        <div className="hom-hero__shade" aria-hidden />
      </div>
      <div className="hom-hero__inner">
        <p className="hom-hero__eyebrow">
          {homHero.eyebrow.map((word, index) => (
            <span key={word}>
              {index > 0 ? <span aria-hidden> · </span> : null}
              {word}
            </span>
          ))}
        </p>
        <h1 id="hom-hero-title" className="hom-hero__title">
          {homHero.titleLines.map((line) => (
            <span key={line} className="hom-hero__line">
              {line}
            </span>
          ))}
          <span className="hom-hero__brand">
            <HomMark variant="box">{homHero.titleBrand}</HomMark>
          </span>
        </h1>
        <p className="hom-hero__lead">{homHero.lead}</p>
        <div className="hom-hero__actions">
          <Link href={homHero.primary.href} className="hom-btn hom-btn--yellow">
            {homHero.primary.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
          </Link>
          <Link href={homHero.secondary.href} className="hom-hero__link">
            {homHero.secondary.label}
          </Link>
        </div>
      </div>
      <a href={homHero.explore.href} className="hom-hero__explore">
        {homHero.explore.label}
        <HomIcon name="arrowDown" className="hom-hero__explore-icon" />
      </a>
    </section>
  );
}