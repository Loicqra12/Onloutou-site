import { Reveal } from "@/components/motion/Reveal";
import { fleetTeamViews } from "@/content/fleet-management-page";

export function TeamViews() {
  return (
    <section className="fleet-teams section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="fleet-teams-title">
      <div className="container-content">
        <Reveal>
          <h2 id="fleet-teams-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {fleetTeamViews.title}
          </h2>
        </Reveal>
        <div className="fleet-teams__rail" aria-hidden />
        <ol className="fleet-teams__columns">
          {fleetTeamViews.roles.map((role, index) => (
            <Reveal key={role.title} delay={index * 70} as="li" className="fleet-teams__col">
              <span className="fleet-teams__level" aria-hidden>{index + 1}</span>
              <h3 className="fleet-teams__role">{role.title}</h3>
              <ul className="fleet-teams__points">
                {role.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
