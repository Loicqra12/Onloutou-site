"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FamilyIcon } from "@/components/sales/SalesBriefIcons";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import {
  buildSalesRequestSummary,
  buildSalesWhatsAppUrl,
  salesRequestHighlight,
  salesRequestOptions,
  salesRequestTitle,
} from "@/content/sales-page";
import { site } from "@/content/site";

export function EquipmentRequestBuilder() {
  const [familyLabel, setFamilyLabel] = useState(salesRequestOptions.families[0].label);
  const [usageLabel, setUsageLabel] = useState(salesRequestOptions.usages[0].label);
  const [quantityLabel, setQuantityLabel] = useState(salesRequestOptions.quantities[0].label);
  const [supportLabel, setSupportLabel] = useState(salesRequestOptions.support[0].label);
  const [timelineLabel, setTimelineLabel] = useState(salesRequestOptions.timelines[0].label);

  const selection = useMemo(
    () => ({ familyLabel, usageLabel, quantityLabel, supportLabel, timelineLabel }),
    [familyLabel, usageLabel, quantityLabel, supportLabel, timelineLabel],
  );

  const summary = useMemo(() => buildSalesRequestSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildSalesWhatsAppUrl(selection), [selection]);

  const recap = [
    { label: "Famille", value: familyLabel },
    { label: "Usage", value: usageLabel },
    { label: "Quantité", value: quantityLabel },
    { label: "Accompagnement", value: supportLabel },
    { label: "Échéance", value: timelineLabel },
  ];

  return (
    <section
      id="demande-equipement"
      className="sales-builder section-spacing scroll-mt-28"
      aria-labelledby="sales-builder-title"
    >
      <div className="container-content">
        <p className="sales-eyebrow">Votre demande d’acquisition</p>
        <TitleReveal as="h2" id="sales-builder-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <MarkedPhrase text={salesRequestTitle} highlight={salesRequestHighlight} />
        </TitleReveal>
        <p className="sales-builder__lead">
          Qualifiez votre besoin d’acquisition — aucune commande en ligne ni tarif affiché.
        </p>

        <div className="sales-builder__layout">
          <form className="sales-builder__form" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="sales-builder__fieldset">
              <legend>01 · Famille</legend>
              <div className="sales-builder__needs">
                {salesRequestOptions.families.map((opt) => (
                  <label
                    key={opt.id}
                    className={`sales-builder__need${familyLabel === opt.label ? " is-checked" : ""}`}
                  >
                    <input
                      type="radio"
                      name="sales-family"
                      value={opt.label}
                      checked={familyLabel === opt.label}
                      onChange={() => setFamilyLabel(opt.label)}
                    />
                    <FamilyIcon id={opt.id} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sales-builder__fieldset">
              <legend>02 · Usage principal</legend>
              <div className="sales-builder__options">
                {salesRequestOptions.usages.map((opt) => (
                  <label key={opt.id} className="sales-builder__option">
                    <input
                      type="radio"
                      name="sales-usage"
                      value={opt.label}
                      checked={usageLabel === opt.label}
                      onChange={() => setUsageLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sales-builder__fieldset">
              <legend>03 · Quantité indicative</legend>
              <div className="sales-builder__options">
                {salesRequestOptions.quantities.map((opt) => (
                  <label key={opt.id} className="sales-builder__option">
                    <input
                      type="radio"
                      name="sales-quantity"
                      value={opt.label}
                      checked={quantityLabel === opt.label}
                      onChange={() => setQuantityLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sales-builder__fieldset">
              <legend>04 · Accompagnement</legend>
              <div className="sales-builder__options">
                {salesRequestOptions.support.map((opt) => (
                  <label key={opt.id} className="sales-builder__option">
                    <input
                      type="radio"
                      name="sales-support"
                      value={opt.label}
                      checked={supportLabel === opt.label}
                      onChange={() => setSupportLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="sales-builder__fieldset">
              <legend>05 · Échéance indicative</legend>
              <div className="sales-builder__options">
                {salesRequestOptions.timelines.map((opt) => (
                  <label key={opt.id} className="sales-builder__option">
                    <input
                      type="radio"
                      name="sales-timeline"
                      value={opt.label}
                      checked={timelineLabel === opt.label}
                      onChange={() => setTimelineLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>

          <aside className="sales-builder__recap" aria-live="polite">
            <p className="sales-builder__summary-label">Récapitulatif</p>
            <dl>
              {recap.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="sales-builder__summary">{summary}</p>
            <div className="sales-builder__actions">
              <Button href={whatsappHref} variant="primary">
                Envoyer sur WhatsApp
              </Button>
              <a href={`tel:${site.phoneTel}`} className="sales-builder__phone">
                {site.phoneDisplay}
              </a>
              <Link href="/contact" className="sales-builder__contact link-motion">
                Passer par la page contact
              </Link>
            </div>
          </aside>
        </div>

        <noscript>
          <p className="sales-builder__noscript">
            Préparez : famille, usage, quantité, accompagnement et échéance, puis contactez-nous via la{" "}
            <Link href="/contact">page contact</Link>.
          </p>
        </noscript>
      </div>
    </section>
  );
}
