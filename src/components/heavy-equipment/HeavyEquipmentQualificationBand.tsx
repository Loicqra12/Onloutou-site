import { trucksMachineryQualificationBand } from "@/content/trucks-machinery-page";

export function HeavyEquipmentQualificationBand() {
  const data = trucksMachineryQualificationBand;

  return (
    <section className="heq-band" aria-labelledby="heq-band-lead">
      <div className="container-content">
        <p id="heq-band-lead" className="heq-band__lead">{data.lead}</p>
        <ol className="heq-band__list">
          {data.items.map((item, index) => (
            <li key={item} className="heq-band__item">
              <span className="heq-band__num">{String(index + 1).padStart(2, "0")}</span>
              {item}
              {index < data.items.length - 1 && <span className="heq-band__sep" aria-hidden />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
