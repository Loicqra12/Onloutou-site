import { siteMedia } from "@/content/media";
import { AnimatedSvgFigure } from "@/components/ui/AnimatedSvgFigure";

export function EcosystemIllustrationSection() {
  return (
    <section className="section-spacing bg-brand-charcoal text-white" aria-labelledby="ecosystem-illustration">
      <div className="container-content">
        <h2 id="ecosystem-illustration" className="font-display text-3xl font-extrabold tracking-tight">
          Un écosystème relié, du besoin au pilotage
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[#cccccc]">
          Location, acquisition, connectivité et développement de plateformes s’articulent selon les besoins de
          chaque projet.
        </p>
        <div className="mt-8">
          <AnimatedSvgFigure
            media={siteMedia.illustrations.ecosysteme}
            caption="Représentation illustrative de l’écosystème de services ONLOUTOU."
          />
        </div>
      </div>
    </section>
  );
}
