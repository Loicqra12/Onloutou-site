"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefContactSave } from "@/components/forms/BriefContactSave";
import { site } from "@/content/site";
import {
  PRODUCT_REQUEST_PREFILL_KEY,
  buildProductRequestWhatsAppMessage,
  buildProductRequestWhatsAppUrl,
  productRequestOptions,
  productRequestSection,
  shouldShowConditionField,
  type ProductRequestPrefill,
} from "@/content/products-page";

function readPrefill(consume = true): ProductRequestPrefill {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(PRODUCT_REQUEST_PREFILL_KEY);
    if (raw) {
      if (consume) sessionStorage.removeItem(PRODUCT_REQUEST_PREFILL_KEY);
      return JSON.parse(raw) as ProductRequestPrefill;
    }
  } catch {
    /* ignore */
  }
  return {};
}

type RequestInit = { familyLabel: string; modeLabel: string; usage: string };

let cachedRequestInit: RequestInit | undefined;

function consumeRequestInit(): RequestInit {
  if (cachedRequestInit) return cachedRequestInit;
  const stored = readPrefill(true);
  cachedRequestInit = {
    familyLabel:
      productRequestOptions.families.find((f) => f.label === stored.familyLabel)?.label ??
      productRequestOptions.families[0].label,
    modeLabel:
      productRequestOptions.modes.find((m) => m.label === stored.modeLabel)?.label ??
      productRequestOptions.modes[4].label,
    usage: stored.useCaseId ? `Besoin : ${stored.useCaseId}` : "",
  };
  return cachedRequestInit;
}

function familyIdFromLabel(label: string) {
  const found = productRequestOptions.families.find((f) => f.label === label);
  return found?.id ?? productRequestOptions.families[0].id;
}

