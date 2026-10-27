# Audit performance — ONLOUTOU

Date : 2026-10-20

> **Note (2026-10-20, post-mesures)** : trois routes Solutions redondantes ont été retirées de l’application (`location-equipements`, `vente-equipements`, `geolocalisation-gestion-flotte`). Les scores Lighthouse archivés dans `pass-2/` ont été mesurés sur **36** routes ; ne pas les recalculer comme s’ils couvraient **33** routes sans nouvelle campagne.

## Mode de rendu et hébergement

| Élément | Constat |
| --- | --- |
| Build local | `npm run build` → pages **statiques** (○ Static, App Router) |
| Serveur de mesure | `npm run start` (Next.js 16.4.1) — **pas** `next dev` pour les scores |
| `next.config.ts` | Pas de `output: "export"` ; optimiseur `next/image` actif en `next start` |
| `.openai/hosting.json` | Cible statique `dist` — **à confirmer** côté pipeline ; si export statique pur, l’optimiseur d’images Next doit être remplacé ou servi via CDN |
| Polices | `next/font` (Manrope 600–800, DM Sans 400–700), `display: swap` |
| Middleware | Aucun |

**Hypothèse :** les mesures ci-dessous reflètent un déploiement **Node / `next start`** ou équivalent avec optimiseur d’images. Les fichiers lourds dans `public/` restent des PNG sources ; le transfert Lighthouse inclut les variantes servies par Next.

## Méthode de mesure

- **Outil :** Lighthouse **12.8.2**, Chrome headless (CLI `npx lighthouse`)
- **Throttling :** profil mobile / desktop Lighthouse (simulation)
- **Baseline :** 3 exécutions médianes (routes partiellement complètes avant agrégation finale — voir `baseline/summary.md`)
- **Après correctifs :** 1 exécution par route/profil (comparaison indicative ; médiane 3 runs recommandée avant production)
- **Environnement :** poste local Windows, `http://127.0.0.1:3000`
- **INP / CrUX :** non mesurés — nécessitent trafic réel après déploiement sur domaine public

Les mesures locales **ne remplacent pas** les Core Web Vitals terrain.

## Routes mesurées

1. `/` — accueil (hero photo LCP mobile)
2. `/solutions`
3. `/solutions/plateformes-sur-mesure` — solution la plus riche (builders + dashboards)
4. `/equipements/vehicules`
5. `/produits`
6. `/aide` — forte surface client (centre d’aide, filtres, recherche)

## Tableau Lighthouse avant / après (extraits clés)

Médiane baseline (3 runs) vs après (1 run) — **ne pas confondre avec médiane après**.

| Route | Profil | Perf avant | Perf après | LCP avant (ms) | LCP après (ms) | CLS avant | CLS après | TBT avant (ms) | TBT après (ms) | Ko avant | Ko après |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| / | mobile | 87 | 88 | 3788 | 3343 | 0 | 0 | 114 | 121 | 811 | 652 |
| / | desktop | 99 | 100 | 781 | 709 | 0 | 0 | 0 | 0 | 959 | 711 |
| /solutions | mobile | 94 | 96 | 3055 | 2731 | 0 | 0 | 70 | 50 | 494 | 405 |
| /solutions/plateformes-sur-mesure | mobile | 88 | 92 | 3561 | 2935 | 0 | 0 | 169 | 128 | 538 | 445 |
| /equipements/vehicules | mobile | 89 | 89 | 3356 | 3252 | 0 | 0 | 133 | 101 | 720 | 624 |
| /produits | mobile | — | 85 | — | 4058 | — | 0 | — | 115 | — | 529 |
| /aide | mobile | — | 95 | — | 2948 | — | 0 | — | 54 | — | 430 |

Rapports bruts : `docs/performance/baseline/raw/`, `docs/performance/after/raw/`.

## LCP par route (élément identifié)

| Route | LCP typique (mobile lab) | Élément |
| --- | --- | --- |
| `/` | Photo hero `main#contenu-principal > section#accueil > div.home-hero-photo > img` (priorité + `fetchPriority=high`) |
| `/solutions`, sous-pages | Titres / visuels hero (`next/image`, sizes définis) |
| `/produits` | Hero produits + médias cartes |
| `/aide` | Hero texte + layout aide |
| `/equipements/vehicules` | Hero véhicules |

**Cause LCP accueil (avant) :** animation `clip-path` sur `.home-hero-photo` (délai 560 ms + masque) retardant la peinture malgré `priority`.

## Images

- **41 fichiers ≥ 400 Ko** dans `public/` (voir `assets-inventory.md`) — photos terrain, menus, projets.
- **Décision :** conserver les sources ; compression agressive refusée (lisibilité dashboards / texte fin).
- **next/image** déjà utilisé sur la majorité des héros ; SVG animés laissés en `<img>` natif si nécessaire.
- Pas de conversion PNG → WebP en masse sans validation visuelle (hors scope outil sans nouvelle dépendance).

## Client Components

