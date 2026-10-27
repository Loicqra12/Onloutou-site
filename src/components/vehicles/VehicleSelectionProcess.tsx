import { vehiclesProcess } from "@/content/vehicles-page";

export function VehicleSelectionProcess() {
  const data = vehiclesProcess;

  return (
    <section className="veh-process section-spacing bg-brand-paper" aria-labelledby="veh-process-title">
      <div className="container-content">
        <h2 id="veh-process-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="veh-process__track">
          {data.steps.map((step, index) => (
            <li key={step.title} className="veh-process__step">
              <span className="veh-process__marker" aria-hidden>{index + 1}</span>
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
