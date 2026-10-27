"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildTrucksMachineryRequestSummary,
  buildTrucksMachineryWhatsAppUrl,
  trucksMachineryRequestOptions,
} from "@/content/trucks-machinery-page";

const DESCRIPTION_MAX = 500;

export function HeavyEquipmentRequestBuilder() {
  const [universeLabel, setUniverseLabel] = useState(trucksMachineryRequestOptions.universes[0].label);
  const [categoryLabel, setCategoryLabel] = useState(trucksMachineryRequestOptions.categories[0].label);
  const [usageLabel, setUsageLabel] = useState(trucksMachineryRequestOptions.usages[0].label);
  const [quantityLabel, setQuantityLabel] = useState(trucksMachineryRequestOptions.quantities[0].label);
  const [modeLabel, setModeLabel] = useState(trucksMachineryRequestOptions.modes[0].label);
  const [durationLabel, setDurationLabel] = useState(trucksMachineryRequestOptions.durations[0].label);
  const [zoneLabel, setZoneLabel] = useState(trucksMachineryRequestOptions.zones[0].label);
  const [servicesLabel, setServicesLabel] = useState(trucksMachineryRequestOptions.services[0].label);
  const [description, setDescription] = useState("");

  const selection = useMemo(
    () => ({
      universeLabel,
      categoryLabel,
      usageLabel,
      quantityLabel,
      modeLabel,
      durationLabel,
      zoneLabel,
      servicesLabel,
      description,
    }),
    [
      universeLabel,
      categoryLabel,
      usageLabel,
      quantityLabel,
      modeLabel,
      durationLabel,
      zoneLabel,
      servicesLabel,
      description,
    ],
  );

  const summary = useMemo(() => buildTrucksMachineryRequestSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildTrucksMachineryWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "Univers", name: "heq-universe", options: trucksMachineryRequestOptions.universes, value: universeLabel, set: setUniverseLabel },
    { legend: "Catégorie", name: "heq-category", options: trucksMachineryRequestOptions.categories, value: categoryLabel, set: setCategoryLabel },
    { legend: "Usage", name: "heq-usage", options: trucksMachineryRequestOptions.usages, value: usageLabel, set: setUsageLabel },
    { legend: "Quantité", name: "heq-quantity", options: trucksMachineryRequestOptions.quantities, value: quantityLabel, set: setQuantityLabel },
    { legend: "Mode", name: "heq-mode", options: trucksMachineryRequestOptions.modes, value: modeLabel, set: setModeLabel },
    { legend: "Durée", name: "heq-duration", options: trucksMachineryRequestOptions.durations, value: durationLabel, set: setDurationLabel },
    { legend: "Zone", name: "heq-zone", options: trucksMachineryRequestOptions.zones, value: zoneLabel, set: setZoneLabel },
    { legend: "Services associés", name: "heq-services", options: trucksMachineryRequestOptions.services, value: servicesLabel, set: setServicesLabel },
  ] as const;

  return (
    <section
      id="demande-camion-engin"
      className="heq-request section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="heq-request-title"
    >
      <div className="container-content heq-request__inner">
        <h2 id="heq-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Définir ma demande
        </h2>
        <p className="heq-request__lead">Préparez un message — aucune réservation ni confirmation de capacité n’est créée ici.</p>

        <form className="heq-request__form" onSubmit={(e) => e.preventDefault()}>
          {fieldsets.map((fs) => (
            <fieldset key={fs.name} className="heq-request__fieldset">
              <legend>{fs.legend}</legend>
              <div className="heq-request__options">
                {fs.options.map((opt) => (
                  <label key={opt.id} className="heq-request__option">
                    <input
                      type="radio"
                      name={fs.name}
                      value={opt.label}
                      checked={fs.value === opt.label}
                      onChange={() => fs.set(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <div className="heq-request__description">
            <label htmlFor="heq-description">Description courte (facultatif)</label>
            <textarea
              id="heq-description"
              name="heq-description"
              rows={4}
              maxLength={DESCRIPTION_MAX}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la charge, le terrain, les accès et les contraintes principales sans transmettre d’information confidentielle."
            />
            <p className="heq-request__char-count" aria-live="polite">
              {description.length}/{DESCRIPTION_MAX}
            </p>
          </div>

          <div className="heq-request__summary" aria-live="polite">
            <p className="heq-request__summary-label">Résumé</p>
            <p className="heq-request__summary-text">{summary}</p>
          </div>

          <p className="heq-request__legal">
            Cette demande ne confirme ni disponibilité, ni capacité, ni prix, ni réservation, ni présence d’un opérateur.
          </p>

          <div className="heq-request__actions">
            <Button href={whatsappHref} variant="primary">Envoyer ma demande sur WhatsApp</Button>
            <Link href="/contact" className="heq-request__contact link-motion">Continuer sur la page contact</Link>
          </div>
          <div className="heq-request__static-links">
            <Link href="/solutions/location" className="link-motion">Location</Link>
            <Link href="/solutions/vente" className="link-motion">Vente</Link>
          </div>
        </form>

        <noscript>
          <div className="heq-request__noscript">
            <p>Sans JavaScript, parcourez les critères ci-dessus et utilisez les liens suivants :</p>
            <ul>
              <li><Link href="/solutions/location">Explorer la location</Link></li>
              <li><Link href="/solutions/vente">Explorer l’acquisition</Link></li>
              <li><Link href="/contact">Page contact</Link></li>
            </ul>
          </div>
        </noscript>
      </div>
    </section>
  );
}
