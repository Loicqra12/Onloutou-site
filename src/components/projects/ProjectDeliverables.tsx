import { projectsDeliverables } from "@/content/projects-page";

export function ProjectDeliverables() {
  return (
    <section className="proj-deliverables section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="proj-deliverables-title">
      <div className="container-content">
        <h2 id="proj-deliverables-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {projectsDeliverables.title}
        </h2>
        <ul className="proj-deliverables__list">
          {projectsDeliverables.items.map((item, index) => (
            <li key={item}>
              <span className="proj-deliverables__index" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="proj-deliverables__note">{projectsDeliverables.note}</p>
      </div>
    </section>
  );
}
