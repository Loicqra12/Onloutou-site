import { driverSafetySection } from "@/content/driver-partner-page";

export function DriverSafetySection() {
  const data = driverSafetySection;

  return (
    <section className="drv-safety section-spacing bg-brand-paper" aria-labelledby="drv-safety-title">
      <div className="container-content">
        <h2 id="drv-safety-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <ul className="drv-safety__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="drv-safety__notice">{data.notice}</p>
      </div>
    </section>
  );
}
