"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ENF_DEMO_REFERENCE,
  ENF_FAMILY_LABEL,
  ENF_ROOT,
  enfConfirmPhoto,
  enfConfirmationCopy,
  formatEnfStay,
} from "@/content/enfance";
import { enfDemandeWhatsAppMessage } from "@/lib/enfance-request";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useEnfRequest } from "./EnfRequest";

function whatsappUrlForMessage(message: string) {
  return `https://wa.me/2250554137777?text=${encodeURIComponent(message)}`;
}

export function EnfConfirmation() {
  const router = useRouter();
  const request = useEnfRequest();
  const reference = request.state.reference || ENF_DEMO_REFERENCE;
  const stay = formatEnfStay(request.state.startDate, request.state.endDate);

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

  if (!mounted || request.itemsWithProduct.length === 0) {
    return <div className="enf-page enf-page--confirm" aria-busy={!mounted} />;
  }

  const whatsappHref = whatsappUrlForMessage(
    enfDemandeWhatsAppMessage({
      reference,
      items: request.itemsWithProduct.map((item) => ({
        title: item.title,
        quantity: item.quantity,
      })),
      zone: request.state.zone,
      stay,
      delivery: request.state.delivery,
      name: request.state.name,
      phone: request.state.phone,
    }),
  );

  const stayLabel = stay ? stay.replace(/^Du/i, "du") : "À préciser";

  return (
    <div className="enf-page enf-page--confirm">
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
            <span aria-current="page">Confirmation</span>
          </li>
        </ol>
      </nav>

      <div className="enf-confirm-grid">
        <div className="enf-confirm-main">
          <header className="enf-confirm-hero">
            <span className="enf-confirm-badge" aria-hidden>
              <VhpIcon name="check" strokeWidth={1.5} />
            </span>
            <h1 className="enf-h1 enf-h1--demande">{enfConfirmationCopy.title}</h1>
            <p className="enf-confirm-ref">
              {enfConfirmationCopy.referenceLabel}&nbsp;: <strong>{reference}</strong>
            </p>
            <p className="enf-lead">{enfConfirmationCopy.lead}</p>
          </header>

          <article className="enf-confirm-card">
            <h2>{enfConfirmationCopy.cardTitle}</h2>
            <ul className="enf-confirm-items">
              {request.itemsWithProduct.map((item) => (
                <li key={item.id}>
                  <Image src={item.image.src} alt="" width={64} height={64} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>×&nbsp;{item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="enf-confirm-meta">
              <div>
                <dt>
                  <VhpIcon name="pin" strokeWidth={1.5} /> {enfConfirmationCopy.placeLabel}
                </dt>
                <dd>{request.state.zone || "Cocody"}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="calendar" strokeWidth={1.5} /> {enfConfirmationCopy.stayLabel}
                </dt>
                <dd>{stayLabel}</dd>
              </div>
              <div>
                <dt>
                  <VhpIcon name="truck" strokeWidth={1.5} /> {enfConfirmationCopy.deliveryLabel}
                </dt>
                <dd>{request.state.delivery ? enfConfirmationCopy.deliveryYes : "Non"}</dd>
              </div>
            </dl>
          </article>

          <div className="enf-confirm-actions">
            <Link href={ENF_ROOT} className="enf-btn enf-btn--outline">
              {enfConfirmationCopy.back}
            </Link>
            <a href={whatsappHref} className="enf-btn enf-btn--yellow" target="_blank" rel="noreferrer">
              {enfConfirmationCopy.whatsapp}
              <VhpIcon name="arrowUpRight" />
            </a>
          </div>
        </div>

        <figure className="enf-confirm-visual">
          <Image
            src={enfConfirmPhoto.src}
            alt={enfConfirmPhoto.alt}
            fill
            sizes="(max-width: 900px) 100vw, 480px"
            style={{ objectPosition: enfConfirmPhoto.objectPosition }}
            priority
          />
        </figure>
      </div>
    </div>
  );
}
