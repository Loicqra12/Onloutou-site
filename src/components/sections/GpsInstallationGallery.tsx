import Image from "next/image";
import { siteMedia } from "@/content/media";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { TitleReveal } from "@/components/motion/TitleReveal";

const steps = [
  {
    step: "01",
    title: "Préparer",
    text:
      "Analyse de l’équipement, identification des points de raccordement et préparation de l’intervention.",
    media: siteMedia.solutions.inspectionCablage,
    sizes: "(max-width: 768px) 100vw, 33vw",
  },
  {
    step: "02",
    title: "Installer",
    text:
      "Installation du dispositif selon le véhicule, le matériel retenu et les conditions du projet.",
    images: [siteMedia.solutions.installationTraceur, siteMedia.solutions.installationBerline],
    sizes: "(max-width: 768px) 100vw, 33vw",
  },
  {
    step: "03",
    title: "Tester et accompagner",
    text:
      "Paramétrage, tests de transmission et prise en main de l’interface avec les équipes concernées.",
    textOnly: true,
  },
];

export function GpsInstallationGallery() {
  return (
    <section className="section-spacing bg-brand-paper" aria-labelledby="gps-install-title">
      <div className="container-content">
        <TitleReveal as="h2" id="gps-install-title" className="font-display text-3xl font-extrabold tracking-tight">
          De l’installation à la mise en service
        </TitleReveal>
        <StaggerReveal className="mt-10 grid gap-8 lg:grid-cols-3" step={90}>
          {steps.map((item) => (
            <article key={item.step} className="flex flex-col">
              <span className="text-xs font-extrabold text-brand-yellow">{item.step}</span>
              <h3 className="mt-2 font-display text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">{item.text}</p>
              {item.media && (
                <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] border border-brand-border">
                  <Image
                    src={item.media.src}
                    alt={item.media.alt}
                    width={item.media.width}
                    height={item.media.height}
                    sizes={item.sizes}
                    className="editorial-media__img h-auto w-full object-cover"
                  />
                </div>
              )}
              {item.images && (
                <div className="mt-5 space-y-3">
                  {item.images.map((img) => (
                    <div
                      key={img.src}
                      className="overflow-hidden rounded-[var(--radius-card)] border border-brand-border"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes={item.sizes}
                        className="editorial-media__img h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </StaggerReveal>
        <Reveal className="mt-8 max-w-3xl">
          <EditorialNotice title="Installation">
            Les modalités d’installation dépendent du véhicule, du dispositif, de la couverture réseau et du
            périmètre contractuel.
          </EditorialNotice>
        </Reveal>
      </div>
    </section>
  );
}
