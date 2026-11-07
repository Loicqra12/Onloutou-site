# Déploiement du site sur LWS (export statique)

Le site est exporté en HTML statique ; le backend est hébergé ailleurs (Render ou DigitalOcean).

## Construire

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://onloutou.com"          # ou https://www.onloutou.com, un seul
$env:NEXT_PUBLIC_API_BASE = "https://api.onloutou.com/api/v1" # URL absolue du backend
npm run build:lws
```

Résultat : dossier `lws-deploy/` (~170 Mo, images en WebP). Les variables sont lues au build : il faut reconstruire pour les changer.
Le build n'utilise pas `.next`, il est donc sans risque pendant `npm run dev`.

## Téléverser

cPanel > Gestionnaire de fichiers > `public_html` : vider la page « coming soon », envoyer le contenu de `lws-deploy/` (zippé, puis extrait). Vérifier que `.htaccess` (fichier caché) est bien présent.

## Backend (Render / DigitalOcean)

- `APP_ORIGIN` = l'URL exacte du site (`https://onloutou.com`) : CORS n'autorise que cette origine.
- Les cookies de session et CSRF sont en `SameSite=Lax`. Ils ne passent pas entre `onloutou.com` et `xxx.onrender.com` (sites différents). Solution : mettre le backend sur un sous-domaine `api.onloutou.com` (CNAME vers Render/DO). Sans cela, les espaces admin / livreur / partenaire ne fonctionneront pas ; les formulaires de contact avec WhatsApp en repli restent utilisables.
- `COOKIE_SECURE=1` (HTTPS).

## Limites de l'export statique

Pas de rewrites, redirections ni en-têtes Next : tout passe par `.htaccess`. Les anciens originaux PNG non référencés sont retirés ; Apache sert alors leur version WebP à la même URL.


## Backend sur Render (provisoire)

Fichiers : `render.yaml` (blueprint) et `backend/Dockerfile` (contexte = racine du dépôt, build vérifié en local).

1. Pousser le dépôt sur GitHub, puis Render > New > Blueprint > choisir le dépôt. Render crée l'API et la base Postgres.
2. Renseigner dans le tableau de bord les variables `S3_*` (DigitalOcean Spaces conseillé, voir ci-dessous).
3. Ajouter le domaine personnalisé `api.onloutou.com` au service, puis le CNAME indiqué chez LWS (zone DNS).
4. Créer l'administrateur : shell Render, `npm run bootstrap:admin -w @onloutou/backend`.
5. Construire le site avec `NEXT_PUBLIC_SITE_URL=https://www.onloutou.com` et `NEXT_PUBLIC_API_BASE=https://api.onloutou.com/api/v1`.

Le site (`www.onloutou.com`) et l'API (`api.onloutou.com`) sont du même site pour le navigateur : les cookies `SameSite=Lax` passent. Ne pas définir `COOKIE_DOMAIN` (le cookie CSRF `__Host-` l'interdit).

## Passer ensuite sur DigitalOcean

C'est la même image Docker, donc simple : App Platform (ou Droplet) avec le même Dockerfile (`backend/Dockerfile`, contexte racine) et les mêmes variables d'environnement. Étapes : créer une base Postgres gérée DO, y restaurer les données (`pg_dump` depuis Render puis `pg_restore`), changer `DATABASE_URL`, puis déplacer le CNAME `api` vers DO. Le site n'est pas touché (même URL d'API). Garder les fichiers sur Spaces dès le départ : rien à migrer.