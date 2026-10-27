import { Reveal } from "@/components/motion/Reveal";
import { projectsDimensions } from "@/content/projects-page";

export function ProjectsDimensionsBand() {
  return (
    <section className="proj-dimensions" aria-labelledby="proj-dimensions-lead">
      <div className="container-content">
        <p id="proj-dimensions-lead" className="proj-dimensions__lead">{projectsDimensions.lead}</p>
        <ol className="proj-dimensions__list">
          {projectsDimensions.items.map((label, index) => (
            <Reveal key={label} delay={index * 40} as="li" className="proj-dimensions__item">
              <span className="proj-dimensions__num">{String(index + 1).padStart(2, "0")}</span>
              <span className="proj-dimensions__line" aria-hidden />
              <span>{label}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
