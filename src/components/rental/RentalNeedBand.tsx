import { Reveal } from "@/components/motion/Reveal";
import { rentalNeedBand } from "@/content/rental-page";

export function RentalNeedBand() {
  return (
    <section className="rental-band" aria-label="Contextes de location">
      <div className="container-content rental-band__inner">
        <ol className="rental-band__list">
          {rentalNeedBand.map((label, index) => (
            <Reveal key={label} delay={index * 40} as="li" className="rental-band__item">
              <span className="rental-band__num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rental-band__label">{label}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
