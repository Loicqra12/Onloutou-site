"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import {
  TOOLS_FAMILY_PREFILL_KEY,
  TOOLS_MODE_PREFILL_KEY,
  buildToolsEquipmentWhatsAppMessage,
  buildToolsEquipmentWhatsAppUrl,
  toolsFamilyRequestLabels,
  toolsRequestOptions,
  type ToolsFamilyId,
} from "@/content/tools-equipment-page";

const DESCRIPTION_MAX = 500;
const familyIds = Object.keys(toolsFamilyRequestLabels) as ToolsFamilyId[];

function readFamilyPrefill(): ToolsFamilyId {
  if (typeof window === "undefined") return "intervention";
  try {
    const pref = sessionStorage.getItem(TOOLS_FAMILY_PREFILL_KEY) as ToolsFamilyId | null;
    if (pref && familyIds.includes(pref)) {
      sessionStorage.removeItem(TOOLS_FAMILY_PREFILL_KEY);
      return pref;
    }
  } catch {
    /* ignore */
  }
  return "intervention";
}

function readModePrefill(): string {
  if (typeof window === "undefined") return toolsRequestOptions.modes[0].label;
  try {
    const modePref = sessionStorage.getItem(TOOLS_MODE_PREFILL_KEY);
    if (modePref) {
      sessionStorage.removeItem(TOOLS_MODE_PREFILL_KEY);
      return modePref;
    }
  } catch {
    /* ignore */
  }
  return toolsRequestOptions.modes[0].label;
}

export function ToolsEquipmentRequestBuilder() {
  const [familyId, setFamilyId] = useState<ToolsFamilyId>(readFamilyPrefill);
  const [usage, setUsage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [modeLabel, setModeLabel] = useState(readModePrefill);
  const [durationLabel, setDurationLabel] = useState(toolsRequestOptions.durations[0].label);
  const [zone, setZone] = useState("");
  const [energy, setEnergy] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  useEffect(() => {
    const onFamily = (event: Event) => {
      const id = (event as CustomEvent<ToolsFamilyId>).detail;
      if (familyIds.includes(id)) setFamilyId(id);
    };
    const onMode = (event: Event) => {
      const mode = (event as CustomEvent<string>).detail;
      if (mode) setModeLabel(mode);
    };
    window.addEventListener("onloutou-tools-family", onFamily);
    window.addEventListener("onloutou-tools-mode", onMode);
    return () => {
      window.removeEventListener("onloutou-tools-family", onFamily);
      window.removeEventListener("onloutou-tools-mode", onMode);
    };
  }, []);

  const familyLabel = toolsFamilyRequestLabels[familyId];

  const servicesLabels = useMemo(
    () => (selectedServices.length ? selectedServices.join(", ") : ""),
    [selectedServices],
  );

  const messageFields = useMemo(
    () => ({
      familyLabel,
      usage,
      quantity,
      modeLabel,
      durationLabel,
      zone,
      energy,
      servicesLabels,
      details,
    }),
    [familyLabel, usage, quantity, modeLabel, durationLabel, zone, energy, servicesLabels, details],
  );

  const summary = useMemo(() => buildToolsEquipmentWhatsAppMessage(messageFields), [messageFields]);
  const whatsappHref = useMemo(() => buildToolsEquipmentWhatsAppUrl(messageFields), [messageFields]);

  const toggleService = (label: string) => {
    setSelectedServices((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  };

  return (
    <section
      id="demande-materiel"
      className="tem-request section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="tem-request-title"
    >
      <div className="container-content tem-request__inner">
        <h2 id="tem-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Préparez votre demande de matériel.
        </h2>
        <p className="tem-request__lead">Aucune donnée n’est enregistrée sur ce site — le résumé sert à préparer votre message.</p>

        <form className="tem-request__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="tem-request__fieldset">
            <legend>Famille</legend>
            <div className="tem-request__options">
              {familyIds.map((id) => (
                <label key={id} className="tem-request__option">
                  <input
                    type="radio"
                    name="tem-family"
                    checked={familyId === id}
                    onChange={() => setFamilyId(id)}
                  />
                  <span>{toolsFamilyRequestLabels[id]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tem-request__field">
            <label htmlFor="tem-usage">Usage principal</label>
            <input id="tem-usage" name="tem-usage" type="text" value={usage} onChange={(e) => setUsage(e.target.value)} />
          </div>

          <div className="tem-request__field">
            <label htmlFor="tem-quantity">Quantité indicative (facultatif)</label>
            <input id="tem-quantity" name="tem-quantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <fieldset className="tem-request__fieldset">
            <legend>Mode souhaité</legend>
            <div className="tem-request__options">
              {toolsRequestOptions.modes.map((opt) => (
                <label key={opt.id} className="tem-request__option">
                  <input
                    type="radio"
                    name="tem-mode"
                    checked={modeLabel === opt.label}
                    onChange={() => setModeLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="tem-request__fieldset">
            <legend>Durée ou fréquence</legend>
            <div className="tem-request__options">
              {toolsRequestOptions.durations.map((opt) => (
                <label key={opt.id} className="tem-request__option">
                  <input
                    type="radio"
                    name="tem-duration"
                    checked={durationLabel === opt.label}
                    onChange={() => setDurationLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tem-request__field">
            <label htmlFor="tem-zone">Zone d’utilisation</label>
            <input id="tem-zone" name="tem-zone" type="text" value={zone} onChange={(e) => setZone(e.target.value)} />
          </div>

          <div className="tem-request__field">
            <label htmlFor="tem-energy">Source d’énergie ou contrainte technique (facultatif)</label>
            <input id="tem-energy" name="tem-energy" type="text" value={energy} onChange={(e) => setEnergy(e.target.value)} />
          </div>

          <fieldset className="tem-request__fieldset">
            <legend>Services souhaités</legend>
            <div className="tem-request__options">
              {toolsRequestOptions.services.map((opt) => (
                <label key={opt.id} className="tem-request__option">
                  <input
                    type="checkbox"
                    name="tem-services"
                    checked={selectedServices.includes(opt.label)}
                    onChange={() => toggleService(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tem-request__field">
            <label htmlFor="tem-details">Description complémentaire</label>
            <textarea
              id="tem-details"
              name="tem-details"
              rows={4}
              maxLength={DESCRIPTION_MAX}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="tem-request__summary" aria-live="polite">
            <p className="tem-request__summary-label">Récapitulatif</p>
            <pre className="tem-request__summary-text">{summary}</pre>
          </div>

          <div className="tem-request__actions">
            <Button href={whatsappHref} variant="primary">Envoyer ma demande par WhatsApp</Button>
            <a href={`tel:${site.phoneTel}`} className="tem-request__phone link-motion">{site.phoneDisplay}</a>
          </div>

          <div className="tem-request__static-links">
            <Link href="/solutions/location" className="link-motion">Location</Link>
            <Link href="/solutions/vente" className="link-motion">Acquisition</Link>
            <Link href="/contact" className="link-motion">Contact</Link>
          </div>
        </form>

        <noscript>
          <p className="tem-request__noscript">
            Contactez ONLOUTOU via la <Link href="/contact">page contact</Link>, par téléphone ou WhatsApp, en précisant famille, usage et zone.
          </p>
        </noscript>
      </div>
    </section>
  );
}
