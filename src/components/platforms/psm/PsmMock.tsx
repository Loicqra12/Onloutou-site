import Image from "next/image";
import { siteMedia } from "@/content/media";
import { PsmIcon, type PsmIconName } from "./PsmIcon";

/* Maquettes d’interface construites en HTML/CSS (exemples illustratifs, données fictives). */

type SideItem = { icon: PsmIconName; label: string; active?: boolean };
type Row = { icon: PsmIconName; title: string; text: string; chip?: string; chipTone?: "yellow" | "green" | "blue" | "orange" };

type MockSpec = {
  eyebrow?: string;
  title: string;
  cta: string;
  side: SideItem[];
  rows: Row[];
};

function MockBrand() {
  return (
    <div className="psm-mock-brand">
      <Image src={siteMedia.logo.src} alt="" width={46} height={20} sizes="46px" />
      <span>
        <b>ON</b>LOUTOU
      </span>
    </div>
  );
}

const specs: Record<string, MockSpec> = {
  ops: {
    eyebrow: "Exemple illustratif · Opérations",
    title: "Suivre les opérations",
    cta: "Nouvelle demande",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "list", label: "Demandes", active: true },
      { icon: "wrench", label: "Interventions" },
      { icon: "file", label: "Documents" },
    ],
    rows: [
      { icon: "clipboard", title: "Demandes", text: "Qualifier et assigner", chip: "À qualifier", chipTone: "yellow" },
      { icon: "wrench", title: "Interventions", text: "Planifier et suivre", chip: "En préparation", chipTone: "blue" },
      { icon: "list", title: "Priorités", text: "Ordonner l’activité", chip: "À valider", chipTone: "green" },
      { icon: "chart", title: "Rapports", text: "Consulter l’état d’avancement" },
    ],
  },
  partner: {
    eyebrow: "Exemple illustratif · Partenaire",
    title: "Collaborer avec ONLOUTOU",
    cta: "Nouveau document",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "list", label: "Demandes", active: true },
      { icon: "file", label: "Documents" },
      { icon: "message", label: "Échanges" },
    ],
    rows: [
      { icon: "list", title: "Demandes", text: "Déposer et suivre", chip: "En cours", chipTone: "blue" },
      { icon: "file", title: "Documents", text: "Échanger des pièces", chip: "À compléter", chipTone: "orange" },
      { icon: "check", title: "Suivi", text: "Consulter les statuts" },
      { icon: "message", title: "Communication", text: "Échanger avec l’équipe" },
    ],
  },
  field: {
    eyebrow: "Exemple illustratif · Terrain ou livraison",
    title: "Mes missions",
    cta: "Voir le détail",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "truck", label: "Missions", active: true },
      { icon: "pin", label: "Statuts" },
      { icon: "file", label: "Documents" },
    ],
    rows: [
      { icon: "truck", title: "Mission", text: "Consulter les consignes", chip: "À préparer", chipTone: "yellow" },
      { icon: "check", title: "Statut", text: "Mettre à jour sur place" },
      { icon: "pin", title: "Informations utiles", text: "Adresse et contact" },
      { icon: "clipboard", title: "Remontée", text: "Confirmer la réalisation", chip: "À valider", chipTone: "green" },
    ],
  },
  partenaire: {
    eyebrow: "Exemple illustratif · Espace partenaire",
    title: "Espace partenaire",
    cta: "Nouvelle demande",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "list", label: "Demandes", active: true },
      { icon: "file", label: "Documents" },
      { icon: "chart", label: "Activités" },
    ],
    rows: [
      { icon: "list", title: "Demandes", text: "Suivre chaque échange", chip: "En cours", chipTone: "blue" },
      { icon: "file", title: "Documents", text: "Partager les pièces utiles", chip: "À compléter", chipTone: "orange" },
      { icon: "chart", title: "Suivi des activités", text: "Consulter l’avancement" },
      { icon: "message", title: "Échanges", text: "Selon le périmètre défini" },
    ],
  },
  livreur: {
    eyebrow: "Exemple illustratif · Espace livreur",
    title: "Missions du jour",
    cta: "Démarrer",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "truck", label: "Missions", active: true },
      { icon: "pin", label: "Itinéraire" },
      { icon: "clipboard", label: "Preuves" },
    ],
    rows: [
      { icon: "truck", title: "Mission 1", text: "Livraison centre-ville", chip: "À préparer", chipTone: "yellow" },
      { icon: "truck", title: "Mission 2", text: "Retrait de matériel", chip: "En cours", chipTone: "blue" },
      { icon: "check", title: "Statuts", text: "Mettre à jour la mission" },
      { icon: "clipboard", title: "Preuves", text: "Remontées selon le projet" },
    ],
  },
  portail: {
    eyebrow: "Exemple illustratif · Portail client",
    title: "Mes demandes",
    cta: "Nouvelle demande",
    side: [
      { icon: "home", label: "Vue d’ensemble" },
      { icon: "list", label: "Demandes", active: true },
      { icon: "file", label: "Documents" },
      { icon: "calendar", label: "Historique" },
    ],
    rows: [
      { icon: "list", title: "Demandes", text: "Déposer et suivre", chip: "En préparation", chipTone: "blue" },
      { icon: "chart", title: "Suivi", text: "Statuts et avancement" },
      { icon: "calendar", title: "Historique", text: "Retrouver les échanges passés" },
      { icon: "file", title: "Documents", text: "Accéder aux ressources", chip: "À valider", chipTone: "green" },
    ],
  },
};

