import { Reveal } from "@/components/motion/Reveal";
import { equipmentOrientationBand } from "@/content/equipment-page";

export function EquipmentOrientationBand() {
  return (
    <section className="equip-band" aria-label="Repères d’orientation">
      <div className="container-content">
        <ol className="equip-band__list">
          {equipmentOrientationBand.map((label, index) => (
            <Reveal key={label} delay={index * 35} as="li" className="equip-band__item">
              <span className="equip-band__num">{String(index + 1).padStart(2, "0")}</span>
              <span className="equip-band__sep" aria-hidden />
              <span>{label}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
