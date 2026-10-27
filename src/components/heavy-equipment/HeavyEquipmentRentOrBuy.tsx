import Link from "next/link";
import { trucksMachineryRentOrBuy } from "@/content/trucks-machinery-page";

export function HeavyEquipmentRentOrBuy() {
  const data = trucksMachineryRentOrBuy;

  return (
    <section className="heq-rent-buy section-spacing bg-brand-white" aria-labelledby="heq-rent-buy-title">
      <div className="container-content">
        <h2 id="heq-rent-buy-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="heq-rent-buy__split">
          <div className="heq-rent-buy__zone heq-rent-buy__zone--rent">
            <h3>{data.rent.title}</h3>
            <p>{data.rent.lead}</p>
            <ul>
              {data.rent.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href={data.rent.cta.href} className="heq-rent-buy__cta link-motion">{data.rent.cta.label}</Link>
          </div>
          <div className="heq-rent-buy__divider" aria-hidden />
          <div className="heq-rent-buy__zone heq-rent-buy__zone--buy">
            <h3>{data.buy.title}</h3>
            <p>{data.buy.lead}</p>
            <ul>
              {data.buy.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href={data.buy.cta.href} className="heq-rent-buy__cta link-motion">{data.buy.cta.label}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
