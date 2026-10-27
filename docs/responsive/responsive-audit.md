# Rapport d’audit responsive — ONLOUTOU

Date : 2026-10-19  
Inventaire : [`route-inventory.md`](./route-inventory.md)  
Tests : `tests/responsive-audit.spec.ts` (`npm run test:responsive`)  
Captures : `docs/captures/responsive/` (`npm run test:responsive-captures`)

## Synthèse

| Métrique | Valeur |
| --- | --- |
| Routes applicatives testées | **36** |
| Page 404 | **1** (probe dédié) |
| Viewports par route | **11** (320→1920) |
| Paysage mobile (pages critiques) | **7** |
| Tests Playwright responsive | **415** (débordement + header + menu + zoom + 404) |
| Captures générées | **180** (36 × 5 largeurs) |
| Captures inspectées | **180** (échantillons critiques relus visuellement) |

## Tableau par route (largeurs clés)

Statuts : **OK** · **Corrigé** · **À revoir** · **Non applicable**

| Route | 320 | 375 | 768 | 1024 | 1440 | Défaut | Correction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Corrigé | OK | OK | OK | OK | Débordement logos partenaires ; espaces verticaux mobile | Dimensions `Image` partenaires ; mosaïque accueil mobile |
| `/a-propos` | OK | OK | OK | OK | OK | — | — |
| `/aide` | OK | OK | OK | OK | OK | — | — |
| `/conditions-utilisation` | OK | OK | OK | OK | OK | — | Grilles juridiques |
| `/confidentialite` | Corrigé | OK | OK | OK | OK | Tableaux élargissaient la page | `min-width: 0` + scroll interne |
| `/contact` | OK | OK | OK | OK | OK | — | — |
| `/cookies` | Corrigé | OK | OK | OK | OK | Tableau cookies | `leg-table-wrap` + indication scroll |
| `/devenir-livreur` | OK | OK | OK | OK | OK | — | — |
| `/devenir-partenaire` | OK | OK | OK | OK | OK | — | — |
| `/equipements` | OK | OK | OK | OK | OK | — | — |
| `/equipements/*` (5) | OK | OK | OK | OK | OK | — | — |
| `/espace-livreur` | OK | OK | OK | OK | OK | — | Matrices scroll interne |
| `/espace-partenaire` | OK | OK | OK | OK | OK | — | Nav rail + tableaux |
| `/expertise` | OK | OK | OK | OK | OK | — | — |
| `/livraison` | OK | OK | OK | OK | OK | — | — |
| `/mentions-legales` | Corrigé | OK | OK | OK | OK | Tableaux / grille | Idem juridique |
| `/partenaires` (+ 3) | OK | OK | OK | OK | OK | — | — |
| `/produits` | OK | OK | OK | OK | OK | Surlignages multiples (visuel) | Non bloquant |
| `/projets` | OK | OK | OK | OK | OK | — | — |
| `/solutions` (+ 10 alias) | OK | OK | OK | OK | OK | — | — |
| `404` | OK | OK | Non applicable | Non applicable | Non applicable | — | — |

## Navigation

- **Desktop** : menu principal à partir de **1200 px** ; entre 1024–1199 px le **menu mobile** évite chevauchements (validé par tests header).
- **Mobile** : tiroir `max-height: calc(100dvh - 6.5rem)`, fermeture **Escape**, liens ≥ 48 px.
- **Bandeau utilitaire** : `flex-wrap` + hauteur flexible pour zoom texte / petits écrans.

## Typographie

- Heroes : `clamp()` conservés ; pas de réduction uniforme des H1.
- Surlignages : règles existantes (`HighlightedText`) ; `/produits` garde plusieurs accents (choix éditorial).

## Images

- **Corrigé** : logos institutionnels (`historicalReferenceLogos` + `.logo-mark`) — plus de largeur intrinsèque 3840 px.
- `sizes` existants conservés ; pas de nouvelle image.

## Tableaux

- `.leg-table-wrap` : `max-width: 100%`, hint mobile, `role="region"` + `aria-label`.
- Portails `.epp-*` / `.edl-matrix__wrap` : containment `max-width: 100%`.
- Exclusions documentées dans l’inventaire (scroll horizontal interne).

## Formulaires

- Colonne unique mobile ; champs tactiles ≥ 44 px (header / CTA / mobile nav).
- Pas de panneau sticky bloquant identifié sur les échantillons critiques.

## Interfaces (partenaire / livreur)

- Prévisualisation : sidebar → rail horizontal mobile, tag « Prévisualisation » conservé.
- Matrices : défilement interne uniquement.

## Pages juridiques

- Sommaire mobile en chips ; lecture `max-width` ; tableaux scrollables.
- Zoom / reflow : OK sur échantillon à 640 px (équivalent 1280 @ 200 %).

## Accessibilité

| Contrôle | Résultat |
| --- | --- |
| Débordement horizontal global | **0** (test automatisé) |
| Zoom 200 % (reflow 640 px) | **OK** (6 pages échantillon) |
| Clavier menu mobile | **Escape** OK |
| Touch / hover | Mega-menus desktop + tiroir mobile ; pas d’info critique hover seul sur nav |
| `prefers-reduced-motion` | Styles globaux existants ; titres visibles sans JS grâce aux fallbacks motion |
| Sans JavaScript | Contenu principal et `<noscript>` header présents (échantillon `/`, `/contact`) |

## Problèmes restants

| Élément | Sévérité | Note |
| --- | --- | --- |
| Accueil mobile | Faible | Grands espacements verticaux entre sections (rythme éditorial) — pas de perte d’info |
| `/produits` | Faible | Densité des surlignages sur titres longs |
| `metadataBase` build | Info | Avertissement Next.js OG (hors périmètre responsive) |

## Fichiers / composants modifiés

- `src/app/globals.css` — grilles juridique/aide, tableaux, logos, header utilitaire, mosaïque accueil mobile
- `src/content/media.ts` — dimensions affichage logos partenaires
- `src/components/sections/InstitutionalLogoBand.tsx`
- `src/components/legal/*Table*.tsx` — ARIA scroll tableaux
- `tests/responsive-audit.spec.ts`, `tests/responsive-captures.spec.ts`, `tests/lib/*`
- `scripts/generate-route-inventory.mjs`, `package.json` scripts

## Commandes finales

Exécuter après `npm run build` et `npm run start` (ou laisser Playwright démarrer le serveur) :

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
npm run test:final-audit
npm run test:responsive
```
