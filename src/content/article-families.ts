import type { NavIconId } from "@/types/navigation";

export type ArticleFamilyId =
  | "electromenager"
  | "informatique"
  | "mobilier"
  | "reception"
  | "bebe";

export type ArticleFamily = {
  id: ArticleFamilyId;
  label: string;
  hint: string;
  iconId: NavIconId;
};

/** Familles du quotidien. Chaque famille catalogue ouvre son hub ; les autres, le formulaire Contact. */
export const articleFamilies: ArticleFamily[] = [
  {
    id: "electromenager",
    label: "Électroménager",
    hint: "Frigos, congélateurs",
    iconId: "fridge",
  },
  {
    id: "informatique",
    label: "Informatique & téléphonie",
    hint: "Ordinateurs, téléphones",
    iconId: "laptop",
  },
  {
    id: "mobilier",
    label: "Mobilier & décoration",
    hint: "Bureaux, luminaires",
    iconId: "sofa",
  },
  {
    id: "reception",
    label: "Réception & événementiel",
    hint: "Assiettes, bâches, chaises",
    iconId: "cloche",
  },
  {
    id: "bebe",
    label: "Bébé & enfance",
    hint: "Poussettes, lits bébé",
    iconId: "stroller",
  },
];

export const articleFamilyHint = "Choisissez une famille pour faire une demande.";

export const otherArticleHref = "/contact?need=autre&article=libre#ctc-form-title";

export function articleFamilyHref(id: ArticleFamilyId) {
  if (id === "electromenager") return "/articles/electromenager";
  if (id === "informatique") return "/articles/informatique";
  if (id === "mobilier") return "/articles/mobilier";
  if (id === "reception") return "/articles/reception";
  if (id === "bebe") return "/articles/enfance";
  return `/contact?need=location&famille=${id}#ctc-form-title`;
}

export function articleFamilyFromSlug(slug: string | null): ArticleFamily | undefined {
  if (!slug) return undefined;
  return articleFamilies.find((item) => item.id === slug);
}
