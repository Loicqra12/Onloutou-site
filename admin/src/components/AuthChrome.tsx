import type { ReactNode } from "react";
import { LOGO_SRC, SUPPORT_MAIL } from "../brand";
import { IconLock } from "./Icons";

type Props = {
  children: ReactNode;
  heroSrc: string;
  heroAlt: string;
};

export function AuthChrome({ children, heroSrc, heroAlt }: Props) {
  return (
    <div className="ag">
      <header className="ag-top">
        <div className="ag-brand">
          <span className="ag-logo">
            <img src={LOGO_SRC} alt="" width={191} height={82} />
            <span>ONLOUTOU</span>
          </span>
          <span className="ag-brand__rule" aria-hidden="true" />
          <span className="ag-brand__name">ONLOUTOU ADMINISTRATION</span>
        </div>
        <p className="ag-reserved">
          <IconLock />
          Accès réservé à l’équipe
        </p>
      </header>

      <div className="ag-split">
        <aside className="ag-hero">
          <div className="ag-hero__copy">
            <span className="ag-hero__bar" aria-hidden="true" />
            <h1>L’administration de votre activité.</h1>
            <p>Dossiers, articles, partenaires et livraisons : votre équipe au même endroit.</p>
          </div>
          <div className="ag-hero__photo">
            <img src={heroSrc} alt={heroAlt} />
          </div>
        </aside>
        <main className="ag-main">{children}</main>
      </div>

      <footer className="ag-foot">
        <p>ONLOUTOU · Administration</p>
        <a href={SUPPORT_MAIL}>Contacter le support</a>
      </footer>
    </div>
  );
}
