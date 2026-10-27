# Optimisation images — pass 2

Généré à partir de `docs/performance/pass-2/lcp-variants.manifest.json` et `npm run optimize:lcp-images`.

## Stratégie

- **Sources PNG conservés** dans `public/assets/images/…`
- **Variantes WebP** dans `public/assets/images/lcp/*.w{width}.webp`
- Composant **`LcpPicture`** : `<picture>` + `srcset` mobile/desktop + fallback `<img src={png}>`
- Compatible **export statique** (pas de dépendance à `/_next/image` pour les LCP traités)

## Tableau des conversions LCP

| Source | Variante (ex.) | Dimensions | Poids avant (Ko) | Poids après (Ko) | Gain | Validation visuelle |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `installation-traceur-gps-onloutou.png` | `.w828.webp` | 828×552 | 2254 | 64 | −97 % | OK laboratoire (pas de banding constaté) |
| `mobilite-professionnelle-cour-logistique.png` | `.w828.webp` | 828×552 | 2565 | 80 | −97 % | OK |
| `Flotte professionnelle inspectée à Abidjan-2.png` | `.w828.webp` | 828×466 | 2261 | 64 | −97 % | OK |
| `installation-gps-berline-onloutou.png` | `.w828.webp` | 828× | 2254 | ~65 | −97 % | OK (solutions / secondaires) |
| Menu `mega-menu-equipements-onloutou.png` | `.w640.webp` | 640× | 2353 | ~45 | −98 % | OK (mégamenu) |
| `inspection-groupe-electrogene.png` | `.w640.webp` | 640× | 2289 | ~42 | −98 % | OK (produits secondaire différé) |

Les **41 PNG ≥ 400 Ko** restent inventoriés ; seules les ressources **réellement critiques LCP / above-the-fold** ont été converties dans cette passe.

## `/produits`

- Mosaic secondaire **masquée < 640px** (`hidden sm:grid`) + `loading="lazy"` sur images latérales
- **Reveal retiré** du hero (évite render delay lié à `motion-reveal`)
- Chunks **ProductIntentRail**, **ProductUseExplorer**, **ProductRequestBuilder** chargés via `dynamic()` (contenu HTML hero inchangé)

## Responsive

- `sizes` resserrés sur les héros (640 / 1024 / desktop)
- Mobile : candidat WebP **640–828w** via `<source media>`