export function ProductRequestBuilder() {
  const [familyLabel, setFamilyLabel] = useState(() => consumeRequestInit().familyLabel);
  const [usage, setUsage] = useState(() => consumeRequestInit().usage);
  const [modeLabel, setModeLabel] = useState(() => consumeRequestInit().modeLabel);
  const [quantity, setQuantity] = useState("");
  const [conditionLabel, setConditionLabel] = useState(productRequestOptions.conditions[4].label);
  const [characteristics, setCharacteristics] = useState("");
  const [budget, setBudget] = useState("");
  const [schedule, setSchedule] = useState("");
  const [zone, setZone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  const familyId = familyIdFromLabel(familyLabel);
  const showCondition = shouldShowConditionField(familyId);

  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<ProductRequestPrefill>).detail;
      if (detail.familyLabel) setFamilyLabel(detail.familyLabel);
      if (detail.modeLabel) setModeLabel(detail.modeLabel);
      if (detail.useCaseId) setUsage((prev) => (prev ? prev : `Besoin : ${detail.useCaseId}`));
    };
    window.addEventListener("onloutou-product-prefill", onPrefill);
    return () => window.removeEventListener("onloutou-product-prefill", onPrefill);
  }, []);

  const servicesLabels = useMemo(
    () => (selectedServices.length ? selectedServices.join(", ") : ""),
    [selectedServices],
  );

  const fields = useMemo(
    () => ({
      familyLabel,
      usage,
      modeLabel,
      quantity,
      conditionLabel: showCondition ? conditionLabel : "—",
      characteristics,
      budget,
      schedule,
      zone,
      servicesLabels,
      details,
    }),
    [
      familyLabel,
      usage,
      modeLabel,
      quantity,
      conditionLabel,
      showCondition,
      characteristics,
      budget,
      schedule,
      zone,
      servicesLabels,
      details,
    ],
  );

  const summary = useMemo(() => buildProductRequestWhatsAppMessage(fields), [fields]);
  const whatsappHref = useMemo(() => buildProductRequestWhatsAppUrl(fields), [fields]);

  const toggleService = (label: string) => {
    setSelectedServices((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  };

  const data = productRequestSection;

  return (
    <section
      id={data.id}
      className="prd-request section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="prd-request-title"
    >
      <div className="container-content prd-request__inner">
        <h2 id="prd-request-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>

        <form className="prd-request__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="prd-request__fieldset">
            <legend>Famille</legend>
            <div className="prd-request__options">
              {productRequestOptions.families.map((opt) => (
                <label key={opt.id} className="prd-request__option">
                  <input
                    type="radio"
                    name="prd-family"
                    checked={familyLabel === opt.label}
                    onChange={() => setFamilyLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="prd-request__field">
            <label htmlFor="prd-usage">Usage principal</label>
            <input id="prd-usage" type="text" value={usage} onChange={(e) => setUsage(e.target.value)} />
          </div>

          <fieldset className="prd-request__fieldset">
            <legend>Mode souhaité</legend>
            <div className="prd-request__options">
              {productRequestOptions.modes.map((opt) => (
                <label key={opt.id} className="prd-request__option">
                  <input
                    type="radio"
                    name="prd-mode"
                    checked={modeLabel === opt.label}
                    onChange={() => setModeLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="prd-request__field">
            <label htmlFor="prd-qty">Quantité indicative (facultatif)</label>
            <input id="prd-qty" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          {showCondition && (
            <fieldset className="prd-request__fieldset">
              <legend>État souhaité</legend>
              <div className="prd-request__options">
                {productRequestOptions.conditions.map((opt) => (
                  <label key={opt.id} className="prd-request__option">
                    <input
                      type="radio"
                      name="prd-condition"
                      checked={conditionLabel === opt.label}
                      onChange={() => setConditionLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="prd-request__field">
            <label htmlFor="prd-chars">Caractéristiques connues (facultatif)</label>
            <input id="prd-chars" type="text" value={characteristics} onChange={(e) => setCharacteristics(e.target.value)} />
          </div>

          <div className="prd-request__field">
            <label htmlFor="prd-budget">Budget indicatif (facultatif)</label>
            <input id="prd-budget" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
            <p className="prd-request__hint">Aucune estimation automatique — information orientée uniquement.</p>
          </div>

          <div className="prd-request__field">
            <label htmlFor="prd-schedule">Date ou période souhaitée (facultatif)</label>
            <input id="prd-schedule" type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
          </div>

          <div className="prd-request__field">
            <label htmlFor="prd-zone">Zone d’utilisation ou de livraison</label>
            <input id="prd-zone" type="text" value={zone} onChange={(e) => setZone(e.target.value)} />
          </div>

          <fieldset className="prd-request__fieldset">
            <legend>Services associés</legend>
            <div className="prd-request__options">
              {productRequestOptions.services.map((opt) => (
                <label key={opt.id} className="prd-request__option">
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

          <div className="prd-request__field">
            <label htmlFor="prd-details">Informations complémentaires</label>
            <textarea id="prd-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          <div className="prd-request__summary" aria-live="polite">
            <p className="prd-request__summary-label">Récapitulatif</p>
            <pre className="prd-request__summary-text">{summary}</pre>
          </div>

          <div className="prd-request__actions">
            <BriefContactSave
              source="produits-demande"
              type="PURCHASE"
              zone={zone || undefined}
              message={summary}
              payload={{
                familyLabel,
                usage,
                modeLabel,
                quantity,
                conditionLabel,
                characteristics,
                budget,
                schedule,
                zone,
                services: selectedServices,
                details,
              }}
              whatsappUrl={whatsappHref}
              whatsappLabel="Envoyer ma demande par WhatsApp"
              className="prd-request__actions"
            />
            <a href={`tel:${site.phoneTel}`} className="prd-request__phone link-motion">Appeler ONLOUTOU</a>
          </div>
        </form>

        <noscript>
          <p className="prd-request__noscript">
            Contactez ONLOUTOU par téléphone ou WhatsApp en précisant la famille, l’usage et le mode d’accès souhaité.
          </p>
        </noscript>
      </div>
    </section>
  );
}
