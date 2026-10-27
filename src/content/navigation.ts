import { headerNavigation } from "@/content/header-navigation";
import type { HeaderNavItem, MegaMenuColumn } from "@/types/services";

export const headerNav: HeaderNavItem[] = headerNavigation.map((item) =>
  item.type === "link"
    ? { type: "link" as const, href: item.href, label: item.label }
    : item.id === "solutions"
      ? { type: "solutions" as const, label: item.label }
      : { type: "link" as const, href: item.href, label: item.label },
);

const solutionsItem = headerNavigation.find((item) => item.type === "menu" && item.id === "solutions");

export const solutionsMegaMenu: MegaMenuColumn[] =
  solutionsItem && solutionsItem.type === "menu"
    ? solutionsItem.menu.groups.map((group) => ({
        id: group.id as MegaMenuColumn["id"],
        title: group.title,
        tagline: group.description ?? "",
        icon: "",
        primaryHref: group.href ?? "/solutions",
        links: group.items.flatMap((entry) =>
          entry.type === "link" ? [{ label: entry.label, href: entry.href }] : [],
        ),
      }))
    : [];

export const footerNavLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/equipements", label: "Équipements" },
  { href: "/produits", label: "Produits" },
  { href: "/expertise", label: "Expertise" },
  { href: "/projets", label: "Projets" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/a-propos", label: "À propos" },
  { href: "/aide", label: "Centre d’aide" },
  { href: "/contact", label: "Contact" },
];

export const footerSolutionLinks = [
  { href: "/solutions/location", label: "Location d’équipements" },
  { href: "/solutions/vente", label: "Vente d’équipements" },
  { href: "/solutions/geolocalisation", label: "Géolocalisation" },
  { href: "/solutions/gestion-de-flotte", label: "Gestion de flotte" },
  { href: "/solutions/securisation-actifs", label: "Sécurisation d’actifs" },
  { href: "/solutions/plateformes-sur-mesure", label: "Plateformes sur mesure" },
  { href: "/projets", label: "Projets et appels d’offres" },
] as const;

export const footerCompanyLinks = [
  { href: "/expertise", label: "Expertise" },
  { href: "/equipements", label: "Équipements" },
  { href: "/produits", label: "Produits" },
  { href: "/livraison", label: "Livraison" },
  { href: "/devenir-livreur", label: "Devenir livreur" },
  { href: "/espace-livreur", label: "Espace livreur" },
  { href: "/projets", label: "Projets" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/espace-partenaire", label: "Espace partenaire" },
  { href: "/a-propos", label: "À propos" },
  { href: "/aide", label: "Centre d’aide" },
  { href: "/contact", label: "Contact" },
] as const;
