import { driverCompensationSection } from "@/content/driver-partner-page";

export function DriverCompensationSection() {
  const data = driverCompensationSection;

  return (
    <section className="drv-pay section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="drv-pay-title">
      <div className="container-content">
        <h2 id="drv-pay-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {data.title}
        </h2>
        <ul className="drv-pay__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="drv-pay__notice">{data.notice}</p>
      </div>
    </section>
  );
}
