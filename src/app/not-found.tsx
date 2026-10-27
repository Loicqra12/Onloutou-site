import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NotFoundMotion } from "@/components/motion/NotFoundMotion";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "La page demandée n’existe pas ou n’est plus disponible. Retournez à l’accueil ONLOUTOU ou contactez-nous pour votre besoin.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Page introuvable | ONLOUTOU",
    description:
      "La page demandée n’existe pas ou n’est plus disponible sur le site ONLOUTOU.",
    type: "website",
    locale: "fr_FR",
    siteName: "ONLOUTOU",
  },
};

export default function NotFound() {
  return (
    <div className="section-spacing">
      <div className="container-content max-w-xl text-center">
        <NotFoundMotion />
        <Reveal>
        <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-muted">
          Erreur 404
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          Cette page n’existe pas ou a été déplacée.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-muted">
          Le lien est peut-être obsolète ou l’adresse contient une erreur. Revenez à l’accueil ou
          poursuivez vers une section utile du site.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/">Retour à l’accueil</Button>
        </div>
        <p className="mt-6 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/solutions" className="link-motion text-brand-ink">
            Découvrir nos solutions
          </Link>
          <Link href="/produits" className="link-motion text-brand-ink">
            Produits
          </Link>
          <Link href="/contact" className="link-motion text-brand-ink">
            Contacter ONLOUTOU
          </Link>
        </p>
        </Reveal>
      </div>
    </div>
  );
}
