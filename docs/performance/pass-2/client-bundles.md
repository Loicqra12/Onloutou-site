# Bundles clients — pass 2 (constat build)

Analyse post-`npm run build` — chunks partagés Next.js 16 (ordre de grandeur).

| Chunk / module | Taille (Ko, gzip approx.) | Routes | Cause | Décision |
| --- | ---: | --- | --- | --- |
| Framework `react` + `react-dom` | ~130 | Toutes | Runtime React 19 | Conservé |
| `main-app` / layout shell | ~90–120 | Toutes | `SiteHeader`, `SiteFooter`, `MotionBootstrap`, `ScrollProgress` | Conservé ; motion déjà mutualisé |
| `src/components/navigation/*` | ~40–60 | Toutes (header) | Mégamenu + mobile nav client | Conservé ; prefetch partiel rétabli sur overview |
| `src/components/motion/*` | ~15–25 | Toutes | Reveal observers | Observer partagé (pass 1) |
| `produits` page split | −~30–50 initial (est.) | `/produits` | `dynamic()` sur 3 builders/explorateurs | **Pass 2** — différé |
| Pages formulaires (livraison, aide filtres) | variable | Routes dédiées | `"use client"` formulaires | Hors scope LCP ; pas de refonte |

**Limite :** sans `@next/bundle-analyzer`, les tailles exactes varient selon le hash Turbopack. Une analyse CI dédiée peut être ajoutée plus tard.

**~80 fichiers `"use client"`** : majorité = formulaires, onglets, carrousels. Aucune suppression massive — isolation ciblée sur `/produits`.
