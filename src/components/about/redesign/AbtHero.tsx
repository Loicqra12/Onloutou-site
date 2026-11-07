import Image from "next/image";
import Link from "next/link";
import { abtHero, abtImages, abtSubnav } from "@/content/about-hub";
import { AbtIcon } from "./AbtIcon";

export function AbtHero() {
  return (
    <>
      <section id="about-principles" className="abt-hero" aria-labelledby="abt-hero-title">
        <div className="abt-hero__copy">
          <p className="abt-eyebrow abt-eyebrow--line">{abtHero.eyebrow}</p>
          <h1 id="abt-hero-title" className="abt-h1">
            <span className="abt-h1__main">{abtHero.title}</span>{" "}
            <span className="abt-h1__sub">{abtHero.subtitle}</span>
          </h1>
          <p className="abt-hero__lead">{abtHero.lead}</p>
          <div className="abt-hero__actions">
            <a href={abtHero.primary.href} className="abt-btn abt-btn--yellow">
              {abtHero.primary.label}
              <AbtIcon name="arrowDown" className="abt-btn__icon" />
            </a>
            <a href={abtHero.secondary.href} className="abt-btn abt-btn--outline">
              {abtHero.secondary.label}
              <AbtIcon name="arrowDown" className="abt-btn__icon" />
            </a>
          </div>
        </div>
        <figure className="abt-hero__figure">
          <Image
            src={abtImages.hero.src}
            alt={abtHero.image.alt}
            width={abtImages.hero.width}
            height={abtImages.hero.height}
            sizes="(max-width: 900px) 100vw, 45vw"
            priority
            className="abt-hero__img"
          />
          <figcaption className="abt-hero__caption">{abtHero.caption}</figcaption>
        </figure>
      </section>
      <nav className="abt-subnav" aria-label="Sur cette page">
        <ul>
          {abtSubnav.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export function AbtLink({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  const external = href.startsWith("http");
  const cls = `abt-textlink${light ? " abt-textlink--light" : ""}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <AbtIcon name="arrowUpRight" className="abt-textlink__icon" />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <AbtIcon name="arrowUpRight" className="abt-textlink__icon" />
    </Link>
  );
}