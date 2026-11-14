"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MOB_DEMO_REFERENCE,
  MOB_ROOT,
  mobConfirmationCopy,
  mobDemandeWhatsAppMessage,
  mobDiscoverImages,
  mobAislePath,
  mobSceneMeeting,
} from "@/content/mobilier";
import { whatsappUrlForMessage } from "@/content/contact-page";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useMobRequest } from "./MobRequest";

export function MobConfirmation() {
  const router = useRouter();
  const request = useMobRequest();
  const reference = request.state.reference || MOB_DEMO_REFERENCE;

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

  const discover = useMemo(
    () =>
      mobConfirmationCopy.discover.map((item) => ({
        label: item.label,
        href: mobAislePath(item.aisleId),
        image: mobDiscoverImages[item.image],
      })),
    [],
  );

  const whatsappHref = whatsappUrlForMessage(
    mobDemandeWhatsAppMessage({
      reference,
      items: request.itemsWithProduct.map((item) => ({ title: item.title, quantity: item.quantity })),
      zone: request.state.zone,
      startDate: request.state.startDate,
      endDate: request.state.endDate || request.state.dates,
      delivery: request.state.delivery,
      name: request.state.name,
      phone: request.state.phone,
    }),
  );

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="mob-page mob-page--confirm" aria-busy={!mounted} />;
  }

  const period =
    request.state.startDate && request.state.endDate
      ? `Du ${formatFrDate(request.state.startDate)} au ${formatFrDate(request.state.endDate)}`
      : request.state.dates || "À préciser";

  const title = mobConfirmationCopy.title;
  const accent = mobConfirmationCopy.titleAccent;
  const accentAt = title.indexOf(accent);
  const discoverTitle = mobConfirmationCopy.discoverTitle;
  const discoverAccent = mobConfirmationCopy.discoverTitleAccent;
  const discoverAccentAt = discoverTitle.indexOf(discoverAccent);

  return (
    <div className="mob-page mob-page--confirm">
      <div className="mob-confirm-grid">
        <div className="mob-confirm-main">
          <header className="mob-confirm-hero">
            <span className="mob-confirm-badge" aria-hidden>
              <VhpIcon name="check" strokeWidth={1.5} />
            </span>
            <h1 className="mob-h1 mob-h1--demande">
              {accentAt >= 0 ? (
                <>
                  {title.slice(0, accentAt)}
                  <span className="mob-underline">{accent}</span>
                  {title.slice(accentAt + accent.length)}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="mob-lead">{mobConfirmationCopy.lead}</p>
          </header>

          <article className="mob-confirm-card">
            <div className="mob-confirm-ref">
              <span>{mobConfirmationCopy.referenceLabel}</span>
              <strong>{reference}</strong>
            </div>
            <ul className="mob-confirm-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={64} height={64} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>Quantité : {item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mob-confirm-meta">
              <div>
                <dt>
                  <VhpIcon name="pin" strokeWidth={1.5} /> {mobConfirmationCopy.placeLabel}
                </dt>
                <dd>{request.state.zone || "À préciser"}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {mobConfirmationCopy.periodLabel}
                </dt>
                <dd>{period}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="truck" strokeWidth={1.5} /> {mobConfirmationCopy.deliveryLabel}
                </dt>
                <dd>{request.state.delivery ? mobConfirmationCopy.deliveryYes : mobConfirmationCopy.deliveryNo}</dd>
              </div>
            </dl>
          </article>
        </div>

        <figure className="mob-confirm-visual">
          <Image
            src={mobSceneMeeting.src}
            alt={mobSceneMeeting.alt}
            width={mobSceneMeeting.width}
            height={mobSceneMeeting.height}
            sizes="(max-width : 900px) 100vw, 42vw"
            priority
            style={{ objectPosition: mobSceneMeeting.objectPosition }}
          />
        </figure>
      </div>

      <div className="mob-confirm-actions">
        <a href={whatsappHref} className="mob-btn mob-btn--yellow mob-btn--block" target="_blank" rel="noopener noreferrer">
          <VhpIcon name="whatsapp" strokeWidth={1.5} />
          {mobConfirmationCopy.whatsapp}
        </a>
        <Link href={MOB_ROOT} className="mob-btn mob-btn--ghost mob-btn--block">
          ← {mobConfirmationCopy.back}
        </Link>
      </div>

      <ul className="mob-confirm-values">
        {mobConfirmationCopy.values.map((item, index) => (
          <li key={item.title}>
            <VhpIcon name={index === 0 ? "truck" : index === 1 ? "gear" : "calendar"} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <section className="mob-discover" aria-labelledby="mob-discover-title">
        <h2 id="mob-discover-title" className="mob-h2">
          {discoverAccentAt >= 0 ? (
            <>
              {discoverTitle.slice(0, discoverAccentAt)}
              <span className="mob-underline">{discoverAccent}</span>
              {discoverTitle.slice(discoverAccentAt + discoverAccent.length)}
            </>
          ) : (
            discoverTitle
          )}
        </h2>
        <ul>
          {discover.map((item: (typeof discover)[number]) => (
            <li key={item.label}>
              <Link href={item.href} className="mob-discover__card">
                <Image
                  src={item.image.src}
                  alt=""
                  width={item.image.width}
                  height={item.image.height}
                  sizes="25vw"
                  style={{ objectPosition: item.image.objectPosition }}
                />
                <span>
                  {item.label}
                  <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function formatFrDate(value: string) {
  const date = new Date(`${value}T12 :00 :00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}