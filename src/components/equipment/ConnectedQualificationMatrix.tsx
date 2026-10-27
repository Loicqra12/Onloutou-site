import { Reveal } from "@/components/motion/Reveal";
import { connectedQualificationCriteria } from "@/content/connected-equipment-page";

export function ConnectedQualificationMatrix() {
  const data = connectedQualificationCriteria;

  return (
    <section className="cec-criteria section-spacing bg-brand-white" aria-labelledby="cec-criteria-title">
      <div className="container-content">
        <h2 id="cec-criteria-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="cec-criteria__list">
          {data.items.map((item, index) => (
            <Reveal key={item.number} as="li" delay={index * 40} className="cec-criteria__item">
              <span className="cec-criteria__num">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
