# Site institutionnel ONLOUTOU

Application Next.js (App Router) pour le site public ONLOUTOU.

## Stack

- Next.js 16, React 19, TypeScript strict
- Tailwind CSS 4
- Contenus dans `src/content/`

## Lancement local

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

Mode production local :

```bash
npm run build
npm run start
```

## Variables d’environnement

Copier `.env.example` vers `.env.local` lorsque le domaine de production sera validé :

```text
NEXT_PUBLIC_SITE_URL=
```

Cette variable servira plus tard aux URL canoniques et au sitemap. **Le sitemap (`sitemap.ts`) n’est pas activé tant que `NEXT_PUBLIC_SITE_URL` n’est pas renseignée**, pour éviter toute URL fictive ou `localhost` en production.

## Référence statique

Le dossier `dist/` conserve l’ancien site HTML/CSS/JS (référence, non servi par Next.js).

## Vérifications

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Captures de référence : `docs/captures/`.
