import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Env } from "../../config/env.js";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

let client: S3Client | null = null;

function getClient(env: Env): S3Client {
  if (!client) {
    client = new S3Client({
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT,
      forcePathStyle: env.S3_FORCE_PATH_STYLE ?? true,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID!,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export function validateImageUpload(mimeType: string, byteSize: number, maxBytes: number) {
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return { ok: false as const, error: "Type de fichier non autorisé (JPEG, PNG, WebP)." };
  }
  if (byteSize <= 0 || byteSize > maxBytes) {
    return { ok: false as const, error: `Taille maximale : ${Math.round(maxBytes / 1024 / 1024)} Mo.` };
  }
  return { ok: true as const };
}

export async function putPublicObject(env: Env, key: string, body: Buffer, contentType: string) {
  const s3 = getClient(env);
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_PUBLIC!,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
    }),
  );
}

export async function putPrivateObject(env: Env, key: string, body: Buffer, contentType: string) {
  const s3 = getClient(env);
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_PRIVATE!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function signedPrivateUrl(env: Env, key: string, expiresInSeconds = 300) {
  const s3 = getClient(env);
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_PRIVATE!,
      Key: key,
    }),
    { expiresIn: expiresInSeconds },
  );
}
