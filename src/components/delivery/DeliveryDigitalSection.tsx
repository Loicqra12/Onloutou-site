import Link from "next/link";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { deliveryDigitalSection } from "@/content/delivery-page";

export function DeliveryDigitalSection() {
  const data = deliveryDigitalSection;

  return (
    <section className="dlv-digital section-spacing bg-brand-white" aria-labelledby="dlv-digital-title">
      <div className="container-content">
        <Reveal>
          <h2 id="dlv-digital-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <div className="dlv-digital__split">
          <Reveal as="div" className="dlv-digital__col">
            <h3 className="dlv-digital__col-title">Disponible aujourd’hui</h3>
            <ul>
              {data.availableToday.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60} as="div" className="dlv-digital__col dlv-digital__col--muted">
            <h3 className="dlv-digital__col-title">Prévu ou à l’étude</h3>
            <ul>
              {data.plannedOrStudy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="dlv-digital__notice">
          <EditorialNotice>{data.notice}</EditorialNotice>
        </div>
        <p className="dlv-digital__link-wrap">
          <Link href={data.platformLink.href} className="dlv-digital__link link-motion">
            {data.platformLink.label}
          </Link>
        </p>
      </div>
    </section>
  );
}
