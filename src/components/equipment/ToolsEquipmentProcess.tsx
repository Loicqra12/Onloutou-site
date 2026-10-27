import { toolsEquipmentProcess } from "@/content/tools-equipment-page";

export function ToolsEquipmentProcess() {
  const data = toolsEquipmentProcess;

  return (
    <section className="tem-process section-spacing bg-brand-paper" aria-labelledby="tem-process-title">
      <div className="container-content">
        <h2 id="tem-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="tem-process__steps">
          {data.steps.map((step, index) => (
            <li key={step.title} className="tem-process__step">
              <span className="tem-process__index" aria-hidden>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
