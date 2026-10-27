import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { vehiclesRentOrBuy } from "@/content/vehicles-page";

export function VehiclesRentOrBuy() {
  const { rent, buy } = vehiclesRentOrBuy;

  return (
    <section className="veh-rent-buy section-spacing" aria-labelledby="veh-rent-buy-title">
      <div className="container-content">
        <h2 id="veh-rent-buy-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {vehiclesRentOrBuy.title}
        </h2>
      </div>
      <div className="veh-rent-buy__split">
        <div className="veh-rent-buy__zone veh-rent-buy__zone--rent">
          <h3>{rent.title}</h3>
          <p>{rent.lead}</p>
          <ul>
            {rent.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Button href={rent.cta.href} variant="dark">{rent.cta.label}</Button>
        </div>
        <div className="veh-rent-buy__zone veh-rent-buy__zone--buy">
          <h3>{buy.title}</h3>
          <p>{buy.lead}</p>
          <ul>
            {buy.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Link href={buy.cta.href} className="veh-rent-buy__cta link-motion">{buy.cta.label}</Link>
        </div>
      </div>
    </section>
  );
}
