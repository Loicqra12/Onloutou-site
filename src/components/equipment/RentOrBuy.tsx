import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentRentOrBuy } from "@/content/equipment-page";

export function RentOrBuy() {
  const { rent, buy } = equipmentRentOrBuy;

  return (
    <section className="equip-rent-buy section-spacing" aria-labelledby="equip-rent-buy-title">
      <div className="container-content">
        <Reveal>
          <h2 id="equip-rent-buy-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {equipmentRentOrBuy.title}
          </h2>
        </Reveal>
      </div>

      <div className="equip-rent-buy__split">
        <div className="equip-rent-buy__zone equip-rent-buy__zone--rent">
          <h3 className="equip-rent-buy__zone-title">{rent.title}</h3>
          <p className="equip-rent-buy__zone-lead">{rent.lead}</p>
          <ul className="equip-rent-buy__points">
            {rent.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Button href={rent.cta.href} variant="dark">{rent.cta.label}</Button>
        </div>
        <div className="equip-rent-buy__zone equip-rent-buy__zone--buy">
          <h3 className="equip-rent-buy__zone-title">{buy.title}</h3>
          <p className="equip-rent-buy__zone-lead">{buy.lead}</p>
          <ul className="equip-rent-buy__points">
            {buy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href={buy.cta.href} className="equip-rent-buy__cta-light link-motion">
            {buy.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
