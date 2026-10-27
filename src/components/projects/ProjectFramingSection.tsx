import { Reveal } from "@/components/motion/Reveal";
import { projectsFraming } from "@/content/projects-page";

export function ProjectFramingSection() {
  return (
    <section className="proj-framing section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="proj-framing-title">
      <div className="container-content proj-framing__grid">
        <Reveal>
          <h2 id="proj-framing-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {projectsFraming.title}
          </h2>
          <ol className="proj-framing__questions">
            {projectsFraming.questions.map((q, index) => (
              <li key={q}>
                <span className="proj-framing__q-mark" aria-hidden>{index + 1}</span>
                {q}
              </li>
            ))}
          </ol>
        </Reveal>
        <aside className="proj-framing__synthesis" aria-label={projectsFraming.synthesisLabel}>
          <p className="proj-framing__synthesis-label">{projectsFraming.synthesisLabel}</p>
          <p className="proj-framing__synthesis-hint">{projectsFraming.synthesisHint}</p>
        </aside>
      </div>
    </section>
  );
}