~80 fichiers `"use client"` — majorité justifiée (formulaires, onglets, carrousels, mégamenu, centre d’aide). Modules motion globaux : `MotionBootstrap`, `Reveal`, `ScrollProgress`, `HeroEntrance` (texte hero uniquement côté client).

**Actions :** pas de bascule serveur massive (risque sur interactions) ; réduction du coût runtime via observers partagés et prefetch mégamenu.

## Correctifs appliqués

| Domaine | Correction | Gain mesuré (indicatif) |
| --- | --- | --- |
| LCP accueil | Suppression animation masque hero ; `opacity: 1` sur `.hero-seq` ; `fetchPriority="high"` | LCP mobile `/` : 3788 → 3343 ms (−445 ms, 1 run) |
| JS / observers | `IntersectionObserver` partagé dans `observeReveal.ts` | Moins d’instances par section Reveal |
| Navigation | `prefetch={false}` sur liens mégamenu | Moins de préchargements au survol / ouverture |
| CSS | `content-visibility: auto` sur `.site-footer` | Rendu différé hors écran (à valider visuellement) |
| Tooling | Scripts audit + tests budgets | CI déterministe |

## Polices

Inchangées (identité validée). `swap` conservé. Pas de graisse supprimée sans preuve de gain.

## CLS

**0** sur les routes mesurées (lab). Dimensions présentes sur image hero ; pas de correction artificielle.

## Cache

- **Local `next start` :** chunks versionnés par hash Next ; assets `public/` sans hash — cache long à configurer au **CDN / hébergeur** (`dist` statique si export).
- Headers `Cache-Control` immuables **non** appliqués dans le dépôt (dépend de l’hébergeur).

## Budgets

`docs/performance/budgets.json` — seuils assets publics, routes critiques, patterns interdits (`docs/captures`, `.webm`).

## Commandes

```bash
npm run audit:assets
npm run build && npm run start
npm run audit:performance baseline   # ou after
npm run audit:performance:summarize baseline
npm run test:performance
```

## Objectifs Core Web Vitals (laboratoire)

| Indicateur | Cible | État après correctifs |
| --- | ---: | --- |
| LCP mobile | ≤ 2500 ms | **Non atteint** sur `/`, `/produits`, `/equipements/vehicules` (≈ 3,2–4,1 s) |
| CLS | ≤ 0,10 | **Atteint** (0) |
| TBT mobile | ≤ 200 ms | **Atteint** sur échantillon |
| Perf mobile ≥ 90 | idéal | Partiel (`/produits` 85) |

**Formulation :** les objectifs Core Web Vitals **ne sont pas tous atteints en laboratoire local** ; le principal levier restant est le poids / décodage des images hero et le chemin d’hébergement (CDN, formats modernes, éventuel export statique).

## Limites

- Pas de données CrUX / INP réel.
- After = 1 run (variance possible ± quelques points).
- Optimisation PNG/WebP bulk reportée (qualité + pas de dépendance ajoutée).
- Hosting `dist` vs `next start` à aligner avant production.

## Passe 2 (2026-10-20)

Documentation : `docs/performance/pass-2/`. Médiane **3 runs** baseline vs after (`next start`, Lighthouse 12.8.2).

| Route | Profil | Perf avant | Perf après | LCP avant | LCP après | CLS avant | CLS après | TBT avant | TBT après | Ko avant | Ko après |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| / | mobile | 77 | 76 | 4304 | 4065 | 0 | 0 | 233 | 209 | 812 | 832 |
| / | desktop | 99 | 99 | 826 | 823 | 0 | 0 | 0 | 0 | 960 | 980 |
| /solutions | mobile | 91 | 88 | 3317 | 3162 | 0 | 0 | 67 | 237 | 496 | 496 |
| /solutions | desktop | 100 | 100 | 667 | 698 | 0 | 0 | 0 | 8 | 524 | 524 |
| /solutions/plateformes-sur-mesure | mobile | 89 | 86 | 3464 | 3274 | 0 | 0 | 130 | 182 | 539 | 539 |
| /solutions/plateformes-sur-mesure | desktop | 100 | 99 | 738 | 754 | 0 | 0 | 0 | 12 | 546 | 546 |
| /equipements/vehicules | mobile | 89 | 87 | 3413 | 3749 | 0 | 0 | 100 | 89 | 721 | 744 |
| /equipements/vehicules | desktop | 100 | 100 | 765 | 800 | 0 | 0 | 8 | 0 | 728 | 779 |
| /produits | mobile | 82 | 84 | 4165 | 3702 | 0 | 0 | 195 | 265 | 764 | 796 |
| /produits | desktop | 100 | 99 | 761 | 842 | 0.023 | 0.011 | 0 | 9 | 762 | 847 |
| /aide | mobile | 93 | 88 | 3217 | 3512 | 0 | 0 | 68 | 110 | 507 | 507 |
| /aide | desktop | 100 | 100 | 688 | 723 | 0.001 | 0.001 | 0 | 6 | 514 | 514 |

**Les objectifs Core Web Vitals ne sont pas atteints en laboratoire local** (LCP mobile > 2,5 s sur les six routes).
