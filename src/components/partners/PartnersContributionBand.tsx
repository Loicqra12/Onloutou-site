import { Reveal } from "@/components/motion/Reveal";
import { partnersContributions } from "@/content/partners-page";

export function PartnersContributionBand() {
  return (
    <section className="partners-band" aria-labelledby="partners-band-lead">
      <div className="container-content">
        <p id="partners-band-lead" className="partners-band__lead">{partnersContributions.lead}</p>
        <ol className="partners-band__list">
          {partnersContributions.items.map((item, index) => (
            <Reveal key={item} delay={index * 35} as="li" className="partners-band__item">
              <span className="partners-band__num">{String(index + 1).padStart(2, "0")}</span>
              <span className="partners-band__sep" aria-hidden />
              <span>{item}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
