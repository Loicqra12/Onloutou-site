import { Link, useLocation } from "react-router-dom";
import { findNavItem } from "../nav";

export function ComingSoonPage() {
  const location = useLocation();
  const item = findNavItem(location.pathname);

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Administration / {item?.label ?? "Écran"}</span>
      </div>
      <div className="as-card">
        <h1 className="as-h1">{item?.label ?? "Écran à venir"}</h1>
        <p className="as-lead">Cet écran n’est pas encore ouvert.</p>
        <p className="as-empty" style={{ marginTop: "0.8rem" }}>
          {item?.soonNote ??
            "Il figurera ici dès que le flux correspondant sera branché. En attendant, les dossiers, les articles à vérifier et les candidatures restent disponibles."}
        </p>
        <div className="as-head__actions" style={{ marginTop: "1rem" }}>
          <Link className="as-btn as-btn--yellow" to="/">
            Retour à l’accueil
          </Link>
          <Link className="as-btn" to="/dossiers">
            Voir les dossiers
          </Link>
        </div>
      </div>
    </div>
  );
}
