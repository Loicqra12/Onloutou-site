/* Page Contact — contenu de la refonte (textes repris de l’écran Figma).
   Rédigés ici (absents de la maquette) : le gabarit du message WhatsApp, le message d’erreur
   et le libellé masqué des champs obligatoires. */

import { whatsappUrlForMessage } from "@/content/contact-page";
import { site } from "@/content/site";
import type { GlyphName } from "@/components/about/redesign/AbtIcon";

export type CtcNeedId = "location" | "gps" | "actifs" | "numerique" | "partenariat" | "autre";

export const ctcHero = {
  eyebrow: "CONTACT",
  title: "Parlons de votre besoin.",
  lead: "Un équipement à trouver, une flotte à suivre ou un projet à construire : décrivez-nous votre contexte.",
};

export const ctcDirect = {
  title: "Échangeons directement.",
  phone: {
    label: "Téléphone",
    value: site.phoneDisplay,
    tel: `tel:${site.phoneTel}`,
    cta: "Appeler ONLOUTOU",
  },
  whatsapp: {
    label: "WhatsApp",
    text: "Démarrez une conversation avec l’équipe.",
    cta: "Écrire sur WhatsApp",
    href: whatsappUrlForMessage("Bonjour ONLOUTOU, je souhaite vous parler d’un besoin."),
  },
  place: "Abidjan, Côte d’Ivoire",
  help: { question: "Une question fréquente ?", cta: "Consulter le centre d’aide", href: "/aide" },
};

export const ctcClaims = {
  eyebrow: "En cas de problème",
  title: "Signaler un souci",
  lead: "Une demande, un échange ou une page ne convient pas ? Écrivez-nous par le formulaire ou WhatsApp.",
  steps: [
    { title: "Qui vous êtes", text: "Nom et moyen de réponse." },
    { title: "Le sujet", text: "Page, message ou prestation." },
    { title: "Votre attente", text: "Correction, explication ou suite." },
  ],
  after: "N’envoyez jamais de pièce d’identité, de mot de passe ni de coordonnées bancaires.",
  cta: { label: "Écrire depuis le formulaire", href: "#ctc-form-title" },
};

export const ctcNeeds: { id: CtcNeedId; label: string; icon: GlyphName }[] = [
  { id: "location", label: "Location ou achat", icon: "excavator" },
  { id: "gps", label: "GPS & gestion de flotte", icon: "share" },
  { id: "actifs", label: "Sécurisation d’actifs", icon: "lock" },
  { id: "numerique", label: "Projet numérique", icon: "laptop" },
  { id: "partenariat", label: "Partenariat", icon: "users" },
  { id: "autre", label: "Autre demande", icon: "doc" },
];

export const ctcForm = {
  title: "Préparez votre message.",
  needLegend: "Votre besoin",
  name: { label: "Votre nom", placeholder: "Votre nom" },
  phone: { label: "Téléphone (WhatsApp si possible)", placeholder: "07 00 00 00 00" },
  email: { label: "E-mail", placeholder: "Facultatif" },
  organisation: { label: "Organisation", placeholder: "Facultatif" },
  zone: { label: "Zone concernée", placeholder: "Ville ou région" },
  deadline: { label: "Échéance envisagée", placeholder: "À préciser" },
  message: {
    label: "Votre message",
    placeholder: "Votre besoin, les équipements concernés et les contraintes à connaître…",
  },
  requiredNote: "Champs obligatoires",
  submit: "Enregistrer ma demande",
  submitNote:
    "Votre demande est d’abord enregistrée par ONLOUTOU. Vous pourrez ensuite ouvrir WhatsApp si vous le souhaitez.",
  submitWhatsApp: "Continuer sur WhatsApp",
  saving: "Enregistrement…",
  saveError: "L’enregistrement a échoué. Corrigez les champs ou réessayez. Aucune confirmation n’a été émise.",
  saveSuccess: (reference: string) =>
    `Demande enregistrée. Référence : ${reference}. Conservez-la pour vos échanges. Elle ne permet pas d’accéder seule à votre dossier.`,
  /** rédigé : absent de la maquette */
  error: "Merci de renseigner les champs obligatoires.",
  phoneError: "Indiquez un numéro de téléphone valide (au moins 8 chiffres) pour que l’équipe puisse vous répondre.",
  emailError: "Cette adresse e-mail ne semble pas valide.",
};

export type CtcValues = {
  need: CtcNeedId | "";
  familyLabel: string;
  name: string;
  phone: string;
  email: string;
  organisation: string;
  zone: string;
  deadline: string;
  message: string;
};

export const ctcFamilyNote = {
  selected: "Famille sélectionnée",
  free: "Décrivez l’article recherché dans votre message. Aucune famille n’est reprise.",
};

/** rédigé : gabarit du message prérempli (aucun fait ajouté). */
export function buildCtcMessage(values: CtcValues): string {
  const need = ctcNeeds.find((item) => item.id === values.need)?.label ?? "";
  const lines = [
    "Bonjour ONLOUTOU, je souhaite vous écrire au sujet de mon besoin.",
    "",
    `Besoin : ${need}`,
    values.familyLabel.trim() ? `Famille : ${values.familyLabel.trim()}` : "",
    `Nom : ${values.name.trim()}`,
    values.phone.trim() ? `Téléphone : ${values.phone.trim()}` : "",
    values.organisation.trim() ? `Organisation : ${values.organisation.trim()}` : "",
    values.zone.trim() ? `Zone concernée : ${values.zone.trim()}` : "",
    values.deadline.trim() ? `Échéance envisagée : ${values.deadline.trim()}` : "",
    "",
    `Message : ${values.message.trim()}`,
  ].filter((line, index, all) => !(line === "" && (index === 0 || all[index - 1] === "")));
  return lines.join("\n");
}

export function buildCtcWhatsAppUrl(values: CtcValues): string {
  return whatsappUrlForMessage(buildCtcMessage(values));
}

export const ctcPrecisions = {
  title: "Quelques précisions pour faciliter l’échange.",
  items: [
    { number: "1", title: "Votre objectif", text: "Ce que vous souhaitez obtenir." },
    { number: "2", title: "Votre contexte", text: "Lieu, quantité et usages." },
    { number: "3", title: "Vos contraintes", text: "Délais, dimensions ou besoins techniques." },
  ],
};

export const ctcCards: { id: string; icon: GlyphName; title: string; cta: { label: string; href: string } }[] = [
  {
    id: "collaborer",
    icon: "handshake",
    title: "Vous souhaitez collaborer ?",
    cta: { label: "Présenter une proposition", href: "/devenir-partenaire#preparer-proposition" },
  },
  {
    id: "livraisons",
    icon: "truck",
    title: "Vous souhaitez proposer des livraisons ?",
    cta: { label: "Présenter mon profil", href: "/devenir-livreur#candidature-livreur" },
  },
];

export const ctcBand = {
  title: "Besoin d’une réponse avant de nous contacter ?",
  cta: { label: "Explorer le centre d’aide", href: "/aide" },
};