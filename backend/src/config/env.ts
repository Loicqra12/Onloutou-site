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
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : v === "1" || v === "true")),
  COOKIE_DOMAIN: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET_PUBLIC: z.string().optional(),
  S3_BUCKET_PRIVATE: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z
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

export function s3Configured(env: Env): boolean {
  return Boolean(
    env.S3_ENDPOINT &&
      env.S3_BUCKET_PUBLIC &&
      env.S3_BUCKET_PRIVATE &&
      env.S3_ACCESS_KEY_ID &&
      env.S3_SECRET_ACCESS_KEY,
  );
}
