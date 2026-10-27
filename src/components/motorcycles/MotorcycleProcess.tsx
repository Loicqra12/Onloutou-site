import { motorcyclesProcess } from "@/content/motorcycles-page";

export function MotorcycleProcess() {
  const data = motorcyclesProcess;

  return (
    <section className="mot-process section-spacing bg-brand-white" aria-labelledby="mot-process-title">
      <div className="container-content">
        <h2 id="mot-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="mot-process__route">
          {data.steps.map((step, index) => (
            <li key={step.title} className="mot-process__stop">
              <span className="mot-process__dot" aria-hidden>{index + 1}</span>
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
