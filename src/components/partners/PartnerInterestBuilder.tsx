"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PartnerInterestBuilder() {
  return (
    <section
      id="preparer-proposition"
      className="partners-interest section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="partners-interest-title"
    >
      <div className="container-content partners-interest__inner">
        <h2 id="partners-interest-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Présenter ma proposition
        </h2>
        <p className="partners-interest__lead">
          Utilisez le parcours dédié pour préparer une proposition structurée et l’envoyer volontairement sur WhatsApp — aucun document confidentiel ne doit être transmis à ce stade.
        </p>
        <div className="partners-interest__actions">
          <Button href="/devenir-partenaire" variant="primary">Présenter ma proposition</Button>
          <Link href="/contact" className="partners-interest__contact link-motion">Continuer sur la page contact</Link>
        </div>
        <p className="partners-interest__legal">
          L’envoi d’un message ne constitue pas une validation ou un engagement d’ONLOUTOU.
        </p>
      </div>
    </section>
  );
}
