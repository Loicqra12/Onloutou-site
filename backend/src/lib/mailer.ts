import type { Env } from "../config/env.js";
import { mailConfigured } from "../config/env.js";

export type MailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "rejected" | "network" };

type Mail = { to: string; subject: string; text: string; replyTo?: string };

const UNAVAILABLE =
  "L’envoi d’e-mail n’est pas disponible pour le moment. Aucun e-mail n’a été envoyé.";
const FAILED = "L’envoi de l’e-mail a échoué. Aucun e-mail n’a été envoyé.";

export function mailUnavailableMessage(): string {
  return UNAVAILABLE;
}

export function mailFailedMessage(): string {
  return FAILED;
}

/**
 * Envoi via l'API HTTPS de Brevo (pas de SMTP : le SMTP sortant est bloqué sur Render gratuit).
 * Ne lève jamais d'exception : un e-mail raté ne doit jamais faire échouer une demande.
 */
export async function sendMail(env: Env, mail: Mail): Promise<MailResult> {
  if (!mailConfigured(env)) {
    return { ok: false, reason: "not_configured" };
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY!,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.MAIL_FROM_EMAIL, name: env.MAIL_FROM_NAME },
        to: [{ email: mail.to }],
        subject: mail.subject,
        textContent: mail.text,
        ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[mail] Brevo a refusé l'envoi (HTTP ${res.status}).`);
      return { ok: false, reason: "rejected" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mail] Envoi impossible :", err instanceof Error ? err.message : err);
    return { ok: false, reason: "network" };
  }
}

type NotifiableRequest = {
  reference: string;
  type: string;
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  zone: string | null;
  message: string;
};

/** Prévient ONLOUTOU d'une nouvelle demande, et accuse réception au client s'il a laissé un e-mail. */
export async function notifyNewRequest(env: Env, request: NotifiableRequest): Promise<void> {
  if (!mailConfigured(env)) return;

  if (env.NOTIFY_EMAIL) {
    await sendMail(env, {
      to: env.NOTIFY_EMAIL,
      replyTo: request.contactEmail ?? undefined,
      subject: `Nouvelle demande ${request.reference} (${request.type})`,
      text: [
        `Référence : ${request.reference}`,
        `Type : ${request.type}`,
        `Contact : ${request.contactName}`,
        `Téléphone : ${request.contactPhone ?? "non renseigné"}`,
        `E-mail : ${request.contactEmail ?? "non renseigné"}`,
        `Zone : ${request.zone ?? "non renseignée"}`,
        "",
        request.message,
      ].join("\n"),
    });
  }

  if (request.contactEmail) {
    await sendMail(env, {
      to: request.contactEmail,
      subject: `ONLOUTOU — demande ${request.reference} bien reçue`,
      text: [
        `Bonjour ${request.contactName},`,
        "",
        `Nous avons bien enregistré votre demande. Référence : ${request.reference}.`,
        "Conservez-la pour vos échanges avec nous. Elle ne constitue pas une confirmation de réservation.",
        "",
        "L'équipe ONLOUTOU",
      ].join("\n"),
    });
  }
}

export function verificationEmailText(appOrigin: string, token: string): { subject: string; text: string } {
  const url = `${appOrigin}/espace-partenaire/verification?token=${encodeURIComponent(token)}`;
  return {
    subject: "Vérifiez votre adresse e-mail — ONLOUTOU",
    text: [
      "Bonjour,",
      "",
      "Confirmez votre adresse e-mail pour votre compte partenaire ONLOUTOU en ouvrant ce lien\u00a0:",
      url,
      "",
      "Ce lien expire au bout d’une heure. S’il ne fonctionne plus, demandez un nouvel envoi depuis votre espace.",
      "",
      "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
      "",
      "— L’équipe ONLOUTOU",
    ].join("\n"),
  };
}

export function proposalOfferEmailText(input: {
  contactName: string;
  subject: string;
  body: string;
  shareUrl: string;
  reference: string;
}): { subject: string; text: string } {
  return {
    subject: input.subject,
    text: [
      input.body.trim(),
      "",
      `Référence de la proposition : ${input.reference}`,
      `Consulter l’offre : ${input.shareUrl}`,
      "",
      "Cette proposition ne réserve aucun article et ne confirme pas la location.",
      "",
      "— L’équipe ONLOUTOU",
    ].join("\n"),
  };
}

export function passwordResetEmailText(
  origin: string,
  token: string,
  path = "/espace-partenaire/mot-de-passe/nouveau",
): { subject: string; text: string } {
  const url = `${origin}${path}?token=${encodeURIComponent(token)}`;
  return {
    subject: "Réinitialisation du mot de passe — ONLOUTOU",
    text: [
      "Bonjour,",
      "",
      "Pour choisir un nouveau mot de passe, ouvrez ce lien\u00a0:",
      url,
      "",
      "Ce lien expire au bout d’une heure.",
      "",
      "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
      "",
      "— L’équipe ONLOUTOU",
    ].join("\n"),
  };
}
