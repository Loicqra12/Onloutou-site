import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { storageConfigured } from "../../config/env.js";
import { v2 as cloudinary } from "cloudinary";
import type { Env } from "../../config/env.js";

export type DetectedMime = "image/jpeg" | "image/png" | "image/webp" | "application/pdf";

const IMAGE_TYPES: ReadonlySet<string> = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES: ReadonlySet<string> = new Set([...IMAGE_TYPES, "application/pdf"]);

const EXTENSION: Record<DetectedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Détecte le vrai type d'un fichier d'après ses premiers octets (le type déclaré par le client n'est pas fiable). */
export function sniffMime(buffer: Buffer): DetectedMime | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  return null;
}

type UploadCheck = { ok: true; mime: DetectedMime } | { ok: false; error: string };

function checkUpload(
  allowed: ReadonlySet<string>,
  label: string,
  declaredMime: string,
  buffer: Buffer,
  maxBytes: number,
): UploadCheck {
  if (buffer.length <= 0 || buffer.length > maxBytes) {
    return { ok: false, error: `Taille maximale : ${Math.round(maxBytes / 1024 / 1024)} Mo.` };
  }
  const real = sniffMime(buffer);
  if (!real || !allowed.has(real) || !allowed.has(declaredMime)) {
    return { ok: false, error: `Type de fichier non autorisé (${label}).` };
  }
  return { ok: true, mime: real };
}

export function validateImageUpload(declaredMime: string, buffer: Buffer, maxBytes: number): UploadCheck {
  return checkUpload(IMAGE_TYPES, "JPEG, PNG, WebP", declaredMime, buffer, maxBytes);
}

export function validateDocumentUpload(declaredMime: string, buffer: Buffer, maxBytes: number): UploadCheck {
  return checkUpload(DOCUMENT_TYPES, "PDF, JPEG, PNG, WebP", declaredMime, buffer, maxBytes);
}

let configured = false;

function configure(env: Env) {
  if (configured) return;
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; type: "upload" | "authenticated"; format?: string },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        type: options.type,
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        ...(options.format ? { format: options.format } : {}),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Téléversement Cloudinary échoué."));
          return;
        }
        resolve(result.public_id);
      },
    );
    stream.end(buffer);
  });
}

export const LOCAL_KEY_PREFIX = "local:";

export function localUploadsDir(): string {
  return resolve(process.env.LOCAL_UPLOADS_DIR || resolve(process.cwd(), "uploads"));
}

export function isLocalStorageKey(key: string): boolean {
  return key.startsWith(LOCAL_KEY_PREFIX);
}

function safeRelativePath(rel: string): string | null {
  const cleaned = rel.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!cleaned || cleaned.includes("..") || cleaned.startsWith("/") || cleaned.includes("\\")) return null;
  if (!/^[A-Za-z0-9._\/-]+$/.test(cleaned)) return null;
  return cleaned;
}

export function localFilePathFromKey(storageKey: string): string | null {
  if (!storageKey.startsWith(LOCAL_KEY_PREFIX)) return null;
  const rel = safeRelativePath(storageKey.slice(LOCAL_KEY_PREFIX.length));
  if (!rel) return null;
  const root = localUploadsDir();
  const dest = resolve(root, rel);
  const destNorm = dest.replace(/\\/g, "/");
  const rootNorm = root.replace(/\\/g, "/");
  if (destNorm !== rootNorm && !destNorm.startsWith(rootNorm + "/")) return null;
  return dest;
}

async function putLocalImage(folder: string, buffer: Buffer, mime: DetectedMime): Promise<string> {
  const ext = EXTENSION[mime];
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  const rel = safeRelativePath(`${folder.replace(/\\/g, "/")}/${name}`);
  if (!rel) throw new Error("Chemin de stockage invalide.");
  const dest = localFilePathFromKey(`${LOCAL_KEY_PREFIX}${rel}`);
  if (!dest) throw new Error("Chemin de stockage invalide.");
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buffer);
  return `${LOCAL_KEY_PREFIX}${rel}`;
}

/** Photo publique de fiche produit. Retourne le `public_id` Cloudinary ou une clé locale de dev. */
export async function putPublicImage(env: Env, folder: string, buffer: Buffer): Promise<string> {
  if (!storageConfigured(env)) {
    if (env.NODE_ENV === "production") {
      throw new Error("Stockage fichiers non configuré.");
    }
    const mime = sniffMime(buffer);
    if (!mime || mime === "application/pdf") {
      throw new Error("Type d'image invalide.");
    }
    return putLocalImage(folder, buffer, mime);
  }
  configure(env);
  return uploadBuffer(buffer, { folder, type: "upload" });
}

/**
 * Pièce confidentielle (type « authenticated » : aucune URL publique n'existe).
 * Ce n'est PAS un antivirus : le fichier reste en statut PENDING et n'est lisible que par l'administration.
 */
export async function putPrivateDocument(
  env: Env,
  folder: string,
  buffer: Buffer,
  mime: DetectedMime,
): Promise<string> {
  configure(env);
  return uploadBuffer(buffer, { folder, type: "authenticated", format: EXTENSION[mime] });
}

/** URL de téléchargement à durée limitée pour une pièce confidentielle. */
export function signedPrivateUrl(env: Env, publicId: string, mime: string, expiresInSeconds = 120): string {
  configure(env);
  const format = EXTENSION[mime as DetectedMime] ?? "pdf";
  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: "image",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}

/** URL publique d'une photo de fiche produit (Cloudinary ou fichier local de dev). */
export function publicImageUrl(storageKey: string, cloudName = process.env.CLOUDINARY_CLOUD_NAME): string | null {
  if (storageKey.startsWith(LOCAL_KEY_PREFIX)) {
    const rel = safeRelativePath(storageKey.slice(LOCAL_KEY_PREFIX.length));
    if (!rel) return null;
    return `/api/v1/files/${rel}`;
  }
  if (storageKey.startsWith("/assets/")) return encodeURI(storageKey);
  if (!cloudName) return null;
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1200/${storageKey}`;
}
