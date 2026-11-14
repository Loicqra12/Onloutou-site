"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  REC_DEMO_REFERENCE,
  REC_ROOT,
  recConfirmationCopy,
  recDemandeWhatsAppMessage,
  recItemSummary,
  recDiscoverImages,
  recAislePath,
  recSceneMeeting,
} from "@/content/reception";
import { whatsappUrlForMessage } from "@/content/contact-page";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useRecRequest } from "./RecRequest";

export function RecConfirmation() {
  const router = useRouter();
  const request = useRecRequest();
  const reference = request.state.reference || REC_DEMO_REFERENCE;
  const eventLine = [request.state.eventName || "Événement", request.state.guests ? `${request.state.guests} personnes` : ""]
    .filter(Boolean)
    .join(" · ");
  const deliveryLine = request.state.deliveryAt || "À préciser";
  const pickupLine = request.state.pickupAt || "À préciser";

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;
    if (request.itemsWithProduct.length === 0) {
      router.replace(REC_ROOT);
    }
  }, [mounted, request.itemsWithProduct.length, router]);

  const discover = useMemo(
    () =>
      recConfirmationCopy.discover.map((item) => ({
        label: item.label,
        href: recAislePath(item.aisleId),
        image: recDiscoverImages[item.image],
      })),
    [],
  );

  const whatsappHref = whatsappUrlForMessage(
    recDemandeWhatsAppMessage({
      reference,
      items: request.itemsWithProduct.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        detail: recItemSummary(item, item.quantity),
      })),
      zone: request.state.zone,
      eventName: request.state.eventName,
      guests: request.state.guests,
      deliveryAt: deliveryLine,
      pickupAt: pickupLine,
      name: request.state.name,
      phone: request.state.phone,
    }),
  );

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="rec-page rec-page--confirm" aria-busy={!mounted} />;
  }

  
  const title = recConfirmationCopy.title;
  const accent = recConfirmationCopy.titleAccent;
  const accentAt = title.indexOf(accent);
  const discoverTitle = recConfirmationCopy.discoverTitle;
  const discoverAccent = recConfirmationCopy.discoverTitleAccent;
  const discoverAccentAt = discoverTitle.indexOf(discoverAccent);

  return (
    <div className="rec-page rec-page--confirm">
      <div className="rec-confirm-grid">
        <div className="rec-confirm-main">
          <header className="rec-confirm-hero">
            <span className="rec-confirm-badge" aria-hidden>
              <VhpIcon name="check" strokeWidth={1.5} />
            </span>
            <h1 className="rec-h1 rec-h1--demande">
              {accentAt >= 0 ? (
                <>
                  {title.slice(0, accentAt)}
                  <span className="rec-underline">{accent}</span>
                  {title.slice(accentAt + accent.length)}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="rec-lead">{recConfirmationCopy.lead}</p>
          </header>

          <article className="rec-confirm-card">
            <div className="rec-confirm-ref">
              <span>{recConfirmationCopy.referenceLabel}</span>
              <strong>{reference}</strong>
            </div>
            <ul className="rec-confirm-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={64} height={64} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{recItemSummary(item, item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="rec-confirm-meta">
              <div>
                <dt>
                  <VhpIcon name="pin" strokeWidth={1.5} /> {recConfirmationCopy.placeLabel}
                </dt>
                <dd>{request.state.zone || "À préciser"}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {recConfirmationCopy.eventLabel}
                </dt>
                <dd>{eventLine}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="truck" strokeWidth={1.5} /> {recConfirmationCopy.deliveryLabel}
                </dt>
                <dd>{deliveryLine}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {recConfirmationCopy.pickupLabel}
                </dt>
                <dd>{pickupLine}</dd>
              </div>
            </dl>
          </article>
        </div>

        <figure className="rec-confirm-visual">
          <Image
            src={recSceneMeeting.src}
            alt={recSceneMeeting.alt}
            width={recSceneMeeting.width}
            height={recSceneMeeting.height}
            sizes="(max-width : 900px) 100vw, 42vw"
            priority
            style={{ objectPosition: recSceneMeeting.objectPosition }}
          />
        </figure>
      </div>

      <div className="rec-confirm-actions">
        <a href={whatsappHref} className="rec-btn rec-btn--yellow rec-btn--block" target="_blank" rel="noopener noreferrer">
          <VhpIcon name="whatsapp" strokeWidth={1.5} />
          {recConfirmationCopy.whatsapp}
        </a>
        <Link href={REC_ROOT} className="rec-btn rec-btn--ghost rec-btn--block">
          ← {recConfirmationCopy.back}
        </Link>
      </div>

      <ul className="rec-confirm-values">
        {recConfirmationCopy.values.map((item, index) => (
          <li key={item.title}>
            <VhpIcon name={index === 0 ? "truck" : index === 1 ? "gear" : "calendar"} />
            <div>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <section className="rec-discover" aria-labelledby="rec-discover-title">
        <h2 id="rec-discover-title" className="rec-h2">
          {discoverAccentAt >= 0 ? (
            <>
              {discoverTitle.slice(0, discoverAccentAt)}
              <span className="rec-underline">{discoverAccent}</span>
              {discoverTitle.slice(discoverAccentAt + discoverAccent.length)}
            </>
          ) : (
            discoverTitle
          )}
        </h2>
        <ul>
          {discover.map((item: (typeof discover)[number]) => (
            <li key={item.label}>
              <Link href={item.href} className="rec-discover__card">
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

