import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { deliverySafetySection } from "@/content/delivery-page";

export function DeliverySafetySection() {
  const data = deliverySafetySection;

  return (
    <section className="dlv-safety section-spacing bg-brand-paper" aria-labelledby="dlv-safety-title">
      <div className="container-content">
        <Reveal>
          <h2 id="dlv-safety-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <ul className="dlv-safety__list">
          {data.items.map((item, index) => (
            <Reveal key={item} delay={index * 40} as="li">{item}</Reveal>
          ))}
        </ul>
        <EditorialNotice>{data.notice}</EditorialNotice>
      </div>
    </section>
  );
}
