import { driverMissionTypesSection } from "@/content/driver-partner-page";

export function DriverMissionsSection() {
  const data = driverMissionTypesSection;

  return (
    <section className="drv-missions section-spacing bg-brand-white" aria-labelledby="drv-missions-title">
      <div className="container-content">
        <h2 id="drv-missions-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="drv-missions__tag">{data.tag}</p>
        <ul className="drv-missions__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
