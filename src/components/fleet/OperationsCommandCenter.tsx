import { Reveal } from "@/components/motion/Reveal";
import { fleetPilotage } from "@/content/fleet-management-page";

export function OperationsCommandCenter() {
  return (
    <section
      id={fleetPilotage.id}
      className="fleet-pilotage section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="fleet-pilotage-title"
    >
      <div className="container-content fleet-pilotage__layout">
        <div className="fleet-pilotage__copy">
          <Reveal>
            <h2 id="fleet-pilotage-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {fleetPilotage.title}
            </h2>
            <p className="fleet-pilotage__lead">{fleetPilotage.lead}</p>
            <ul className="fleet-pilotage__points">
              {fleetPilotage.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <div className="fleet-pilotage__console" aria-label="Repères de pilotage opérationnel">
            <p className="fleet-pilotage__console-label">Repères de pilotage</p>
            <ul className="fleet-pilotage__console-list">
              {fleetPilotage.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="fleet-pilotage__caption">{fleetPilotage.disclaimer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
