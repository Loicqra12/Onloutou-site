# Décomposition LCP — pass 2 (baseline, mobile, run 1)

| Route | Élément LCP | Cause dominante (constat) |
| --- | --- | --- |
| `/` | `section#accueil .home-hero-photo img` | Poids/décodage image + variance lab (médiane baseline 4304 ms) |
| `/solutions` | Paragraphe intro `.prose-measure` (texte) | Polices + rendu texte (pas image) |
| `/solutions/plateformes-sur-mesure` | `.platform-hero__intro` (texte) | Polices / hero éditorial |
| `/equipements/vehicules` | `.veh-hero__img` (photo) | Image hero (Reveal retiré en after) |
| `/produits` | `.prd-hero__img--main` (photo) | 3 images simultanées avant correctif ; mosaic latéral différé après |
| `/aide` | `.hlp-hero__intro` (texte) | LCP textuel — polices Manrope |

Les audits `lcp-breakdown-insight` n’ont pas exposé les sous-phases dans l’export JSON CLI ; la cause dominante est déduite du sélecteur LCP + réseau (images PNG/WebP).
