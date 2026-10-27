import type { PlatformTypeId } from "@/content/custom-platforms-page";
import { illustrationDisclaimer } from "@/content/custom-platforms-page";

const mockRows: Record<PlatformTypeId, string[]> = {
  web: ["Vue opérations", "Recherche", "Statut disponible", "Document"],
  mobile: ["Mission terrain", "Action requise", "Mise à jour", "Confirmation"],
  dashboard: ["Synthèse", "Filtre actif", "Élément à traiter", "Rapport"],
  partenaire: ["Demande", "Document", "Suivi", "Message"],
  livreur: ["Mission", "Statut disponible", "Remontée", "Preuve"],
  portail: ["Demande client", "Historique", "Document", "Suivi"],
};

const mockSidebar: Record<PlatformTypeId, string[]> = {
  web: ["Vue d’ensemble", "Demandes", "Opérations", "Documents", "Paramètres"],
  mobile: ["Missions", "Carte", "Remontées", "Profil"],
  dashboard: ["Synthèse", "Filtres", "Rapports", "Alertes"],
  partenaire: ["Accueil", "Demandes", "Documents", "Échanges"],
  livreur: ["Missions", "Statuts", "Preuves", "Compte"],
  portail: ["Demandes", "Suivi", "Documents", "Historique"],
};

export function PlatformTypeMock({ typeId, title }: { typeId: PlatformTypeId; title: string }) {
  const rows = mockRows[typeId];
  const sidebar = mockSidebar[typeId];

  return (
    <div className="platform-preview" aria-label={`Interface illustrative — ${title}`}>
      <div className="platform-mock">
        <div className="platform-mock__chrome">
          <span className="platform-mock__dot" aria-hidden />
          <span className="platform-mock__brand">ONLOUTOU</span>
          <span className="platform-mock__search">Rechercher une demande</span>
        </div>
        <div className="platform-mock__body">
          <aside className="platform-mock__nav" aria-hidden>
            {sidebar.map((item, index) => (
              <span key={item} className={index === 0 ? "is-active" : undefined}>
                {item}
              </span>
            ))}
          </aside>
          <div className="platform-mock__main">
            <p className="platform-mock__heading">{title}</p>
            <ul className="platform-mock__rows">
              {rows.map((row) => (
                <li key={row}>
                  <span>{row}</span>
                  <span className="platform-mock__pill">Statut disponible</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="platform-mock__disclaimer">{illustrationDisclaimer}</p>
      </div>
      <div className="platform-preview__phone" aria-hidden>
        <div className="platform-preview__phone-bar">
          <span className="platform-mock__dot" />
          <span>ONLOUTOU</span>
        </div>
        <p className="platform-preview__phone-title">{rows[0]}</p>
        <ul>
          {rows.slice(1, 3).map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
