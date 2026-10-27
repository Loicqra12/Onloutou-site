"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import {
  CONNECTED_ASSET_PREFILL_KEY,
  buildConnectedEquipmentWhatsAppMessage,
  buildConnectedEquipmentWhatsAppUrl,
  connectedAssetRequestLabels,
  connectedRequestOptions,
  type ConnectedAssetId,
} from "@/content/connected-equipment-page";

const DESCRIPTION_MAX = 500;
const assetPrefillIds = Object.keys(connectedAssetRequestLabels) as ConnectedAssetId[];

const prefillToRequestLabel: Record<ConnectedAssetId, string> = {
  "light-vehicle": "voiture ou véhicule léger",
  moto: "moto",
  truck: "camion",
  powered: "équipement mobile",
  "no-power": "matériel sans alimentation permanente",
  fixed: "installation fixe",
};

function readAssetPrefill(): string {
  if (typeof window === "undefined") return connectedRequestOptions.assets[0].label;
  try {
    const pref = sessionStorage.getItem(CONNECTED_ASSET_PREFILL_KEY) as ConnectedAssetId | null;
    if (pref && assetPrefillIds.includes(pref)) {
      sessionStorage.removeItem(CONNECTED_ASSET_PREFILL_KEY);
      return prefillToRequestLabel[pref];
    }
  } catch {
    /* ignore */
  }
  return connectedRequestOptions.assets[0].label;
}

export function ConnectedEquipmentRequestBuilder() {
  const [assetLabel, setAssetLabel] = useState(readAssetPrefill);
  const [count, setCount] = useState("");
  const [powerLabel, setPowerLabel] = useState(connectedRequestOptions.power[0].label);
  const [needLabel, setNeedLabel] = useState(connectedRequestOptions.needs[0].label);
  const [zoneLabel, setZoneLabel] = useState(connectedRequestOptions.zones[0].label);
  const [frequencyLabel, setFrequencyLabel] = useState(connectedRequestOptions.frequencies[0].label);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  useEffect(() => {
    const onAsset = (event: Event) => {
      const id = (event as CustomEvent<ConnectedAssetId>).detail;
      if (assetPrefillIds.includes(id)) setAssetLabel(prefillToRequestLabel[id]);
    };
    window.addEventListener("onloutou-connected-asset", onAsset);
    return () => window.removeEventListener("onloutou-connected-asset", onAsset);
  }, []);

  const servicesLabels = useMemo(
    () => (selectedServices.length ? selectedServices.join(", ") : ""),
    [selectedServices],
  );

  const fields = useMemo(
    () => ({
      assetLabel,
      count,
      powerLabel,
      needLabel,
      zoneLabel,
      frequencyLabel,
      servicesLabels,
      details,
    }),
    [assetLabel, count, powerLabel, needLabel, zoneLabel, frequencyLabel, servicesLabels, details],
  );

  const summary = useMemo(() => buildConnectedEquipmentWhatsAppMessage(fields), [fields]);
  const whatsappHref = useMemo(() => buildConnectedEquipmentWhatsAppUrl(fields), [fields]);

  const toggleService = (label: string) => {
    setSelectedServices((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  };

  return (
    <section
      id="demande-connectee"
      className="cec-request section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="cec-request-title"
    >
      <div className="container-content cec-request__inner">
        <h2 id="cec-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Qualifiez votre besoin d’équipement connecté.
        </h2>

        <form className="cec-request__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="cec-request__fieldset">
            <legend>Type d’actif</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.assets.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="radio"
                    name="cec-asset"
                    checked={assetLabel === opt.label}
                    onChange={() => setAssetLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="cec-request__field">
            <label htmlFor="cec-count">Nombre indicatif d’actifs (facultatif)</label>
            <input id="cec-count" type="text" value={count} onChange={(e) => setCount(e.target.value)} />
          </div>

          <fieldset className="cec-request__fieldset">
            <legend>Alimentation disponible</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.power.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="radio"
                    name="cec-power"
                    checked={powerLabel === opt.label}
                    onChange={() => setPowerLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="cec-request__fieldset">
            <legend>Besoin principal</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.needs.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="radio"
                    name="cec-need"
                    checked={needLabel === opt.label}
                    onChange={() => setNeedLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="cec-request__fieldset">
            <legend>Zone d’utilisation</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.zones.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="radio"
                    name="cec-zone"
                    checked={zoneLabel === opt.label}
                    onChange={() => setZoneLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="cec-request__fieldset">
            <legend>Fréquence souhaitée</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.frequencies.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="radio"
                    name="cec-frequency"
                    checked={frequencyLabel === opt.label}
                    onChange={() => setFrequencyLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="cec-request__fieldset">
            <legend>Services souhaités</legend>
            <div className="cec-request__options">
              {connectedRequestOptions.services.map((opt) => (
                <label key={opt.id} className="cec-request__option">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(opt.label)}
                    onChange={() => toggleService(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="cec-request__field">
            <label htmlFor="cec-details">Description complémentaire</label>
            <textarea
              id="cec-details"
              rows={4}
              maxLength={DESCRIPTION_MAX}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="cec-request__summary" aria-live="polite">
            <p className="cec-request__summary-label">Récapitulatif</p>
            <pre className="cec-request__summary-text">{summary}</pre>
          </div>

          <div className="cec-request__actions">
            <Button href={whatsappHref} variant="primary">Envoyer ma demande par WhatsApp</Button>
            <a href={`tel:${site.phoneTel}`} className="cec-request__phone link-motion">Appeler ONLOUTOU</a>
          </div>
        </form>

        <noscript>
          <p className="cec-request__noscript">
            Contactez ONLOUTOU par téléphone ou WhatsApp en précisant le type d’actif, l’alimentation et la zone d’utilisation.
          </p>
        </noscript>
      </div>
    </section>
  );
}
