import { Reveal } from "@/components/motion/Reveal";
import { geolocationDeploymentPhases } from "@/content/geolocation-page";

export function GeolocationDeployment() {
  return (
    <section className="geo-deploy section-spacing bg-brand-paper" aria-labelledby="geo-deploy-title">
      <div className="container-content">
        <Reveal>
          <h2 id="geo-deploy-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Méthode de déploiement
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-brand-muted">
            Un déroulé structuré, de la définition du besoin à la prise en main sur le terrain.
          </p>
        </Reveal>
        <ol className="geo-deploy__list">
          {geolocationDeploymentPhases.map((phase, index) => (
            <Reveal key={phase.step} delay={index * 60} as="li" className="geo-deploy__item">
              <span className="geo-deploy__step">{phase.step}</span>
              <div>
                <h3 className="geo-deploy__title">{phase.title}</h3>
                <p className="geo-deploy__text">{phase.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
