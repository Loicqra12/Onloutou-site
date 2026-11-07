-- Session store Express (connect-pg-simple), créée au déploiement — pas seulement au premier démarrage de l’API.
CREATE TABLE IF NOT EXISTS "express_session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "express_session_pkey" ON "express_session" ("sid");

CREATE INDEX IF NOT EXISTS "express_session_expire_idx" ON "express_session" ("expire");
