import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesConfirmation } from "@/content/sales-page";

export function SalesConfirmation() {
  return (
    <section className="sales-confirm section-spacing" aria-labelledby="sales-confirm-title">
      <div className="container-content">
        <p className="sales-eyebrow">Avant tout engagement</p>
        <TitleReveal as="h2" id="sales-confirm-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <MarkedPhrase text={salesConfirmation.title} highlight={salesConfirmation.titleHighlight} />
        </TitleReveal>
        <ul className="sales-confirm__groups">
          {salesConfirmation.groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 60} as="li" className="sales-confirm__group">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
        <p className="sales-confirm__note">{salesConfirmation.note}</p>
      </div>
    </section>
  );
}
