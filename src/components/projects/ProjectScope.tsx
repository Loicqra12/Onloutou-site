import { Reveal } from "@/components/motion/Reveal";
import { projectsScopeLayers } from "@/content/projects-page";

export function ProjectScope() {
  return (
    <section className="proj-scope section-spacing bg-brand-paper" aria-labelledby="proj-scope-title">
      <div className="container-content">
        <Reveal>
          <h2 id="proj-scope-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {projectsScopeLayers.title}
          </h2>
        </Reveal>

        <p className="sr-only">
          Couches : Cadrer, Équiper, Connecter, Construire, Déployer, Accompagner — avec capacités associées.
        </p>

        <ol className="proj-scope__layers">
          {projectsScopeLayers.layers.map((layer, index) => (
            <li key={layer.title}>
              <div className="proj-scope__layer-head">
                <span className="proj-scope__layer-index" aria-hidden>{index + 1}</span>
                <h3>{layer.title}</h3>
              </div>
              <ul>
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {index < projectsScopeLayers.layers.length - 1 && (
                <span className="proj-scope__arrow" aria-hidden>→</span>
              )}
            </li>
          ))}
        </ol>
        <p className="proj-scope__note">{projectsScopeLayers.note}</p>
      </div>
    </section>
  );
}
