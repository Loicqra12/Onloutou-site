import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";
import { ObjectiveIcon } from "@/components/solutions/ObjectiveIcon";
import { SolutionsMethod } from "@/components/solutions/SolutionsMethod";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ContactCtaBand } from "@/components/ui/ContactCtaBand";
import { HighlightedText } from "@/components/ui/HighlightedText";
import {
  detailedSolutionPages,
  solutionsHubHero,
  solutionsHubObjectives,
  solutionsHubSeo,
} from "@/content/solutions-hub";
import { universesIntro } from "@/content/universes";

export const metadata: Metadata = createPageMetadata({ ...solutionsHubSeo, path: "/solutions" });

export default function SolutionsHubPage() {
  return (
    <>
      <section className="hub-hero" aria-labelledby="hub-hero-title">
        <div className="container-content hub-hero__grid">
          <div>
            <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Solutions" }]} />
            <p className="hub-eyebrow">{universesIntro.eyebrow}</p>
            <TitleReveal as="h1" id="hub-hero-title" className="hub-hero__title font-display font-extrabold tracking-tight text-balance">
              Quatre univers pour louer, acheter, connecter et{" "}
              <HighlightedText variant="marker" className="sales-marker">construire</HighlightedText>
            </TitleReveal>
            <p className="hub-hero__lead">{solutionsHubHero.description}</p>
            <div className="hub-hero__actions">
              <Button href="/contact" variant="primary">
                Nous contacter
              </Button>
              <a href="/equipements" className="hub-hero__secondary">
                Voir les équipements
                <span className="hub-arrow" aria-hidden> →</span>
              </a>
            </div>
          </div>
          <ol className="hub-objectives">
            {solutionsHubObjectives.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href} className="hub-objective">
                  <span className="hub-objective__num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hub-objective__icon" aria-hidden>
                    <ObjectiveIcon index={index} />
                  </span>
                  <span className="hub-objective__copy">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </span>
                  <span className="hub-objective__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="connecter-piloter" className="hub-catalog section-spacing scroll-mt-28" aria-labelledby="hub-catalog-title">
        <div className="container-content">
          <div className="hub-catalog__intro">
            <div>
              <TitleReveal as="h2" id="hub-catalog-title" className="hub-catalog__title font-display font-extrabold tracking-tight">
                Solutions détaillées
              </TitleReveal>
            </div>
            <p className="hub-catalog__lead">{universesIntro.description}</p>
          </div>
          <ul className="hub-catalog__grid">
            {detailedSolutionPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hub-card">
                  <span className="hub-card__media">
                    <Image
                      src={page.image.src}
                      alt={page.image.alt}
                      width={page.image.width}
                      height={page.image.height}
                      sizes="(max-width: 700px) 100vw, 33vw"
                      className="hub-card__img"
                      style={{ objectPosition: page.image.objectPosition }}
                    />
                  </span>
                  <span className="hub-card__body">
                    <span className="hub-card__kicker">{page.universe}</span>
                    <h3>{page.title}</h3>
                    <p>{page.description}</p>
                    <span className="hub-card__more">
                      Lire la page
                      <span className="hub-card__arrow" aria-hidden> ↗</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SolutionsMethod />

      <ContactCtaBand
        id="contact-solutions"
        title="Étudier votre besoin"
        description="Location, vente, GPS, sécurisation d’actifs ou plateforme : décrivez votre contexte."
        secondaryLink={{ label: "Expertise ONLOUTOU", href: "/expertise" }}
      />
    </>
  );
}
