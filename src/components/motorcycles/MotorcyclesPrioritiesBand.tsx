import { motorcyclesPrioritiesBand } from "@/content/motorcycles-page";

export function MotorcyclesPrioritiesBand() {
  const data = motorcyclesPrioritiesBand;

  return (
    <section className="mot-band" aria-labelledby="mot-band-lead">
      <div className="container-content">
        <p id="mot-band-lead" className="mot-band__lead">{data.lead}</p>
        <ol className="mot-band__list">
          {data.items.map((item, index) => (
            <li key={item} className="mot-band__item">
              <span className="mot-band__num">{index + 1}</span>
              {item}
              {index < data.items.length - 1 && <span className="mot-band__sep" aria-hidden />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
