import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { deliveryLogisticsSection, deliveryPageMedia } from "@/content/delivery-page";

export function DeliveryLogisticsSection() {
  const photo = deliveryPageMedia.logisticsWarehouse;
  const data = deliveryLogisticsSection;

  return (
    <section className="dlv-logistics section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="dlv-logistics-title">
      <div className="container-content dlv-logistics__layout">
        <Reveal className="dlv-logistics__media editorial-media">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="dlv-logistics__img editorial-media__img"
              style={{ objectPosition: photo.objectPosition }}
            />
          </figure>
        </Reveal>
        <div className="dlv-logistics__copy">
          <Reveal>
            <h2 id="dlv-logistics-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              La livraison se prépare{" "}
              <span className="text-brand-yellow">avant de rouler.</span>
            </h2>
          </Reveal>
          <ol className="dlv-logistics__checks">
            {data.checks.map((check, index) => (
              <li key={check}>
                <span className="dlv-logistics__check-num" aria-hidden>{index + 1}</span>
                {check}
              </li>
            ))}
          </ol>
          <p className="dlv-logistics__panel">{data.panel}</p>
        </div>
      </div>
    </section>
  );
}
