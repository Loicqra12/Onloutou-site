import { connectedEquipmentFamiliesSection } from "@/content/connected-equipment-page";

export function ConnectedEquipmentFamilies() {
  const data = connectedEquipmentFamiliesSection;

  return (
    <section className="cec-families section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="cec-families-title">
      <div className="container-content">
        <h2 id="cec-families-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="cec-families__list">
          {data.families.map((family) => (
            <article key={family.number} className="cec-families__item">
              <span className="cec-families__num">{family.number}</span>
              <div>
                <h3>{family.title}</h3>
                <p className="cec-families__lead">{family.lead}</p>
                <p className="cec-families__label">Critères à confirmer</p>
                <ul>
                  {family.criteria.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
