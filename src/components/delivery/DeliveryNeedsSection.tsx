import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { deliveryNeedsSection } from "@/content/delivery-page";

export function DeliveryNeedsSection() {
  const data = deliveryNeedsSection;

  return (
    <section className="dlv-needs section-spacing bg-brand-paper" aria-labelledby="dlv-needs-title">
      <div className="container-content">
        <Reveal>
          <h2 id="dlv-needs-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <div className="dlv-needs__grid">
          {data.categories.map((cat, index) => (
            <Reveal key={cat.title} delay={index * 60} as="article" className="dlv-needs__card">
              <h3 className="font-display text-lg font-extrabold">{cat.title}</h3>
              <ul>
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="dlv-needs__notice">
          <EditorialNotice>{data.notice}</EditorialNotice>
        </div>
        <p className="dlv-needs__exclusions">{data.exclusions}</p>
      </div>
    </section>
  );
}
