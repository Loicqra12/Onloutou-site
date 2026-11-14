import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(32),
  // Nombre de proxys de confiance entre Internet et l'API (0 = aucun ; "true" = 1 par compatibilité).
  // Ne jamais faire confiance à plus de sauts que l'infrastructure n'en ajoute réellement.
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === "" || v === "0" || v === "false") return 0;
      if (v === "true") return 1;
      const n = Number(v);
      return Number.isInteger(n) && n >= 0 && n <= 5 ? n : 0;
    }),
  APP_ORIGIN: z.string().url().default("http://localhost:3000"),
  /** Origine de l’app admin séparée (Vite). Vide = CORS site public seulement. */
  ADMIN_ORIGIN: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.string().url().optional(),
  ),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : v === "1" || v === "true")),
  COOKIE_DOMAIN: z.string().optional(),
  // Cloudinary : photos publiques (type "upload") et pièces confidentielles (type "authenticated").
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // Brevo (API HTTPS, pas SMTP : Render bloque le SMTP sortant sur le plan gratuit).
  BREVO_API_KEY: z.string().optional(),
  MAIL_FROM_EMAIL: z.string().email().optional(),
  MAIL_FROM_NAME: z.string().default("ONLOUTOU"),
  // Adresse interne qui reçoit un e-mail à chaque nouvelle demande.
  NOTIFY_EMAIL: z.string().email().optional(),
  // Documentation Swagger : fermée en production sauf demande explicite.
  ENABLE_API_DOCS: z
    .string()
    .optional()
    .transform((v) => v === "1" || v === "true"),
  FILE_MAX_BYTES: z.coerce.number().int().positive().default(5_242_880),
  ENABLE_DEV_SEED: z
    .string()
    .optional()
    .transform((v) => v === "1" || v === "true"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`Configuration invalide:\n${lines.join("\n")}`);
  }
  return parsed.data;
}

export function corsOrigins(env: Env): string[] {
  const origins = [env.APP_ORIGIN];
  if (env.ADMIN_ORIGIN && env.ADMIN_ORIGIN !== env.APP_ORIGIN) {
    origins.push(env.ADMIN_ORIGIN);
  }
  return origins;
}

export function storageConfigured(env: Env): boolean {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

export function mailConfigured(env: Env): boolean {
  return Boolean(env.BREVO_API_KEY && env.MAIL_FROM_EMAIL);
}
