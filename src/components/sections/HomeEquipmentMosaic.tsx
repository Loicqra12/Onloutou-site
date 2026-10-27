import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { homeEquipmentIntro, homeEquipmentItems } from "@/content/home";

export function HomeEquipmentMosaic() {
  return (
    <section id="equipements" data-section="equipment" className="home-equipment-section section-spacing" aria-labelledby="home-equipment-title">
      <div className="container-content">
        <Reveal className="home-equipment-mosaic home-eq-stage">
          <div className="home-eq-copy">
            <div>
              <p className="home-eq-eyebrow">
                <span className="home-eq-eyebrow-line" aria-hidden />
                {homeEquipmentIntro.eyebrow}
              </p>
              <h2 id="home-equipment-title" className="home-eq-heading">
                {homeEquipmentIntro.titleLead}{" "}
                <span className="home-eq-break">{homeEquipmentIntro.titleRest}</span>
              </h2>
              <p className="home-eq-lead">{homeEquipmentIntro.lead}</p>
            </div>
            <Button href={homeEquipmentIntro.cta.href} variant="dark" className="home-eq-cta">
              {homeEquipmentIntro.cta.label}
              <span aria-hidden>→</span>
            </Button>
          </div>

          {homeEquipmentItems.map((item) => (
            <figure key={item.id} className={`home-eq-card home-eq-${item.id} home-eq-${item.variant}`}>
              <div className="home-eq-frame">
                <Image
                  src={item.media.src}
                  alt={item.media.alt}
                  width={item.media.width}
                  height={item.media.height}
                  sizes={item.sizes}
                  className="home-eq-photo"
                  style={{ objectPosition: item.media.objectPosition }}
                />
                <div className="home-eq-shade" aria-hidden />
                <figcaption className="home-eq-caption">
                  <span className="home-eq-number">{item.number}</span>
                  <span className="home-eq-line" aria-hidden />
                  <h3 className="home-eq-title">{item.title}</h3>
                  <p className="home-eq-desc">{item.description}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
