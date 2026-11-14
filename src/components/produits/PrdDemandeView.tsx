"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrdCrumb } from "@/components/produits/PrdCrumb";
import { PrdControl, PrdDateRange, PrdField } from "@/components/produits/PrdField";
import { PrdArrow } from "@/components/produits/PrdIcons";
import { PrdPicture } from "@/components/produits/PrdPicture";
import {
  PRD_CONFIRMATION_PATH,
  PRD_DEMO_REFERENCE,
  PRD_REMISE_PATH,
  PRD_SUR_MESURE_PATH,
  catalogById,
  prdDemandeCopy,
  prdPlaces,
} from "@/content/produits-hub";
import { apiEnabled } from "@/lib/api/client";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import {
  buildRequestMessage,
  demoSnapshotFromBasket,
  ingestFamilyBaskets,
  patchPrdBasket,
  usePrdBasket,
  writeConfirmationSnapshot,
  type PrdIntent,
} from "@/lib/produits-basket";


function itemSubtitle(item: { custom?: boolean; unitKind: string; quantity: number; packSize: number; unitLabel: string; familyLabel: string }) {
  if (item.custom) return "article décrit par le client";
  if (item.unitKind === "lot") {
    return `${item.quantity} lot${item.quantity > 1 ? "s" : ""} de ${item.packSize} ${item.unitLabel}`;
  }
  return item.familyLabel;
}

function itemQty(item: { unitKind: string; quantity: number }) {
  if (item.unitKind === "lot") return `${item.quantity} lot${item.quantity > 1 ? "s" : ""}`;
  return `${item.quantity} unité${item.quantity > 1 ? "s" : ""}`;
}

function itemPhoto(item: { catalogId?: string; custom?: boolean }): keyof typeof import("@/content/produits-hub").prdPhotos | null {
  if (item.custom) return null;
  const product = item.catalogId ? catalogById(item.catalogId) : undefined;
  return product?.photo ?? null;
}

