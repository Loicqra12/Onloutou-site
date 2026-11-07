# Backend ONLOUTOU (Express + PostgreSQL)

## Versions figées (novembre 2026)

| Composant | Version |
|-----------|---------|
| Node.js | 22 LTS |
| Express | 4.21.x |
| TypeScript | 5.9.x |
| Prisma | 6.19.x |
| PostgreSQL | 16 |

## PostgreSQL local (Windows)

Le port **5432** est souvent déjà pris par une autre instance PostgreSQL (service Windows ou autre projet). **Ne la modifiez pas.**

ONLOUTOU utilise Docker Compose avec le mapping **`127.0.0.1:5433` → `5432`** dans le conteneur `postgres`. Les connexions depuis Windows pointent donc vers **`127.0.0.1:5433`**. Entre conteneurs sur le réseau Compose, le service reste **`postgres:5432`**.

## Fichiers d’environnement

| Fichier | Lu par | Contenu |
|---------|--------|---------|
| `.env.local` (racine) | Next.js | `NEXT_PUBLIC_*`, `API_ORIGIN` (proxy) |
| `backend/.env` | API Express | `DATABASE_URL`, secrets, S3, `APP_ORIGIN` |

`backend/.env` ne remplace **jamais** une variable déjà définie dans le shell (tests d’intégration inclus).

## Démarrage depuis la racine

```powershell
# Docker Desktop doit être démarré (icône baleine active)
docker compose up -d postgres
copy backend\.env.example backend\.env
# Éditer backend\.env (SESSION_SECRET, CSRF_SECRET uniques)

npm install
npm run db:migrate
npm run bootstrap:admin -- admin@example.ci "Admin ONLOUTOU"
# Mot de passe : saisie masquée (ou ADMIN_BOOTSTRAP_PASSWORD dans backend/.env pour CI)

npm run dev:api
npm run dev
```

- Site : http://localhost:3000  
- API directe : http://localhost:4000/health  
- OpenAPI : http://localhost:3000/api/docs  

Le proxy Next utilise `API_ORIGIN` (défaut `http://127.0.0.1:4000`). Sous Docker, pointez vers le service API (`http://api:4000`).

## Documents privés et liens signés

Voir **`DOCUMENTS-STORAGE.md`** (durée des URLs, statut `CLEAN`, pas d’usage unique côté S3).

## Tests

```powershell
npm run test:api
npm run test:api:integration
```

Les tests d’intégration **refusent** toute base dont le nom n’est pas `onloutou_integration` ou `onloutou_test`.

```powershell
docker compose up -d postgres
docker compose exec postgres psql -U onloutou -d onloutou -c "CREATE DATABASE onloutou_integration;"
$env:DATABASE_URL="postgresql://onloutou:onloutou_dev@127.0.0.1:5433/onloutou_integration"
npm run test:api:integration
```

Si `dockerDesktopLinuxEngine` est introuvable : lancer **Docker Desktop** manuellement, attendre qu’il soit prêt, puis relancer `docker compose up -d postgres`.
