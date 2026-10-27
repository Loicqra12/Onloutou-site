"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildMotorcycleRequestSummary,
  buildMotorcycleWhatsAppUrl,
  motorcyclesRequestOptions,
} from "@/content/motorcycles-page";

export function MotorcycleRequestBuilder() {
  const [modeLabel, setModeLabel] = useState(motorcyclesRequestOptions.modes[0].label);
  const [profileLabel, setProfileLabel] = useState(motorcyclesRequestOptions.profiles[0].label);
  const [usageLabel, setUsageLabel] = useState(motorcyclesRequestOptions.usages[0].label);
  const [quantityLabel, setQuantityLabel] = useState(motorcyclesRequestOptions.quantities[0].label);
  const [durationLabel, setDurationLabel] = useState(motorcyclesRequestOptions.durations[0].label);
  const [zoneLabel, setZoneLabel] = useState(motorcyclesRequestOptions.zones[0].label);
  const [servicesLabel, setServicesLabel] = useState(motorcyclesRequestOptions.services[0].label);

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

  const summary = useMemo(() => buildMotorcycleRequestSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildMotorcycleWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "Mode", name: "moto-mode", options: motorcyclesRequestOptions.modes, value: modeLabel, set: setModeLabel },
    { legend: "Profil", name: "moto-profile", options: motorcyclesRequestOptions.profiles, value: profileLabel, set: setProfileLabel },
    { legend: "Usage", name: "moto-usage", options: motorcyclesRequestOptions.usages, value: usageLabel, set: setUsageLabel },
    { legend: "Quantité", name: "moto-quantity", options: motorcyclesRequestOptions.quantities, value: quantityLabel, set: setQuantityLabel },
    { legend: "Durée", name: "moto-duration", options: motorcyclesRequestOptions.durations, value: durationLabel, set: setDurationLabel },
    { legend: "Zone", name: "moto-zone", options: motorcyclesRequestOptions.zones, value: zoneLabel, set: setZoneLabel },
    { legend: "Services associés", name: "moto-services", options: motorcyclesRequestOptions.services, value: servicesLabel, set: setServicesLabel },
  ] as const;

  return (
    <section
      id="demande-moto"
      className="mot-request section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="mot-request-title"
    >
      <div className="container-content mot-request__inner">
        <h2 id="mot-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Définir ma demande
        </h2>
        <p className="mot-request__lead">Préparez un message — aucune réservation ni inscription livreur n’est créée ici.</p>

        <form className="mot-request__form" onSubmit={(e) => e.preventDefault()}>
          {fieldsets.map((fs) => (
            <fieldset key={fs.name} className="mot-request__fieldset">
              <legend>{fs.legend}</legend>
              <div className="mot-request__options">
                {fs.options.map((opt) => (
                  <label key={opt.id} className="mot-request__option">
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

          <div className="mot-request__summary" aria-live="polite">
            <p className="mot-request__summary-label">Résumé</p>
            <p className="mot-request__summary-text">{summary}</p>
          </div>

          <p className="mot-request__legal">
            Cette demande ne confirme ni disponibilité, ni prix, ni réservation, ni mission de livraison.
          </p>

          <div className="mot-request__actions">
            <Button href={whatsappHref} variant="primary">Envoyer ma demande sur WhatsApp</Button>
            <Link href="/contact" className="mot-request__contact link-motion">Continuer sur la page contact</Link>
          </div>
          <div className="mot-request__static-links">
            <Link href="/solutions/location" className="link-motion">Location</Link>
            <Link href="/solutions/vente" className="link-motion">Vente</Link>
          </div>
        </form>

        <noscript>
          <p className="mot-request__noscript">
            Utilisez la <Link href="/contact">page contact</Link> ou les pages Location et Vente pour transmettre votre besoin.
          </p>
        </noscript>
      </div>
    </section>
  );
}
