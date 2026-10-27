import { driverTransparencyBand } from "@/content/driver-partner-page";

export function DriverTransparencyBand() {
  return (
    <div className="drv-band" role="region" aria-label="Principes de candidature">
      <ul className="drv-band__list container-content">
        {driverTransparencyBand.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
