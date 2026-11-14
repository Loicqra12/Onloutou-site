import type { NavIconName } from "./components/NavIcons";

export type NavItem = {
  to: string;
  label: string;
  icon: NavIconName;
  end?: boolean;
  soon?: boolean;
  soonNote?: string;
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

export const ADMIN_NAV: NavSection[] = [
  {
    id: "pilotage",
    label: "Pilotage",
    items: [
      { to: "/", label: "Vue d'ensemble", icon: "home", end: true },
      { to: "/travail", label: "Mon travail", icon: "check" },
      { to: "/rapports", label: "Rapports", icon: "chart" },
    ],
  },
  {
    id: "activite",
    label: "Activité",
    items: [
      { to: "/dossiers", label: "Dossiers de location", icon: "folder" },
      { to: "/livraisons", label: "Livraisons & reprises", icon: "truck", soon: true },
      { to: "/incidents", label: "Incidents & litiges", icon: "alert", soon: true },
    ],
  },
  {
    id: "articles",
    label: "Articles & parc",
    items: [
      { to: "/articles", label: "Tous les articles", icon: "box" },
      { to: "/parc", label: "Parc ONLOUTOU", icon: "park" },
      { to: "/entretien", label: "Entretien & immobilisations", icon: "wrench" },
    ],
  },
  {
    id: "personnes",
    label: "Personnes",
    items: [
      { to: "/clients", label: "Clients & utilisateurs", icon: "people" },
      { to: "/partenaires", label: "Partenaires", icon: "handshake" },
      { to: "/livreurs", label: "Livreurs & transporteurs", icon: "truck" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    items: [
      { to: "/paiements", label: "Paiements & remboursements", icon: "card" },
      { to: "/depots-garantie", label: "Dépôts de garantie", icon: "safe" },
      { to: "/reversements", label: "Reversements partenaires", icon: "cash" },
      { to: "/facturation", label: "Facturation & comptabilité", icon: "invoice" },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    items: [
      { to: "/equipe", label: "Équipe & accès", icon: "team" },
      { to: "/parametres", label: "Paramètres", icon: "settings" },
      { to: "/protection", label: "Protection des données", icon: "shield", soon: true },
      { to: "/journal", label: "Journal d'activité", icon: "log" },
    ],
  },
];

export function findNavItem(pathname: string): NavItem | undefined {
  const all = ADMIN_NAV.flatMap((section) => section.items);
  if (pathname.startsWith("/dossiers/")) return all.find((item) => item.to === "/dossiers");
  if (pathname.startsWith("/articles/")) return all.find((item) => item.to === "/articles");
  if (pathname === "/cautions") return all.find((item) => item.to === "/depots-garantie");
  return all.find((item) => (item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`)));
}
