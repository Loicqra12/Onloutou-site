import { siteMedia } from "@/content/media";
import { EditorialMedia } from "@/components/ui/EditorialMedia";
import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";

export function AboutInstitutionalIntro() {
  return (
    <section className="section-spacing" aria-labelledby="about-identity">
      <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <TitleReveal as="h2" id="about-identity" className="font-display text-3xl font-extrabold tracking-tight">
            Une identité construite au contact du terrain
          </TitleReveal>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            ONLOUTOU développe des services qui relient équipements, mobilité et outils numériques — avec une
            présence ancrée dans les réalités opérationnelles ivoiriennes et ouest-africaines.
          </p>
        </div>
        <EditorialMedia
          media={siteMedia.about.facadeSlogan}
          sizes="(max-width: 1024px) 100vw, 50vw"
          imageClassName="!object-contain bg-brand-paper"
        />
      </div>
    </section>
  );
}

export function AboutImplantationPhotos({ caption }: { caption: string }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <EditorialMedia
        media={siteMedia.about.facadeVehiculeArbre}
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <EditorialMedia
        media={siteMedia.about.devanturePalmiers}
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <Reveal className="sm:col-span-2">
        <p className="text-xs leading-relaxed text-brand-muted">{caption}</p>
      </Reveal>
    </div>
  );
}

export function AboutTeamPhoto() {
  return (
    <div className="mt-8 lg:max-w-md">
      <EditorialMedia
        media={siteMedia.about.equipeVehicule}
        sizes="(max-width: 1024px) 100vw, 33vw"
        imageClassName="object-cover"
      />
    </div>
  );
}

export function AboutStandArchive() {
  return (
    <section className="section-spacing bg-brand-paper" aria-labelledby="about-events">
      <div className="container-content grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <EditorialMedia
          media={siteMedia.about.standExposition}
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div>
          <h2 id="about-events" className="font-display text-2xl font-extrabold tracking-tight">
            Présenter, expérimenter, accompagner
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            Démonstrations et échanges professionnels font partie de la manière dont ONLOUTOU présente ses
            capacités — sans que chaque archive constitue un partenariat ou un événement identifié publiquement.
          </p>
        </div>
      </div>
    </section>
  );
}
