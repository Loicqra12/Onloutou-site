import { vehiclesSelectionCriteria } from "@/content/vehicles-page";

export function VehicleSelectionCriteria() {
  const data = vehiclesSelectionCriteria;

  return (
    <section className="veh-criteria section-spacing bg-brand-white" aria-labelledby="veh-criteria-title">
      <div className="container-content">
        <h2 id="veh-criteria-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="veh-criteria__grid">
          {data.groups.map((group, index) => (
            <div key={group.label} className="veh-criteria__group">
              <span className="veh-criteria__num">{index + 1}</span>
              <h3>{group.label}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
