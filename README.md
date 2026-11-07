# Site institutionnel ONLOUTOU

Application Next.js (App Router) pour le site public, avec une API métier Express et PostgreSQL.

## Arborescence

| Dossier | Rôle |
|---------|------|
| `src/` | Site et interfaces Next.js (pages, composants, contenus) |
| `backend/` | API Express, logique métier, Prisma, migrations |
| `public/` | Fichiers statiques servis par Next |
| `tests/` | Tests Playwright du frontend et parcours E2E |
| `docs/` | Documentation (captures, performance, backend…) |
| `scripts/` | Scripts de maintenance du site (audits, inventaires) |
| `dist/` | **Référence** de l’ancien site HTML/CSS/JS — non servi par Next |

Les dossiers générés (`node_modules`, `.next`, `backend/dist`, rapports Playwright) ne doivent pas être versionnés.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- API : Node 22, Express, Prisma, PostgreSQL 16

## Démarrage local (site seul)

```bash
npm install
npm run dev
```

Ouvrir **http://localhost:3000** (port frontend par défaut).

Variables : copier `.env.example` → `.env.local` (`API_ORIGIN=http://127.0.0.1:4000`, `NEXT_PUBLIC_API_BASE=/api/v1`).

## Démarrage avec API et base

Voir **`docs/backend/README.md`**.

| Service | Port / URL |
|---------|------------|
| PostgreSQL (Docker, hôte Windows) | `127.0.0.1:5433` |
| API Express | **4000** — http://127.0.0.1:4000/health |
| Next.js (dev / start) | **3000** — http://localhost:3000 |
| Proxy API depuis Next | `/api/v1` → `API_ORIGIN` |

Stack rapide (PostgreSQL + migrations + API) :

```bash
npm run dev:stack
```

Dans un second terminal : `npm run dev` pour le site si besoin.

Tests formulaires (Playwright + API) :

```bash
npm run test:forms:e2e
```

## Production locale Next

```bash
npm run build
npm run start
```

## Vérifications frontend

```bash
npm run typecheck
npm run lint
npm run build
```

Captures : `docs/captures/`.
