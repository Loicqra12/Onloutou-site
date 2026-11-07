export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "ONLOUTOU API",
    version: "0.1.0",
    description:
      "API métier ONLOUTOU (demandes, comptes, administration, catalogue partenaire). Les parcours réservation, livraison, paiement et GPS ne sont pas actifs dans cette version.",
  },
  servers: [{ url: "/api/v1", description: "Version 1 (proxifiée depuis Next en local)" }],
  tags: [
    { name: "auth" },
    { name: "requests" },
    { name: "admin" },
    { name: "partner" },
    { name: "catalog" },
    { name: "documents" },
  ],
  paths: {
    "/csrf": { get: { tags: ["auth"], summary: "Obtenir un jeton CSRF" } },
    "/auth/login": { post: { tags: ["auth"], summary: "Connexion" } },
    "/auth/logout": { post: { tags: ["auth"], summary: "Déconnexion" } },
    "/auth/me": { get: { tags: ["auth"], summary: "Session courante" } },
    "/auth/register/partner": { post: { tags: ["auth"], summary: "Inscription partenaire" } },
    "/auth/register/driver": { post: { tags: ["auth"], summary: "Inscription livreur" } },
    "/requests": { post: { tags: ["requests"], summary: "Enregistrer une demande (sans exposer le dossier par référence seule)" } },
    "/admin/requests": { get: { tags: ["admin"], summary: "Lister les demandes" } },
    "/catalog/products": { get: { tags: ["catalog"], summary: "Catalogue public approuvé" } },
    "/partner/products": { get: { tags: ["partner"], summary: "Mes fiches" }, post: { tags: ["partner"], summary: "Créer une fiche brouillon" } },
  },
} as const;
