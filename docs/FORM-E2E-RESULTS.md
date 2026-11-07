# Vérification E2E formulaires (2026-11-05)

## Environnement

| Composant | Valeur |
|-----------|--------|
| PostgreSQL | `127.0.0.1:5433` (Docker Compose) |
| API Express | port **4000** — `/health` |
| Next.js | port **3000** (`npm run start` + proxy `/api/v1`) |
| Admin E2E | `e2e-admin@onloutou.local` / `E2eAdminPass12345!` (script `backend/scripts/ensure-e2e-admin.ts`) |

Commande : `npm run test:forms:e2e` (build Next, migrate, API + `next start` via Playwright).

## Résultats Playwright (`tests/forms-e2e.spec.ts`)

| Scénario | Desktop | Mobile |
|----------|---------|--------|
| Contact → référence → admin (détail structuré) | OK | OK |
| GPS via `/contact?need=gps` | OK | OK |
| Location brief (`BriefContactSave`) | OK | skip (desktop only) |
| Échec API, champs conservés | OK | OK |
| Inscription livreur → dossier limité | OK | skip (desktop only) |

**8 passed, 2 skipped** (dernière exécution locale).

Captures (succès / admin / échec) : dossier Playwright `test-results/forms-e2e/` (fichiers `contact-success.png`, `admin-detail.png`, `gps-contact-success.png`, `rental-success.png`, `contact-api-failure.png`, `driver-dossier.png` générés par `testInfo.outputPath` lors des runs réussis).

## API intégration

`npm run test:api:integration` — **12/12**, dont `deduplicates and conflicts on clientRequestId` (retry, conflit 409, clé distincte, requêtes concurrentes).

## Idempotence (comportement serveur)

- Même `clientRequestId` + même contenu → **même référence** (201).
- Contenu différent → **409**, pas d’écrasement.
- Violation unique concurrente → relecture + même logique.
- Pas d’endpoint public pour lire un dossier par `clientRequestId` seul.

## Limitations restantes

- Couverture Playwright **représentative**, pas exhaustive (hubs équipements, partenaire, livraison, vente, produits non automatisés ici).
- Mobile : brief location et inscription livreur non rejoués (volontaire).
- WhatsApp non envoyé (pas de clic sur le lien wa.me).
- Upload / antivirus toujours hors production.
- Builders legacy non routés : voir `docs/legacy-forms.md`.
