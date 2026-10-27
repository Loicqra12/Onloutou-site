import { vehiclesCriteriaBand } from "@/content/vehicles-page";

export function VehiclesCriteriaBand() {
  const data = vehiclesCriteriaBand;

  return (
    <section className="veh-band" aria-labelledby="veh-band-lead">
      <div className="container-content">
        <p id="veh-band-lead" className="veh-band__lead">{data.lead}</p>
        <ol className="veh-band__list">
          {data.items.map((item, index) => (
            <li key={item} className="veh-band__item">
              <span className="veh-band__num">{String(index + 1).padStart(2, "0")}</span>
              {item}
              {index < data.items.length - 1 && <span className="veh-band__sep" aria-hidden />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
