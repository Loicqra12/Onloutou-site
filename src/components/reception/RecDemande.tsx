"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  REC_CONFIRMATION_PATH,
  REC_DEMO_REFERENCE,
  REC_ROOT,
  recAislePath,
  recDemandeCopy,
  recItemSummary,
  recPlaces,
  recRecapSummary,
  recSceneMeeting,
  recWhyImages,
} from "@/content/reception";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import { recRequestMessage } from "@/lib/reception-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useRecRequest } from "./RecRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
function AccentTitle({ title, accent, className }: { title: string; accent: string; className?: string }) {
  const accentAt = title.indexOf(accent);
  if (accentAt < 0) return <h1 className={className}>{title}</h1>;
  return (
    <h1 className={className}>
      {title.slice(0, accentAt)}
      <span className="rec-underline">{accent}</span>
      {title.slice(accentAt + accent.length)}
    </h1>
  );
}

export function RecDemande() {
  const router = useRouter();
  const request = useRecRequest();
  const recap = recRecapSummary(
    request.itemsWithProduct.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      title: item.title,
      unitLabel: item.unitLabel,
      packSize: item.packSize,
      unitKind: item.unitKind,
    })),
  );
  const submitCatalog = useCatalogFamilySubmit(REC_DEMO_REFERENCE);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const why = useMemo(
    () => recDemandeCopy.why.map((item) => ({ ...item, image: recWhyImages[item.image] })),
    [],
  );

  useEffect(() => {
    if (!mounted) return;
    if (request.itemsWithProduct.length === 0) router.replace(REC_ROOT);
  }, [mounted, request.itemsWithProduct.length, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!request.state.name.trim() || !request.state.phone.trim()) {
      setError("Indiquez votre nom et votre téléphone pour envoyer la demande.");
      return;
    }
    if (request.itemsWithProduct.length === 0) {
      setError("Ajoutez au moins un article à votre demande.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const result = await submitCatalog({
        source: "reception-demande",
        type: "RENTAL",
        contactName: request.state.name.trim(),
        contactPhone: request.state.phone.trim(),
        contactEmail: request.state.email.trim() || undefined,
        zone: request.state.zone.trim() || undefined,
        message: recRequestMessage(request.state),
        sourcePath: REC_CONFIRMATION_PATH,
        payload: {
          items: request.itemsWithProduct.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            detail: recItemSummary(item, item.quantity),
          })),
          eventName: request.state.eventName,
          guests: request.state.guests,
          deliveryAt: request.state.deliveryAt,
          pickupAt: request.state.pickupAt,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      request.setMeta({ reference: result.reference });
      router.push(REC_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  };

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="rec-page rec-page--demande" aria-busy={!mounted} />;
  }

  const whyTitle = recDemandeCopy.whyTitle;
  const whyAccent = recDemandeCopy.whyTitleAccent;
  const whyAccentAt = whyTitle.indexOf(whyAccent);

  return (
    <div className="rec-page rec-page--demande">
      <header className="rec-demande-hero">
        <AccentTitle title={recDemandeCopy.title} accent={recDemandeCopy.titleAccent} className="rec-h1 rec-h1--demande" />
        <p className="rec-lead">{recDemandeCopy.lead}</p>
      </header>

      <div className="rec-demande-grid">
        <form className="rec-demande-form" onSubmit={onSubmit} noValidate>
          <section className="rec-card" aria-labelledby="rec-items-title">
            <h2 id="rec-items-title">{recDemandeCopy.itemsTitle}</h2>
            <ul className="rec-demande-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={72} height={72} className="rec-demande-items__thumb" style={{ objectFit: "cover" }} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{recItemSummary(item, item.quantity)}</p>
                  </div>
                  <div className="rec-qty">
                    <div className="rec-qty__ctrl">
                      <button type="button" aria-label="Diminuer" onClick={() => request.setQuantity(item.id, item.quantity - 1)}>
                        <VhpIcon name="minus" strokeWidth={1.5} />
                      </button>
                      <strong>{item.quantity}</strong>
                      <button type="button" aria-label="Augmenter" onClick={() => request.setQuantity(item.id, item.quantity + 1)}>
                        <VhpIcon name="plus" strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="rec-qty-unit">{item.unitKind === "lot" ? "LOTS" : "PIÈCES"}</span>
                  </div>
                  <button type="button" aria-label="Retirer" onClick={() => request.remove(item.id)}>
                    <VhpIcon name="trash" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href={REC_ROOT} className="rec-btn rec-btn--outline">
              + {recDemandeCopy.addDevice}
            </Link>
          </section>

          <div className="rec-slots">
            <label className="rec-field" htmlFor="rec-event">
              <span>{recDemandeCopy.eventLabel}</span>
              <input id="rec-event" type="text" value={request.state.eventName} onChange={(e) => request.setMeta({ eventName: e.target.value })} placeholder={recDemandeCopy.eventPlaceholder} />
            </label>
            <label className="rec-field" htmlFor="rec-guests">
              <span>{recDemandeCopy.guestsLabel}</span>
              <input id="rec-guests" type="text" value={request.state.guests} onChange={(e) => request.setMeta({ guests: e.target.value })} placeholder={recDemandeCopy.guestsPlaceholder} />
            </label>
          </div>

          <label className="rec-field">
            <span>{recDemandeCopy.placeLabel}</span>
            <span className="rec-field--icon rec-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select value={request.state.zone} onChange={(e) => request.setMeta({ zone: e.target.value })}>
              <option value="">Choisir</option>
              {recPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
              <VhpIcon name="chevronDown" className="rec-field__caret" strokeWidth={1.8} />
            </span>
          </label>

          <FamilyDateRange
            prefix="rec"
            startId="rec-demande-start"
            endId="rec-demande-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startLabel={recDemandeCopy.startLabel}
            endLabel={recDemandeCopy.endLabel}
            fieldClass="rec-field"
          />

          <div className="rec-slots">
            <label className="rec-field" htmlFor="rec-delivery">
              <span>{recDemandeCopy.deliveryLabel}</span>
              <input id="rec-delivery" type="datetime-local" value={request.state.deliveryAt} onChange={(e) => request.setMeta({ deliveryAt: e.target.value })} />
            </label>
            <label className="rec-field" htmlFor="rec-pickup">
              <span>{recDemandeCopy.pickupLabel}</span>
              <input id="rec-pickup" type="datetime-local" value={request.state.pickupAt} onChange={(e) => request.setMeta({ pickupAt: e.target.value })} />
            </label>
          </div>

          <section className="rec-card" aria-labelledby="rec-contact-title">
            <h2 id="rec-contact-title">{recDemandeCopy.contactTitle}</h2>
            <label className="rec-field">
              <span>{recDemandeCopy.nameLabel}</span>
              <input value={request.state.name} onChange={(e) => request.setMeta({ name: e.target.value })} required />
            </label>
            <label className="rec-field">
              <span>{recDemandeCopy.phoneLabel}</span>
              <input value={request.state.phone} onChange={(e) => request.setMeta({ phone: e.target.value })} required />
            </label>
            <label className="rec-field">
              <span>{recDemandeCopy.emailLabel}</span>
              <input type="email" value={request.state.email} onChange={(e) => request.setMeta({ email: e.target.value })} />
            </label>
          </section>

          {error ? <p role="alert">{error}</p> : null}
          <button type="submit" className="rec-btn rec-btn--yellow rec-btn--block" disabled={pending}>
            {recDemandeCopy.submit}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </button>
        </form>

        <aside className="rec-recap" aria-labelledby="rec-recap-title">
          <h2 id="rec-recap-title">{recDemandeCopy.recapTitle}</h2>
          {request.state.eventName ? (
            <p>
              <strong>{request.state.eventName}</strong>
              {request.state.guests ? ` · ${request.state.guests} invités` : ""}
            </p>
          ) : null}
          <ul>
            {recap.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>{request.state.zone || "Lieu à préciser"}</p>
          {request.state.deliveryAt ? <p>Livraison : {request.state.deliveryAt}</p> : null}
          {request.state.pickupAt ? <p>Reprise : {request.state.pickupAt}</p> : null}
          <p className="rec-recap__note">
            <VhpIcon name="info" strokeWidth={1.5} /> {recDemandeCopy.tariffNote}
          </p>
          <figure className="rec-recap__visual">
            <Image src={recSceneMeeting.src} alt="" width={recSceneMeeting.width} height={recSceneMeeting.height} sizes="320px" style={{ objectFit: "cover", objectPosition: recSceneMeeting.objectPosition }} />
          </figure>
        </aside>
      </div>

      <section className="rec-why" aria-labelledby="rec-why-title">
        <h2 id="rec-why-title">
          {whyAccentAt >= 0 ? (
            <>
              {whyTitle.slice(0, whyAccentAt)}
              <span className="rec-underline">{whyAccent}</span>
              {whyTitle.slice(whyAccentAt + whyAccent.length)}
            </>
          ) : (
            whyTitle
          )}
        </h2>
        <ul>
          {why.map((item) => (
            <li key={item.id}>
              <Link href={recAislePath(item.aisleId)}>
                <Image src={item.image.src} alt="" width={item.image.width} height={item.image.height} sizes="240px" style={{ objectFit: "cover" }} />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}