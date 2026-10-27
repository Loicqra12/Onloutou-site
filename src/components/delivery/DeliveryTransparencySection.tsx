import { Reveal } from "@/components/motion/Reveal";
import { deliveryTransparency } from "@/content/delivery-page";

export function DeliveryTransparencySection() {
  const data = deliveryTransparency;

  return (
    <section className="dlv-transparency section-spacing bg-brand-white" aria-labelledby="dlv-transparency-title">
      <div className="container-content">
        <Reveal>
          <h2 id="dlv-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {data.title}
          </h2>
        </Reveal>
        <ul className="dlv-transparency__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="dlv-transparency__note">{data.note}</p>
      </div>
    </section>
  );
}
