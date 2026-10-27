import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { Reveal } from "@/components/motion/Reveal";
import { driverCriteriaSection } from "@/content/driver-partner-page";

export function DriverCriteriaSection() {
  const data = driverCriteriaSection;

  return (
    <section className="drv-criteria section-spacing bg-brand-paper" aria-labelledby="drv-criteria-title">
      <div className="container-content">
        <Reveal>
          <h2 id="drv-criteria-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <ul className="drv-criteria__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <EditorialNotice>{data.notice}</EditorialNotice>
      </div>
    </section>
  );
}
