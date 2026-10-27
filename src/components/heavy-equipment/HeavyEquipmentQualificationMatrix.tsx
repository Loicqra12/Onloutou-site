import { trucksMachineryQualificationMatrix } from "@/content/trucks-machinery-page";

export function HeavyEquipmentQualificationMatrix() {
  const data = trucksMachineryQualificationMatrix;

  return (
    <section className="heq-matrix section-spacing bg-brand-paper" aria-labelledby="heq-matrix-title">
      <div className="container-content">
        <h2 id="heq-matrix-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="heq-matrix__grid">
          {data.groups.map((group, index) => (
            <div key={group.title} className="heq-matrix__group">
              <span className="heq-matrix__num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
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
