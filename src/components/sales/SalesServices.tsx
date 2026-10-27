import { Reveal } from "@/components/motion/Reveal";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { salesServices } from "@/content/sales-page";

export function SalesServices() {
  return (
    <section className="sales-services section-spacing" aria-labelledby="sales-services-title">
      <div className="container-content">
        <p className="sales-eyebrow">Selon votre projet</p>
        <TitleReveal as="h2" id="sales-services-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <MarkedPhrase text={salesServices.title} highlight={salesServices.titleHighlight} />
        </TitleReveal>
        <ol className="sales-services__groups">
          {salesServices.groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 60} as="li" className="sales-services__group">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
        <p className="sales-services__note">{salesServices.note}</p>
      </div>
    </section>
  );
}