export function PrdDemandeView() {
  const router = useRouter();
  const basket = usePrdBasket();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const submitCatalog = useCatalogFamilySubmit(PRD_DEMO_REFERENCE);

  useEffect(() => {
    ingestFamilyBaskets();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!basket.name.trim() || !basket.phone.trim()) {
      setError("Indiquez le nom du contact et un numéro de rappel.");
      return;
    }
    if (basket.items.length === 0) {
      setError("Ajoutez au moins un article à votre demande.");
      return;
    }
    setPending(true);
    try {
      const snapshotBase = demoSnapshotFromBasket(basket);
      const result = await submitCatalog({
        source: "produits",
        type: "PRODUCT",
        contactName: basket.name.trim(),
        contactPhone: basket.phone.trim(),
        zone: basket.zone.trim() || undefined,
        message: buildRequestMessage(basket),
        sourcePath: "/produits/demande",
        payload: {
          intent: basket.intent,
          items: basket.items,
          startDate: basket.startDate,
          endDate: basket.endDate,
          deliveryMode: basket.deliveryMode,
          place: basket.place,
          deliveryAt: basket.deliveryAt,
          pickupAt: basket.pickupAt,
          access: basket.access,
          projectLabel: basket.projectLabel,
        },
      });
      if (!result.ok) {
        // Pas de fausse confirmation : l'utilisateur reste sur le formulaire, ses données sont conservées.
        setError(result.error);
        return;
      }
      writeConfirmationSnapshot({
        ...snapshotBase,
        reference: result.reference,
        referenceKind: apiEnabled() ? "api" : "demo",
      });
      router.push(PRD_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  }

  const deliveryLine =
    basket.deliveryMode === "livraison" && basket.zone.trim()
      ? `Livraison souhaitée à ${basket.zone.trim()}.`
      : basket.deliveryMode === "retrait"
        ? "Retrait chez le partenaire."
        : basket.deliveryMode === "convenir"
          ? "Modalités de remise à convenir."
          : basket.zone.trim()
            ? `Livraison souhaitée à ${basket.zone.trim()}.`
            : "";

  return (
    <div className="prd-page prd-wrap">
      <PrdCrumb items={[...prdDemandeCopy.crumb]} />
      <h1 className="prd-h1">{prdDemandeCopy.title}</h1>
      {basket.projectLabel ? <p className="prd-subtitle">{basket.projectLabel}</p> : <div className="prd-subtitle" />}
      <div className="prd-split">
        <form id="prd-demande-form" onSubmit={submit}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {basket.items.map((item) => {
              const photo = itemPhoto(item);
              return (
                <li key={item.id} className="prd-line-item">
                  {photo ? <PrdPicture photo={photo} /> : <div className="prd-photo" />}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{itemSubtitle(item)}</p>
                  </div>
                  <strong>{itemQty(item)}</strong>
                </li>
              );
            })}
          </ul>
          <Link className="prd-add-more" href={PRD_SUR_MESURE_PATH}>
            + {prdDemandeCopy.addMore}
          </Link>
          <div className="prd-form-grid">
            <PrdField id="prd-dem-zone" label={prdDemandeCopy.commune}>
              <PrdControl>
                <input
                  id="prd-dem-zone"
                  value={basket.zone}
                  list="prd-places"
                  onChange={(event) => patchPrdBasket({ zone: event.target.value })}
                />
              </PrdControl>
            </PrdField>
            <PrdField label={prdDemandeCopy.period}>
              <PrdDateRange
                startId="prd-dem-start"
                endId="prd-dem-end"
                startDate={basket.startDate}
                endDate={basket.endDate}
                onChange={(startDate, endDate) => patchPrdBasket({ startDate, endDate })}
              />
            </PrdField>
            <PrdField id="prd-dem-name" label={prdDemandeCopy.contact}>
              <PrdControl>
                <input
                  id="prd-dem-name"
                  value={basket.name}
                  placeholder={prdDemandeCopy.contactPh}
                  autoComplete="name"
                  onChange={(event) => patchPrdBasket({ name: event.target.value })}
                />
              </PrdControl>
            </PrdField>
            <PrdField id="prd-dem-phone" label={prdDemandeCopy.phone}>
              <PrdControl>
                <input
                  id="prd-dem-phone"
                  value={basket.phone}
                  placeholder={prdDemandeCopy.phonePh}
                  autoComplete="tel"
                  onChange={(event) => patchPrdBasket({ phone: event.target.value })}
                />
              </PrdControl>
            </PrdField>
          </div>
          <p style={{ margin: "16px 0 0" }}>
            <Link className="prd-link" href={PRD_REMISE_PATH}>
              {prdDemandeCopy.remiseLink}
            </Link>
          </p>
          {error ? <p className="prd-error" role="alert">{error}</p> : null}
          <datalist id="prd-places">
            {prdPlaces.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
        </form>
        <aside className="prd-project">
          <h2>{prdDemandeCopy.projectTitle}</h2>
          <fieldset className="prd-radios">
            <legend style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{prdDemandeCopy.projectTitle}</legend>
            {(
              [
                ["location", prdDemandeCopy.intentLocation],
                ["achat", prdDemandeCopy.intentPurchase],
                ["etude", prdDemandeCopy.intentStudy],
              ] as [PrdIntent, string][]
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="prd-intent"
                  value={value}
                  checked={basket.intent === value}
                  onChange={() => patchPrdBasket({ intent: value })}
                />
                {label}
              </label>
            ))}
          </fieldset>
          {deliveryLine ? <p>{deliveryLine}</p> : null}
          <p>{prdDemandeCopy.partnersNote}</p>
          <button type="submit" form="prd-demande-form" className="prd-btn prd-btn--yellow" disabled={pending}>
            {prdDemandeCopy.submit} <PrdArrow />
          </button>
        </aside>
      </div>
    </div>
  );
}
