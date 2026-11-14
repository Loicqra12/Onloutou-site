import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { homPartners } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomPartners() {
  return (
    <section className="hom-partners" aria-labelledby="hom-partners-title">
      <div className="hom-wrap">
        <h2 id="hom-partners-title" className="hom-partners__title">
          <span>
            {homPartners.title}
          </span>
          <span className="hom-partners__rule" aria-hidden />
        </h2>
        <ul className="hom-partners__list">
          {homPartners.logos.map((logo) => (
            <li key={logo.id} className="hom-partners__item">
              <span
                className="hom-partners__logo"
                style={{ "--hom-logo-h": `${Math.min(logo.visualMaxHeight ?? 48, 52)}px` } as CSSProperties}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.visualMaxWidth ?? logo.width}
                  height={logo.visualMaxHeight ?? logo.height}
                  sizes="180px"
                  className="hom-partners__img"
                  style={{ width: "auto", height: "auto" }}
                />
              </span>
              <span className="hom-partners__label">{homPartners.labels[logo.id]}</span>
            </li>
          ))}
        </ul>
        <Link href={homPartners.link.href} className="hom-link">
          {homPartners.link.label}
          <HomIcon name="arrowUpRight" className="hom-link__icon" />
        </Link>
      </div>
    </section>
  );
}