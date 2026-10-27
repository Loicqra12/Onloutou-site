import { Reveal } from "@/components/motion/Reveal";
import { toolsSelectionMatrix } from "@/content/tools-equipment-page";

export function EquipmentSelectionMatrix() {
  const data = toolsSelectionMatrix;

  return (
    <section className="tem-matrix section-spacing bg-brand-white" aria-labelledby="tem-matrix-title">
      <div className="container-content">
        <h2 id="tem-matrix-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ol className="tem-matrix__list">
          {data.criteria.map((item, index) => (
            <Reveal key={item.number} as="li" delay={index * 45} className="tem-matrix__item">
              <span className="tem-matrix__num">{item.number}</span>
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
