import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { driverPartnerJourneyLine, driverPartnerProcess } from "@/content/driver-partner-page";

export function DriverJourney() {
  const data = driverPartnerProcess;

  return (
    <>
      <div className="drv-route-band" aria-label="Étapes du parcours livreur">
        <ol className="drv-route-band__list container-content">
          {driverPartnerJourneyLine.map((step, index) => (
            <li key={step}>
              <span>{step}</span>
              {index < driverPartnerJourneyLine.length - 1 && <span className="drv-route-band__arrow" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
      </div>
      <ProcessTimeline id={data.id} title={data.title} phases={data.phases} />
      <div className="container-content pb-8">
        <EditorialNotice>{data.notice}</EditorialNotice>
      </div>
    </>
  );
}
