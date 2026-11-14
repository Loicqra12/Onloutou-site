/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteMedia } from "@/content/media";

export function DpMiniFooter() {
  return (
    <footer className="dp-mini-footer">
      <div className="dp-mini-footer__inner">
        <Link href="/" className="dp-mini-footer__brand">
          <img src={siteMedia.logo.src} alt="" width={siteMedia.logo.width} height={siteMedia.logo.height} />
          <span>ONLOUTOU</span>
        </Link>
        <nav className="dp-mini-footer__nav" aria-label="Pied de page">
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/conditions-utilisation">Conditions</Link>
          <Link href="/aide">Aide</Link>
        </nav>
      </div>
    </footer>
  );
}
