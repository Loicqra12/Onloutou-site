"use client";

import { useEffect, useMemo, useState, type FormEvent, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MOB_CONFIRMATION_PATH,
  MOB_DEMO_REFERENCE,
  MOB_FAMILY_LABEL,
  MOB_ROOT,
  mobAislePath,
  mobDemandeCopy,
  mobPlaces,
  mobRecapSummary,
  mobSceneMeeting,
  mobWhyImages,
} from "@/content/mobilier";
import { useCatalogFamilySubmit } from "@/lib/forms/serviceRequest";
import { mobRequestMessage } from "@/lib/mobilier-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useMobRequest } from "./MobRequest";

function AccentTitle({ title, accent, className }: { title: string; accent: string; className?: string }) {
  const accentAt = title.indexOf(accent);
  if (accentAt < 0) return <h1 className={className}>{title}</h1>;
  return (
    <h1 className={className}>
      {title.slice(0, accentAt)}
      <span className="mob-underline">{accent}</span>
      {title.slice(accentAt + accent.length)}
    </h1>
  );
}

export function MobDemande() {
  const router = useRouter();
  const request = useMobRequest();
  const submitCatalog = useCatalogFamilySubmit(MOB_DEMO_REFERENCE);
  const recap = mobRecapSummary(
    request.itemsWithProduct.map((item) => ({ id: item.id, quantity: item.quantity, title: item.title })),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const why = useMemo(
    () =>
      mobDemandeCopy.why.map((item) => ({
        ...item,
        image: mobWhyImages[item.image],
      })),
    [],
  );

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;
    if (request.itemsWithProduct.length === 0) {
      router.replace(MOB_ROOT);
    }
  }, [mounted, request.itemsWithProduct.length, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!request.state.name.trim() || !request.state.phone.trim()) {
      setError("Indiquez votre nom et votre téléphone pour envoyer la demande.");
      return;
    }
    if (request.itemsWithProduct.length === 0) {
      setError("Ajoutez au moins un appareil à votre demande.");
      return;
    }
    setPending(true);
    setError(null);

    try {
      const result = await submitCatalog({
        source: "mobilier-demande",
        type: "RENTAL",
        contactName: request.state.name.trim(),
        contactPhone: request.state.phone.trim(),
        contactEmail: request.state.email.trim() || undefined,
        zone: request.state.zone.trim() || undefined,
        message: mobRequestMessage(request.state),
        sourcePath: MOB_CONFIRMATION_PATH,
        payload: {
          familyLabel: MOB_FAMILY_LABEL,
          items: request.itemsWithProduct.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
          })),
          startDate: request.state.startDate,
          endDate: request.state.endDate,
          dates: request.state.dates,
          usage: request.state.usage,
          delivery: request.state.delivery,
          installation: request.state.installation,
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      request.setMeta({
        reference: result.reference,
        dates:
          request.state.startDate && request.state.endDate
            ? `${request.state.startDate} – ${request.state.endDate}`
            : request.state.dates,
      });
      router.push(MOB_CONFIRMATION_PATH);
    } finally {
      setPending(false);
    }
  };

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="mob-page mob-page--demande" aria-busy={!mounted} />;
  }

  const whyTitle = mobDemandeCopy.whyTitle;
  const whyAccent = mobDemandeCopy.whyTitleAccent;
  const whyAccentAt = whyTitle.indexOf(whyAccent);

  return (
    <div className="mob-page mob-page--demande">
      <header className="mob-demande-hero">
        <AccentTitle title={mobDemandeCopy.title} accent={mobDemandeCopy.titleAccent} className="mob-h1 mob-h1--demande" />
        <p className="mob-lead">{mobDemandeCopy.lead}</p>
      </header>

      <div className="mob-demande-grid">
        <form className="mob-demande-form" onSubmit={onSubmit} noValidate>
          <section className="mob-card" aria-labelledby="mob-items-title">
            <h2 id="mob-items-title">{mobDemandeCopy.itemsTitle}</h2>
            <ul className="mob-demande-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={72} height={72} className="mob-demande-items__thumb" />
                  <div>
                    <strong>{item.title}</strong>
                    <div className="mob-qty" role="group" aria-label={`Quantité pour ${item.title}`}>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity - 1)} aria-label="Diminuer">
                        <VhpIcon name="minus" strokeWidth={1.5} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => request.setQuantity(item.id, item.quantity + 1)} aria-label="Augmenter">
                        <VhpIcon name="plus" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  <button type="button" className="mob-icon-btn" onClick={() => request.remove(item.id)} aria-label={`Retirer ${item.title}`}>
                    <VhpIcon name="trash" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href={MOB_ROOT} className="mob-btn mob-btn--ghost mob-btn--small">
              <VhpIcon name="plus" strokeWidth={1.5} />
              {mobDemandeCopy.addDevice}
            </Link>
          </section>

          <section className="mob-card mob-card--grid2">
            <label>
              <span>{mobDemandeCopy.placeLabel}</span>
              <span className="mob-field--icon mob-field--select">
                <VhpIcon name="pin" strokeWidth={1.5} className="mob-search__icon" />
                <select value={request.state.zone} onChange={(event) => request.setMeta({ zone: event.target.value })} required>
                  <option value="">Choisir</option>
                  {mobPlaces.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              <VhpIcon name="chevronDown" className="mob-field__caret" strokeWidth={1.8} /></span>
            </label>
            <label>
              <span>{mobDemandeCopy.startLabel}</span>
              <span className="mob-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="mob-search__icon" />
                <input
                  type="date"
                  value={request.state.startDate}
                  onChange={(event) => request.setMeta({ startDate: event.target.value })}
                />
              </span>
            </label>
            <label>
              <span>{mobDemandeCopy.endLabel}</span>
              <span className="mob-field--icon">
                <VhpIcon name="calendar" strokeWidth={1.5} className="mob-search__icon" />
                <input type="date" value={request.state.endDate} onChange={(event) => request.setMeta({ endDate: event.target.value })} />
              </span>
            </label>
          </section>

          <section className="mob-card">
            <label>
              <span>{mobDemandeCopy.usageLabel}</span>
              <textarea
                rows={4}
                value={request.state.usage}
                onChange={(event) => request.setMeta({ usage: event.target.value })}
                placeholder={mobDemandeCopy.usagePlaceholder}
              />
            </label>
            <div className="mob-attach" role="group" aria-label={mobDemandeCopy.attachLabel}>
              <VhpIcon name="file" strokeWidth={1.5} />
              <div>
                <strong>{mobDemandeCopy.attachLabel}</strong>
                <p>{mobDemandeCopy.attachHint}</p>
              </div>
            </div>
          </section>

          <section className="mob-card" aria-labelledby="mob-services-title">
            <h2 id="mob-services-title">{mobDemandeCopy.servicesTitle}</h2>
            <ul className="mob-checks">
              {mobDemandeCopy.services.map((service) => {
                const checked =
                  service.id === "delivery"
                    ? request.state.delivery
                    : service.id === "installation"
                      ? request.state.installation
                      : false;
                return (
                  <li key={service.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          if (service.id === "delivery") request.setMeta({ delivery: event.target.checked });
                          else if (service.id === "installation") request.setMeta({ installation: event.target.checked });
                        }}
                      />
                      <span>{service.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <label className="mob-field">
            <span>{mobDemandeCopy.accessLabel}</span>
            <input
              type="text"
              value={request.state.access}
              onChange={(event) => request.setMeta({ access: event.target.value })}
              placeholder={mobDemandeCopy.accessPlaceholder}
            />
          </label>
          <section className="mob-card mob-card--grid2" aria-labelledby="mob-contact-title">
            <h2 id="mob-contact-title">{mobDemandeCopy.contactTitle}</h2>
            <label>
              <span>{mobDemandeCopy.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                value={request.state.name}
                onChange={(event) => request.setMeta({ name: event.target.value })}
                required
              />
            </label>
            <label>
              <span>{mobDemandeCopy.phoneLabel}</span>
              <input
                type="tel"
                autoComplete="tel"
                value={request.state.phone}
                onChange={(event) => request.setMeta({ phone: event.target.value })}
                required
              />
            </label>
            <label className="mob-span-2">
              <span>{mobDemandeCopy.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                value={request.state.email}
                onChange={(event) => request.setMeta({ email: event.target.value })}
              />
            </label>
          </section>

          {error ? (
            <p className="mob-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mob-demande-actions">
            <button type="submit" className="mob-btn mob-btn--yellow mob-btn--block" disabled={pending}>
              {pending ? "Envoi…" : mobDemandeCopy.submit}
              <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
            </button>
            <Link href={mobAislePath(request.itemsWithProduct[0].aisleId)} className="mob-btn mob-btn--ghost mob-btn--block">
              <VhpIcon name="notePen" strokeWidth={1.5} />
              {mobDemandeCopy.edit}
            </Link>
          </div>
        </form>

        <aside className="mob-recap" aria-labelledby="mob-recap-title">
          <h2 id="mob-recap-title">{mobDemandeCopy.recapTitle}</h2>
          <p className="mob-recap__headline">{recap.headline}</p>
          <p className="mob-recap__counts">{recap.counts}</p>
          <ul>
            {request.itemsWithProduct.map((item) => (
              <li key={item.id}>
                <Image src={item.image.src} alt="" width={56} height={56} />
                <span>
                  {item.title}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <VhpIcon name="calendar" strokeWidth={1.5} />
            <span>
              <strong>{mobDemandeCopy.periodLabel}</strong>
              {(request.state.startDate && request.state.endDate
                ? `${request.state.startDate} – ${request.state.endDate}`
                : request.state.dates) || "À préciser"}
            </span>
          </p>
          <p>
            <VhpIcon name="pin" strokeWidth={1.5} />
            <span>
              <strong>{mobDemandeCopy.placeRecapLabel}</strong>
              {request.state.zone || "À préciser"}
            </span>
          </p>
          <p className="mob-recap__note">
            <VhpIcon name="file" strokeWidth={1.5} />
            <span>
              
              {mobDemandeCopy.tariffNote}
            </span>
          </p>
          <figure className="mob-recap__visual">
            <Image
              src={mobSceneMeeting.src}
              alt={mobSceneMeeting.alt}
              width={mobSceneMeeting.width}
              height={mobSceneMeeting.height}
              sizes="320px"
              style={{ objectPosition: mobSceneMeeting.objectPosition }}
            />
          </figure>
        </aside>
      </div>

      <section className="mob-why" aria-labelledby="mob-why-title">
        <h2 id="mob-why-title">
          {whyAccentAt >= 0 ? (
            <>
              {whyTitle.slice(0, whyAccentAt)}
              <span className="mob-underline">{whyAccent}</span>
              {whyTitle.slice(whyAccentAt + whyAccent.length)}
            </>
          ) : (
            whyTitle
          )}
        </h2>
        <ul>
          {why.map((item: (typeof why)[number]) => (
            <li key={item.id}>
              <Link href={mobAislePath(item.aisleId)}>
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