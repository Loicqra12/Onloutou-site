"use client";

import { useEffect, useState, type FormEvent, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ENF_CONFIRMATION_PATH,
  ENF_DEMO_REFERENCE,
  ENF_FAMILY_LABEL,
  ENF_ROOT,
  enfAislePath,
  enfDemandeCopy,
  enfPlaces,
  formatEnfStay,
  getEnfAisle,
} from "@/content/enfance";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import { enfRequestMessage } from "@/lib/enfance-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useEnfRequest } from "./EnfRequest";

export function EnfDemande() {
  const router = useRouter();
  const request = useEnfRequest();
  const submitCatalog = useCatalogFamilySubmit(ENF_DEMO_REFERENCE);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;
    if (request.itemsWithProduct.length === 0) {
      router.replace(ENF_ROOT);
    }
  }, [mounted, request.itemsWithProduct.length, router]);

  const stay = formatEnfStay(request.state.startDate, request.state.endDate);
  const whyAisles = enfDemandeCopy.whyAisleIds
    .map((id) => getEnfAisle(id))
    .filter((aisle): aisle is NonNullable<typeof aisle> => Boolean(aisle));
  const whyTitle = enfDemandeCopy.whyTitle;
  const whyAccent = enfDemandeCopy.whyTitleAccent;
  const whyAccentAt = whyTitle.indexOf(whyAccent);


  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!request.state.name.trim() || !request.state.phone.trim()) {
      setError(enfDemandeCopy.errorContact);
      return;
    }
    if (request.itemsWithProduct.length === 0) {
      setError(enfDemandeCopy.errorItems);
      return;
    }
    setPending(true);
    setError(null);

    try {
      const result = await submitCatalog({
        source: "enfance-demande",
        type: "RENTAL",
        contactName: request.state.name.trim(),
        contactPhone: request.state.phone.trim(),
        contactEmail: request.state.email.trim() || undefined,
        zone: request.state.zone.trim() || undefined,
        message: enfRequestMessage(request.state),
        sourcePath: ENF_CONFIRMATION_PATH,
        payload: {
          familyLabel: ENF_FAMILY_LABEL,
          items: request.itemsWithProduct.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
          })),
          startDate: request.state.startDate,
          endDate: request.state.endDate,
          delivery: request.state.delivery,
          notes: request.state.notes,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      request.setMeta({ reference: result.reference });
      router.push(ENF_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  };

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="enf-page enf-page--demande" aria-busy={!mounted} />;
  }

  return (
    <div className="enf-page enf-page--demande">
      <header className="enf-demande-hero">
        <nav className="enf-crumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">
                <VhpIcon name="home" strokeWidth={1.5} />
                <span className="visually-hidden">Accueil</span>
              </Link>
            </li>
            <li>
              <Link href={ENF_ROOT}>{ENF_FAMILY_LABEL}</Link>
            </li>
            <li>
              <span aria-current="page">Ma demande</span>
            </li>
          </ol>
        </nav>
        <h1 className="enf-h1 enf-h1--demande">
          <span className="enf-underline">{enfDemandeCopy.titleAccent}</span>
          {enfDemandeCopy.title.slice(enfDemandeCopy.titleAccent.length)}
        </h1>
      </header>

      <form className="enf-demande-layout" onSubmit={onSubmit}>
        <div className="enf-demande-main">
          <section className="enf-card" aria-labelledby="enf-items-title">
            <h2 id="enf-items-title">{enfDemandeCopy.itemsTitle}</h2>
            <ul className="enf-demande-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <span className="enf-demande-items__thumb">
                    <Image src={item.image.src} alt="" width={72} height={72} />
                  </span>
                  <strong>{item.title}</strong>
                  <div className="enf-qty__ctrl">
                    <button
                      type="button"
                      aria-label={`Diminuer ${item.title}`}
                      onClick={() => request.setQuantity(item.id, item.quantity - 1)}
                    >
                      <VhpIcon name="minus" strokeWidth={1.5} />
                    </button>
                    <strong aria-live="polite">{item.quantity}</strong>
                    <button
                      type="button"
                      aria-label={`Augmenter ${item.title}`}
                      onClick={() => request.setQuantity(item.id, item.quantity + 1)}
                    >
                      <VhpIcon name="plus" strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Link href={ENF_ROOT} className="enf-add-other">
              <VhpIcon name="plus" strokeWidth={1.5} /> {enfDemandeCopy.addOther}
            </Link>
          </section>

          <section className="enf-card" aria-labelledby="enf-stay-title">
            <h2 id="enf-stay-title">{enfDemandeCopy.stayTitle}</h2>
            <label className="enf-field" htmlFor="enf-zone">
              <span>{enfDemandeCopy.placeLabel}</span>
              <span className="enf-field--icon enf-field--select">
                <VhpIcon name="pin" strokeWidth={1.5} />
                <select
                  id="enf-zone"
                  value={request.state.zone || "Cocody"}
                  onChange={(e) => request.setMeta({ zone: e.target.value })}
                >
                  {enfPlaces.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
                <VhpIcon name="chevronDown" className="enf-field__caret" strokeWidth={1.8} />
              </span>
            </label>
            <div className="enf-field-row">
              <label className="enf-field" htmlFor="enf-start">
                <span>{enfDemandeCopy.fromLabel}</span>
                <span className="enf-field--icon">
                  <VhpIcon name="calendar" strokeWidth={1.5} />
                  <input
                    id="enf-start"
                    type="date"
                    value={request.state.startDate}
                    onChange={(e) => request.setMeta({ startDate: e.target.value })}
                  />
                </span>
              </label>
              <label className="enf-field" htmlFor="enf-end">
                <span>{enfDemandeCopy.toLabel}</span>
                <span className="enf-field--icon">
                  <VhpIcon name="calendar" strokeWidth={1.5} />
                  <input
                    id="enf-end"
                    type="date"
                    value={request.state.endDate}
                    onChange={(e) => request.setMeta({ endDate: e.target.value })}
                  />
                </span>
              </label>
            </div>
            <label className="enf-radio enf-radio--inline">
              <input
                type="checkbox"
                checked={request.state.delivery}
                onChange={(e) => request.setMeta({ delivery: e.target.checked })}
              />
              <span>{enfDemandeCopy.deliveryLabel}</span>
            </label>
            <label className="enf-field" htmlFor="enf-notes">
              <span>{enfDemandeCopy.notesLabel}</span>
              <input
                id="enf-notes"
                type="text"
                value={request.state.notes}
                onChange={(e) => request.setMeta({ notes: e.target.value })}
              />
            </label>
          </section>

          <section className="enf-card" aria-labelledby="enf-contact-title">
            <h2 id="enf-contact-title">{enfDemandeCopy.contactTitle}</h2>
            <div className="enf-field-row">
              <label className="enf-field" htmlFor="enf-name">
                <span>{enfDemandeCopy.nameLabel}</span>
                <input
                  id="enf-name"
                  type="text"
                  required
                  placeholder={enfDemandeCopy.namePlaceholder}
                  value={request.state.name}
                  onChange={(e) => request.setMeta({ name: e.target.value })}
                />
              </label>
              <label className="enf-field" htmlFor="enf-phone">
                <span>{enfDemandeCopy.phoneLabel}</span>
                <input
                  id="enf-phone"
                  type="tel"
                  required
                  placeholder={enfDemandeCopy.phonePlaceholder}
                  value={request.state.phone}
                  onChange={(e) => request.setMeta({ phone: e.target.value })}
                />
              </label>
            </div>
          </section>

          {error ? (
            <p className="enf-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <aside className="enf-selection" aria-labelledby="enf-selection-title">
          <h2 id="enf-selection-title">{enfDemandeCopy.selectionTitle}</h2>
          <ul>
            {request.itemsWithProduct.map((item) => (
              <li key={item.id}>
                <span className="enf-selection__thumb">
                  <Image src={item.image.src} alt="" width={48} height={48} />
                </span>
                <span>
                  {item.quantity}&nbsp;× {item.title}
                </span>
              </li>
            ))}
          </ul>
          <p className="enf-selection__meta">
            <VhpIcon name="pin" strokeWidth={1.5} /> {request.state.zone || "Cocody"}
          </p>
          {stay ? (
            <p className="enf-selection__meta">
              <VhpIcon name="calendar" strokeWidth={1.5} /> {stay}
            </p>
          ) : null}
          <button type="submit" className="enf-btn enf-btn--yellow enf-btn--block" disabled={pending}>
            {enfDemandeCopy.submit}
            <VhpIcon name="arrowUpRight" />
          </button>
          <p className="enf-selection__note">{enfDemandeCopy.tariffNote}</p>
        </aside>
      </form>

      <section className="enf-why" aria-labelledby="enf-why-title">
        <h2 id="enf-why-title">
          {whyAccentAt >= 0 ? (
            <>
              {whyTitle.slice(0, whyAccentAt)}
              <span className="enf-underline">{whyAccent}</span>
              {whyTitle.slice(whyAccentAt + whyAccent.length)}
            </>
          ) : (
            whyTitle
          )}
        </h2>
        <ul>
          {whyAisles.map((aisle) => (
            <li key={aisle.id}>
              <Link href={enfAislePath(aisle.id)}>
                <Image
                  src={aisle.image.src}
                  alt=""
                  width={aisle.image.width}
                  height={aisle.image.height}
                  sizes="240px"
                  style={{ objectFit: "cover", objectPosition: aisle.image.objectPosition }}
                />
                <strong>{aisle.title}</strong>
                <p>{aisle.lead}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