export type PsmMockKey = keyof typeof specs;

export function PsmWindowMock({ variant, label }: { variant: PsmMockKey; label: string }) {
  const spec = specs[variant];
  return (
    <div className="psm-mock psm-mock--window" role="img" aria-label={label}>
      <div className="psm-mock-side" aria-hidden="true">
        <MockBrand />
        <ul>
          {spec.side.map((item) => (
            <li key={item.label} className={item.active ? "is-active" : undefined}>
              <PsmIcon name={item.icon} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="psm-mock-main" aria-hidden="true">
        <div className="psm-mock-head">
          <div>
            {spec.eyebrow ? <p className="psm-mock-eyebrow">{spec.eyebrow}</p> : null}
            <p className="psm-mock-title">{spec.title}</p>
          </div>
          <span className="psm-mock-cta">
            {spec.cta} <PsmIcon name="plus" strokeWidth={2.2} />
          </span>
        </div>
        <ul className="psm-mock-rows">
          {spec.rows.map((row) => (
            <li key={row.title}>
              <PsmIcon name={row.icon} className="psm-mock-row-icon" />
              <span className="psm-mock-row-text">
                <b>{row.title}</b>
                <small>{row.text}</small>
              </span>
              {row.chip ? <span className={`psm-chip psm-chip--${row.chipTone ?? "yellow"}`}>{row.chip}</span> : null}
              <PsmIcon name="chevronRight" className="psm-mock-row-chevron" strokeWidth={2.2} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PsmPhoneMock({ label }: { label: string }) {
  const cards = [
    { title: "Contrôle d’équipement", text: "Vérification périodique", chip: "À préparer", tone: "yellow" },
    { title: "Intervention terrain", text: "Maintenance sur site", chip: "En cours", tone: "blue" },
    { title: "Livraison groupe électrogène", text: "Chantier centre-ville", chip: "À valider", tone: "green" },
  ];
  return (
    <div className="psm-phone-stage" role="img" aria-label={label}>
      <div className="psm-phone" aria-hidden="true">
        <div className="psm-phone-notch" />
        <div className="psm-phone-bar">
          <PsmIcon name="list" />
          <MockBrand />
          <PsmIcon name="bell" />
        </div>
        <p className="psm-phone-title">Mes interventions</p>
        <ul>
          {cards.map((c) => (
            <li key={c.title}>
              <b>{c.title}</b>
              <small>{c.text}</small>
              <span className={`psm-chip psm-chip--${c.tone}`}>{c.chip}</span>
            </li>
          ))}
        </ul>
        <span className="psm-phone-cta">
          Voir le détail <PsmIcon name="arrowRight" strokeWidth={2.2} />
        </span>
      </div>
    </div>
  );
}
