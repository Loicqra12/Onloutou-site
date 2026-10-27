import { Reveal } from "@/components/motion/Reveal";
import { fleetCapabilityGroups, fleetCapabilityNote } from "@/content/fleet-management-page";

export function FleetCapabilities() {
  return (
    <section className="fleet-cap section-spacing bg-brand-paper" aria-labelledby="fleet-cap-title">
      <div className="container-content">
        <Reveal>
          <h2 id="fleet-cap-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Capacités de gestion
          </h2>
        </Reveal>
        <div className="fleet-cap__table">
          {fleetCapabilityGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 50} className={`fleet-cap__block fleet-cap__block--${group.id}`}>
              <h3 className="fleet-cap__group-title">{group.title}</h3>
              <ul className="fleet-cap__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="fleet-cap__note">{fleetCapabilityNote}</p>
      </div>
    </section>
  );
}
