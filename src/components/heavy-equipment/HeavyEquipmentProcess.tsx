import { trucksMachineryProcess } from "@/content/trucks-machinery-page";

export function HeavyEquipmentProcess() {
  const data = trucksMachineryProcess;

  return (
    <section className="heq-process section-spacing bg-brand-white" aria-labelledby="heq-process-title">
      <div className="container-content">
        <h2 id="heq-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="heq-process__axis">
          {data.steps.map((step, index) => (
            <li key={step.title} className={`heq-process__step${index % 2 === 1 ? " heq-process__step--alt" : ""}`}>
              <span className="heq-process__marker" aria-hidden>{index + 1}</span>
              <div className="heq-process__card">
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
