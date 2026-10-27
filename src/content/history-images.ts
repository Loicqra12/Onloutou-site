import type { ImageRightsStatus } from "@/content/recognitions";

export type HistoryImageAsset = {
  id: string;
  event: string;
  sourceUrl: string;
  workName: string;
  publicPath?: string;
  width?: number;
  height?: number;
  alt: string;
  rights: ImageRightsStatus;
  decision: string;
  credit?: string;
};

/** Registre des visuels — seuls les chemins `approved` avec `publicPath` sont rendus. */
export const historyImageAssets: HistoryImageAsset[] = [
  {
    id: "equipe-vehicule-site",
    event: "Accompagnement / terrain",
    sourceUrl: "https://comoecapital.com/wp-content/uploads/2021/02/event1.jpg",
    workName: "event1-comoe-capital-original.jpg",
    publicPath: "/assets/images/about/equipe-onloutou-vehicule.png",
    width: 1536,
    height: 1024,
    alt: "Équipe ONLOUTOU devant un véhicule aux couleurs de l’entreprise",
    rights: "approved",
    decision: "Original déjà présent dans le dépôt (`equipe-onloutou-vehicule.png`) — utilisé pour l’accompagnement, à rapprocher de event1.jpg en interne.",
  },
  {
    id: "stand-ietp",
    event: "Présentation stand",
    sourceUrl:
      "https://www.ietp.com/sites/default/files/styles/large/public/imagpub18.jpg?itok=Ij7laCy_",
    workName: "imagpub18-ietp-original.jpg",
    publicPath: "/assets/images/about/stand-exposition-onloutou.png",
    width: 1200,
    height: 800,
    alt: "Présentation d’ONLOUTOU sur un stand professionnel",
    rights: "approved",
    decision: "Archive stand déjà publiée sur le site (`stand-exposition-onloutou.png`) — rapprochement visuel avec imagpub18 à confirmer.",
  },
  {
    id: "fintech-finale",
    event: "Fintech Challenge BCP 2019",
    sourceUrl: "https://media-files.abidjan.net/photo/Photo_Finale%281%29.jpg",
    workName: "fintech-challenge-bcp-2019.jpg",
    alt: "Photo générale de la finale du Fintech Challenge du Groupe BCP en 2019",
    rights: "pending-rights",
    decision: "Ne pas publier — fallback typographique sur la section distinctions.",
  },
  {
    id: "impact-camp",
    event: "Impact Camp 2019",
    sourceUrl:
      "https://static.lematin.ma/files/lematin/images/articles/2019/09/99177ae013fb49807d713377fc8f658a.jpg",
    workName: "impact-camp-inwi-2019.jpg",
    alt: "Participants au programme Impact Camp organisé à Ifrane en 2019",
    rights: "pending-rights",
    decision: "Ne pas publier — fallback typographique.",
  },
  {
    id: "inwidays",
    event: "inwiDAYS 2020",
    sourceUrl: "https://medias24.com/content/uploads/2020/02/Inwidays1.jpg",
    workName: "inwidays-casablanca-2020.jpg",
    alt: "Scène de l’événement inwiDAYS à Casablanca en 2020",
    rights: "pending-rights",
    decision: "Ne pas publier — fallback typographique.",
  },
  {
    id: "ancien-logo-pepites",
    event: "Identité (archive)",
    sourceUrl: "https://d3kqkuy1hpjocx.cloudfront.net/s3fs-public/newlogoonloutou.png",
    workName: "ancien-logo-onloutou-pepites-tech.png",
    alt: "Ancien logo ONLOUTOU archivé",
    rights: "pending-rights",
    decision: "Ne pas publier — confirmation interne requise avant toute section « évolution de l’identité ».",
  },
  {
    id: "archive-camera-2017",
    event: "Location 2017",
    sourceUrl: "https://www.banabaana.com/upload/photos/2017/03/18/18/46/732shdd4d2.jpg",
    workName: "archive-location-camera-2017.jpg",
    alt: "Miniature d’archive — offre de location documentée en 2017",
    rights: "pending-rights",
    decision: "Qualité insuffisante pour hero — réserve documentaire future uniquement.",
  },
];

export function getApprovedHistoryImage(id: string): HistoryImageAsset | undefined {
  const asset = historyImageAssets.find((a) => a.id === id);
  if (!asset || asset.rights !== "approved" || !asset.publicPath || !asset.width || !asset.height) {
    return undefined;
  }
  return asset;
}
