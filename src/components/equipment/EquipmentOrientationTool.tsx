"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildEquipmentOrientationSummary,
  buildEquipmentWhatsAppUrl,
  equipmentOrientationOptions,
} from "@/content/equipment-page";

export function EquipmentOrientationTool() {
  const [familyLabel, setFamilyLabel] = useState(equipmentOrientationOptions.families[0].label);
  const [modeLabel, setModeLabel] = useState(equipmentOrientationOptions.modes[0].label);
  const [usageLabel, setUsageLabel] = useState(equipmentOrientationOptions.usages[0].label);
  const [quantityLabel, setQuantityLabel] = useState(equipmentOrientationOptions.quantities[0].label);
  const [zoneLabel, setZoneLabel] = useState(equipmentOrientationOptions.zones[0].label);
  const [supportLabel, setSupportLabel] = useState(equipmentOrientationOptions.support[0].label);

  const selection = useMemo(
    () => ({
      familyLabel,
      modeLabel,
      usageLabel,
      quantityLabel,
      zoneLabel,
      supportLabel,
    }),
    [familyLabel, modeLabel, usageLabel, quantityLabel, zoneLabel, supportLabel],
  );

  const summary = useMemo(() => buildEquipmentOrientationSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildEquipmentWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "Famille recherchée", name: "equip-family", options: equipmentOrientationOptions.families, value: familyLabel, set: setFamilyLabel },
    { legend: "Mode envisagé", name: "equip-mode", options: equipmentOrientationOptions.modes, value: modeLabel, set: setModeLabel },
    { legend: "Usage principal", name: "equip-usage", options: equipmentOrientationOptions.usages, value: usageLabel, set: setUsageLabel },
    { legend: "Quantité", name: "equip-quantity", options: equipmentOrientationOptions.quantities, value: quantityLabel, set: setQuantityLabel },
    { legend: "Zone", name: "equip-zone", options: equipmentOrientationOptions.zones, value: zoneLabel, set: setZoneLabel },
    { legend: "Accompagnement", name: "equip-support", options: equipmentOrientationOptions.support, value: supportLabel, set: setSupportLabel },
  ] as const;

  return (
    <section
      id="orientation-equipement"
      className="equip-orient section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="equip-orient-title"
    >
      <div className="container-content equip-orient__inner">
        <h2 id="equip-orient-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Orienter ma demande
        </h2>
        <p className="equip-orient__lead">
          Qualifiez votre besoin — aucune réservation en ligne ni tarif affiché.
        </p>

        <form className="equip-orient__form" onSubmit={(e) => e.preventDefault()}>
          {fieldsets.map((fs) => (
            <fieldset key={fs.name} className="equip-orient__fieldset">
              <legend>{fs.legend}</legend>
              <div className="equip-orient__options">
                {fs.options.map((opt) => (
                  <label key={opt.id} className="equip-orient__option">
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

          <div className="equip-orient__summary" aria-live="polite">
            <p className="equip-orient__summary-label">Résumé</p>
            <p className="equip-orient__summary-text">{summary}</p>
          </div>

          <div className="equip-orient__actions">
            <Button href={whatsappHref} variant="primary">Envoyer mon besoin sur WhatsApp</Button>
            <Link href="/contact" className="equip-orient__contact link-motion">Continuer sur la page contact</Link>
          </div>
        </form>

        <div className="equip-orient__static-links">
          <Link href="/solutions/location">Location</Link>
          <Link href="/solutions/vente">Vente</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <noscript>
          <p className="equip-orient__noscript">
            Sans JavaScript, utilisez les options ci-dessus et contactez-nous via{" "}
            <Link href="/contact">la page contact</Link>, ou explorez la{" "}
            <Link href="/solutions/location">location</Link> et l’<Link href="/solutions/vente">acquisition</Link>.
          </p>
        </noscript>
      </div>
    </section>
  );
}
