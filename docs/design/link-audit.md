# Audit des liens — ONLOUTOU

Date : 2026-10-19  
Méthode : revue de `src/content/navigation.ts`, `src/content/header-navigation.ts`, `src/content/legal.ts`, routes `src/app/**/page.tsx`.

## Routes absentes (volontairement)

| Libellé | Destination | Statut | Correction |
|---|---|---|---|
| Conditions d’utilisation | `/conditions-utilisation` | OK | Page créée, footer activé (`legalFooterLinks`) |

## Liens footer / header (échantillon vérifié)

| Source | Libellé | Destination | Statut | Correction |
|---|---|---|---|---|
| Footer légal | Mentions légales | `/mentions-legales` | OK | — |
| Footer légal | Confidentialité | `/confidentialite` | OK | — |
| Footer légal | Cookies | `/cookies` | OK | — |
| Footer solutions | Gestion de flotte | `/solutions/gestion-de-flotte` | OK | — |
| Footer entreprise | Espace partenaire | `/espace-partenaire` | OK | Prévisualisation |
| Footer entreprise | Espace livreur | `/espace-livreur` | OK | Prévisualisation |
| 404 | Produits | `/produits` | OK | Ajouté lors de la passe graphique |

## Consolidation Solutions (2026-10-20)

Trois alias retirés de l’app ; redirections Apache prévues (`docs/deployment/lws-legacy-redirects.md`). Canoniques : `/solutions/location`, `/solutions/vente`, `/solutions/geolocalisation`, `/solutions/gestion-de-flotte`, `/solutions/securisation-actifs`, `/solutions/plateformes-sur-mesure`.

## Pages hors liste brief initiale mais présentes

| Route | Note |
|---|---|
| `/solutions/securisation-actifs` | Solution dédiée |
| `/partenaires/fournisseurs` | Sous-page partenaires |
| `/partenaires/livreurs` | Sous-page partenaires |
| `/partenaires/technologiques` | Sous-page partenaires |

Contrôle automatisé recommandé : `npm run test:final-audit` après `npm run build` et `npm run start`.
