import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { driverFutureSpaceSection } from "@/content/driver-partner-page";

export function DriverFutureSpaceSection() {
  const data = driverFutureSpaceSection;

  return (
    <section className="drv-future section-spacing bg-brand-paper" aria-labelledby="drv-future-title">
      <div className="container-content">
        <h2 id="drv-future-title" className="font-display text-2xl font-extrabold tracking-tight">
          {data.title}
        </h2>
        <ul className="drv-future__list">
          {data.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <EditorialNotice>{data.notice}</EditorialNotice>
      </div>
    </section>
  );
}
