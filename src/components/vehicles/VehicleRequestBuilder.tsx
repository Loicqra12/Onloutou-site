"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildVehicleRequestSummary,
  buildVehicleWhatsAppUrl,
  vehiclesRequestOptions,
} from "@/content/vehicles-page";

export function VehicleRequestBuilder() {
  const [modeLabel, setModeLabel] = useState(vehiclesRequestOptions.modes[0].label);
  const [profileLabel, setProfileLabel] = useState(vehiclesRequestOptions.profiles[0].label);
  const [usageLabel, setUsageLabel] = useState(vehiclesRequestOptions.usages[0].label);
  const [quantityLabel, setQuantityLabel] = useState(vehiclesRequestOptions.quantities[0].label);
  const [durationLabel, setDurationLabel] = useState(vehiclesRequestOptions.durations[0].label);
  const [zoneLabel, setZoneLabel] = useState(vehiclesRequestOptions.zones[0].label);
  const [servicesLabel, setServicesLabel] = useState(vehiclesRequestOptions.services[0].label);

  const selection = useMemo(
    () => ({
      modeLabel,
      profileLabel,
      usageLabel,
      quantityLabel,
      durationLabel,
      zoneLabel,
      servicesLabel,
    }),
    [modeLabel, profileLabel, usageLabel, quantityLabel, durationLabel, zoneLabel, servicesLabel],
  );

  const summary = useMemo(() => buildVehicleRequestSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildVehicleWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "Mode envisagé", name: "veh-mode", options: vehiclesRequestOptions.modes, value: modeLabel, set: setModeLabel },
    { legend: "Profil de véhicule", name: "veh-profile", options: vehiclesRequestOptions.profiles, value: profileLabel, set: setProfileLabel },
    { legend: "Usage", name: "veh-usage", options: vehiclesRequestOptions.usages, value: usageLabel, set: setUsageLabel },
    { legend: "Quantité", name: "veh-quantity", options: vehiclesRequestOptions.quantities, value: quantityLabel, set: setQuantityLabel },
    { legend: "Durée", name: "veh-duration", options: vehiclesRequestOptions.durations, value: durationLabel, set: setDurationLabel },
    { legend: "Zone", name: "veh-zone", options: vehiclesRequestOptions.zones, value: zoneLabel, set: setZoneLabel },
    { legend: "Services associés", name: "veh-services", options: vehiclesRequestOptions.services, value: servicesLabel, set: setServicesLabel },
  ] as const;

  return (
    <section
      id="demande-vehicule"
      className="veh-request section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="veh-request-title"
    >
      <div className="container-content veh-request__inner">
        <h2 id="veh-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Définir ma demande
        </h2>
        <p className="veh-request__lead">Préparez un message de prise de contact — aucune réservation n’est créée depuis cette page.</p>

        <form className="veh-request__form" onSubmit={(e) => e.preventDefault()}>
          {fieldsets.map((fs) => (
            <fieldset key={fs.name} className="veh-request__fieldset">
              <legend>{fs.legend}</legend>
              <div className="veh-request__options">
                {fs.options.map((opt) => (
                  <label key={opt.id} className="veh-request__option">
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

          <div className="veh-request__summary" aria-live="polite">
            <p className="veh-request__summary-label">Résumé</p>
            <p className="veh-request__summary-text">{summary}</p>
          </div>

          <p className="veh-request__legal">Cette demande ne confirme ni disponibilité, ni prix, ni réservation.</p>

          <div className="veh-request__actions">
            <Button href={whatsappHref} variant="primary">Envoyer ma demande sur WhatsApp</Button>
            <Link href="/contact" className="veh-request__contact link-motion">Continuer sur la page contact</Link>
          </div>
          <div className="veh-request__static-links">
            <Link href="/solutions/location" className="link-motion">Location</Link>
            <Link href="/solutions/vente" className="link-motion">Vente</Link>
          </div>
        </form>

        <noscript>
          <p className="veh-request__noscript">
            Utilisez la <Link href="/contact">page contact</Link> ou les pages{" "}
            <Link href="/solutions/location">Location</Link> et <Link href="/solutions/vente">Vente</Link> pour transmettre votre besoin.
          </p>
        </noscript>
      </div>
    </section>
  );
}
