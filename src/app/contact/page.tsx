import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { ContactChoiceCard } from "@/components/ui/ContactChoiceCard";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { PageHero } from "@/components/ui/PageHero";
import { PreparationChecklist } from "@/components/ui/PreparationChecklist";
import {
  contactChoices,
  contactHero,
  contactPrudenceNotice,
  contactSeo,
  preparationChecklist,
  whatsappUrlForMessage,
} from "@/content/contact-page";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = createPageMetadata({ ...contactSeo, path: "/contact" });

export default function ContactPage() {
  const generalWhatsapp = whatsappUrlForMessage(
    "Bonjour ONLOUTOU, je souhaite vous parler d’un besoin.",
  );

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
        title={
          <>
            Parlons de{" "}
            <HighlightedText tone="on-dark">votre besoin</HighlightedText>
          </>
        }
        description={contactHero.description}
        primaryCta={{ label: "Écrire sur WhatsApp", href: generalWhatsapp }}
        secondaryCta={{ label: "Appeler ONLOUTOU", href: `tel:${site.phoneTel}` }}
      />

      <section className="section-spacing" aria-labelledby="contact-coordinates">
        <div className="container-content max-w-2xl">
          <h2 id="contact-coordinates" className="font-display text-2xl font-extrabold">
            Coordonnées
          </h2>
          <p className="mt-3 text-sm text-brand-muted">
            Utilisez les moyens de contact publics ci-dessous. Aucun formulaire en ligne n’est
            proposé tant qu’un service d’envoi n’est pas configuré.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/aide" className="font-semibold link-motion">Consulter le centre d’aide</Link>
            {" "}
            pour les questions fréquentes avant de nous écrire.
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-extrabold uppercase tracking-wide text-[10px] text-brand-muted">
                Téléphone
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="text-lg font-bold text-brand-ink underline-offset-4 hover:text-brand-yellow hover:underline"
                >
                  {site.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-extrabold uppercase tracking-wide text-[10px] text-brand-muted">
                WhatsApp
              </dt>
              <dd className="mt-1">
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-ink underline-offset-4 hover:text-brand-yellow hover:underline"
                >
                  Discuter sur WhatsApp ({site.phoneDisplay})
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section-spacing bg-brand-paper" aria-labelledby="contact-choices">
        <div className="container-content">
          <h2 id="contact-choices" className="font-display text-3xl font-extrabold tracking-tight">
            Choix du besoin
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-brand-muted">
            Sélectionnez le type de demande pour ouvrir WhatsApp avec un message prérempli que vous
            pourrez ajuster avant envoi.
          </p>
          <StaggerReveal itemAs="article" className="mt-8 grid gap-4 sm:grid-cols-2">
            {contactChoices.map((choice) => (
              <ContactChoiceCard
                key={choice.id}
                title={choice.title}
                description={choice.description}
                whatsappMessage={choice.whatsappMessage}
              />
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="section-spacing" aria-labelledby="contact-prepare">
        <div className="container-content max-w-3xl">
          <h2 id="contact-prepare" className="font-display text-2xl font-extrabold">
            Préparer son échange
          </h2>
          <p className="mt-3 text-sm text-brand-muted">
            Pour accélérer l’étude de votre besoin, vous pouvez rassembler les éléments suivants
            avant de nous écrire ou nous appeler.
          </p>
          <div className="mt-6">
            <PreparationChecklist items={preparationChecklist} />
          </div>
          <div className="mt-8">
            <EditorialNotice>{contactPrudenceNotice}</EditorialNotice>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-brand-charcoal text-brand-white">
        <div className="container-content flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href={generalWhatsapp} variant="primary" className="w-full sm:w-auto">
            Écrire sur WhatsApp
          </Button>
          <Button
            href={`tel:${site.phoneTel}`}
            variant="outline"
            className="w-full border-white/40 text-white hover:border-white hover:bg-white/10 sm:w-auto"
          >
            Appeler ONLOUTOU
          </Button>
        </div>
      </section>
    </>
  );
}
