import { deliveryJourneyLine } from "@/content/delivery-page";

export function DeliveryRouteBand() {
  return (
    <div className="dlv-route-band" aria-label="Étapes du parcours logistique">
      <ol className="dlv-route-band__list container-content">
        {deliveryJourneyLine.map((step, index) => (
          <li key={step} className="dlv-route-band__item">
            <span>{step}</span>
            {index < deliveryJourneyLine.length - 1 && <span className="dlv-route-band__arrow" aria-hidden>→</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
