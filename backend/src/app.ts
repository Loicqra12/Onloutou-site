import connectPgSimple from "connect-pg-simple";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { corsOrigins, type Env } from "./config/env.js";
import { prisma } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateSessionUser } from "./middleware/sessionGuard.js";
import { createCsrfProtection } from "./middleware/csrf.js";
import { createAuthRouter } from "./modules/auth/routes.js";
import { createAdminCatalogRouter, createCatalogPublicRouter, createPartnerRouter } from "./modules/catalog/routes.js";
import { createDocumentsRouter } from "./modules/documents/routes.js";
import { createPublicFilesRouter } from "./modules/documents/files.js";
import { createAdminRequestsRouter, createPublicRequestsRouter } from "./modules/requests/routes.js";
import { createDriverRouter } from "./modules/driver/routes.js";
import { createAdminFinanceRouter } from "./modules/admin/finance-routes.js";
import { createAdminFleetRouter } from "./modules/admin/fleet-routes.js";
import { createAdminOpsRouter } from "./modules/admin/ops-routes.js";
import { createPeopleRouter } from "./modules/people/routes.js";
import { openApiDocument } from "./openapi/document.js";

const PgSession = connectPgSimple(session);

export function createApp(env: Env) {
  const app = express();
  if (env.TRUST_PROXY) {
    app.set("trust proxy", env.TRUST_PROXY);
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: corsOrigins(env),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "256kb" }));
  app.use(cookieParser());

  const sessionStore = new PgSession({
    conString: env.DATABASE_URL,
    tableName: "express_session",
    createTableIfMissing: true,
  });

  app.use(
    session({
      name: "onloutou.sid",
      secret: env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.COOKIE_SECURE ?? env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 14,
        ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
      },
    }),
  );

  app.use(validateSessionUser);

  const { csrfTokenHandler, csrfUnlessGet } = createCsrfProtection(env);
  app.use("/api", csrfUnlessGet);

  app.get("/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true, service: "onloutou-api", time: new Date().toISOString() });
    } catch {
      res.status(503).json({ ok: false });
    }
  });

  app.get("/api/v1/csrf", csrfTokenHandler);
  app.use("/api/v1/auth", createAuthRouter(env));
  app.use("/api/v1/requests", createPublicRequestsRouter(env));
  app.use("/api/v1/admin/requests", createAdminRequestsRouter(env));
  app.use("/api/v1/catalog", createCatalogPublicRouter());
  app.use("/api/v1/partner", createPartnerRouter(env));
  app.use("/api/v1/driver", createDriverRouter());
  app.use("/api/v1/admin", createAdminCatalogRouter());
  app.use("/api/v1/admin/people", createPeopleRouter());
  app.use("/api/v1/admin/finances", createAdminFinanceRouter());
  app.use("/api/v1/admin/ops", createAdminOpsRouter());
  app.use("/api/v1/admin/fleet", createAdminFleetRouter());
  app.use("/api/v1/documents", createDocumentsRouter(env));
  app.use("/api/v1/files", createPublicFilesRouter());
  // Documentation de l'API : ouverte en développement, fermée en production sauf ENABLE_API_DOCS=1.
  if (env.NODE_ENV !== "production" || env.ENABLE_API_DOCS) {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
    app.get("/api/openapi.json", (_req, res) => {
      res.json(openApiDocument);
    });
  }

  app.use(errorHandler);
  return app;
}
