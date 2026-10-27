import Link from "next/link";
import { fleetDeploymentPhases } from "@/content/fleet-management-page";

export function FleetDeployment() {
  return (
    <section className="fleet-deploy section-spacing bg-brand-white" aria-labelledby="fleet-deploy-title">
      <div className="container-content fleet-deploy__layout">
        <div className="fleet-deploy__nav">
          <h2 id="fleet-deploy-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Déploiement
          </h2>
          <nav aria-label="Étapes de déploiement" className="fleet-deploy__steps-nav">
            <ol>
              {fleetDeploymentPhases.map((phase) => (
                <li key={phase.step}>
                  <Link href={`#fleet-deploy-${phase.step}`} className="fleet-deploy__step-link">
                    <span className="fleet-deploy__step-num">{phase.step}</span>
                    {phase.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="fleet-deploy__content">
          {fleetDeploymentPhases.map((phase) => (
            <article
              key={phase.step}
              id={`fleet-deploy-${phase.step}`}
              className="fleet-deploy__article scroll-mt-28"
            >
              <h3 className="fleet-deploy__article-title">
                <span className="fleet-deploy__article-step">{phase.step}</span>
                {phase.title}
              </h3>
              <p className="fleet-deploy__article-text">{phase.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
