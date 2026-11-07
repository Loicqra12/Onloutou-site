"use client";

import { useMemo, useState } from "react";
import { BriefContactSave } from "@/components/forms/BriefContactSave";
import { site } from "@/content/site";
import {
  buildDeliveryRequestWhatsAppMessage,
  buildDeliveryRequestWhatsAppUrl,
  deliveryRequestOptions,
  deliveryRequestSection,
} from "@/content/delivery-page";

const DESCRIPTION_MAX = 500;

export function DeliveryRequestBuilder() {
  const data = deliveryRequestSection;

  const [goodsLabel, setGoodsLabel] = useState(deliveryRequestOptions.goods[0].label);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [schedule, setSchedule] = useState("");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [vehicleLabel, setVehicleLabel] = useState(deliveryRequestOptions.vehicles[4].label);
  const [recurrenceLabel, setRecurrenceLabel] = useState(deliveryRequestOptions.recurrence[0].label);
  const [details, setDetails] = useState("");

  const constraintsLabels = useMemo(
    () => (selectedConstraints.length ? selectedConstraints.join(", ") : ""),
    [selectedConstraints],
  );

  const fields = useMemo(
    () => ({
      goodsLabel,
      description,
      quantity,
      dimensions,
      origin,
      destination,
      schedule,
      constraintsLabels,
      vehicleLabel,
      recurrenceLabel,
      details,
    }),
    [
      goodsLabel,
      description,
      quantity,
      dimensions,
      origin,
      destination,
      schedule,
      constraintsLabels,
      vehicleLabel,
      recurrenceLabel,
      details,
    ],
  );

  const summary = useMemo(() => buildDeliveryRequestWhatsAppMessage(fields), [fields]);
  const whatsappHref = useMemo(() => buildDeliveryRequestWhatsAppUrl(fields), [fields]);

  const toggleConstraint = (label: string) => {
    if (label === "aucune information particulière") {
      setSelectedConstraints([label]);
      return;
    }
    setSelectedConstraints((prev) => {
      const withoutNone = prev.filter((c) => c !== "aucune information particulière");
      return withoutNone.includes(label) ? withoutNone.filter((c) => c !== label) : [...withoutNone, label];
    });
  };

  return (
    <section
      id={data.id}
      className="dlv-request section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="dlv-request-title"
    >
      <div className="container-content dlv-request__inner">
        <h2 id="dlv-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>

        <form className="dlv-request__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="dlv-request__fieldset">
            <legend>Nature du bien</legend>
            <div className="dlv-request__options">
              {deliveryRequestOptions.goods.map((opt) => (
                <label key={opt.id} className="dlv-request__option">
                  <input
                    type="radio"
                    name="dlv-goods"
                    checked={goodsLabel === opt.label}
                    onChange={() => setGoodsLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="dlv-request__field">
            <label htmlFor="dlv-desc">Description</label>
            <textarea
              id="dlv-desc"
              rows={3}
              maxLength={DESCRIPTION_MAX}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="dlv-request__field">
            <label htmlFor="dlv-qty">Quantité indicative (facultatif)</label>
            <input id="dlv-qty" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <div className="dlv-request__field">
            <label htmlFor="dlv-dim">Dimensions ou poids connus (facultatif)</label>
            <input id="dlv-dim" type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
          </div>

          <div className="dlv-request__field">
            <label htmlFor="dlv-origin">Point de départ</label>
            <input id="dlv-origin" type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>

          <div className="dlv-request__field">
            <label htmlFor="dlv-dest">Destination</label>
            <input id="dlv-dest" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>

          <div className="dlv-request__field">
            <label htmlFor="dlv-schedule">Date ou période souhaitée (facultatif)</label>
            <input id="dlv-schedule" type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
          </div>

          <fieldset className="dlv-request__fieldset">
            <legend>Contraintes</legend>
            <div className="dlv-request__options">
              {deliveryRequestOptions.constraints.map((opt) => (
                <label key={opt.id} className="dlv-request__option">
                  <input
                    type="checkbox"
                    checked={selectedConstraints.includes(opt.label)}
                    onChange={() => toggleConstraint(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="dlv-request__fieldset">
            <legend>Moyen envisagé</legend>
            <div className="dlv-request__options">
              {deliveryRequestOptions.vehicles.map((opt) => (
                <label key={opt.id} className="dlv-request__option">
                  <input
                    type="radio"
                    name="dlv-vehicle"
                    checked={vehicleLabel === opt.label}
                    onChange={() => setVehicleLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="dlv-request__fieldset">
            <legend>Besoin récurrent</legend>
            <div className="dlv-request__options">
              {deliveryRequestOptions.recurrence.map((opt) => (
                <label key={opt.id} className="dlv-request__option">
                  <input
                    type="radio"
                    name="dlv-recurrence"
                    checked={recurrenceLabel === opt.label}
                    onChange={() => setRecurrenceLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="dlv-request__field">
            <label htmlFor="dlv-details">Précisions</label>
            <textarea id="dlv-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          <div className="dlv-request__summary" aria-live="polite">
            <p className="dlv-request__summary-label">Récapitulatif</p>
            <pre className="dlv-request__summary-text">{summary}</pre>
          </div>

          <div className="dlv-request__actions">
            <BriefContactSave
              source="livraison-demande"
              type="DELIVERY"
              zone={origin || destination || undefined}
              message={summary}
              payload={fields}
              whatsappUrl={whatsappHref}
              whatsappLabel="Envoyer ma demande par WhatsApp"
              className="dlv-request__actions"
            />
            <a href={`tel:${site.phoneTel}`} className="dlv-request__phone link-motion">Appeler ONLOUTOU</a>
          </div>
        </form>

        <noscript>
          <p className="dlv-request__noscript">
            Contactez ONLOUTOU par téléphone ou WhatsApp en précisant le bien, le départ, la destination et les contraintes.
          </p>
        </noscript>
      </div>
    </section>
  );
}
