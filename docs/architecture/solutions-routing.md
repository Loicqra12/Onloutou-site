# Architecture des routes Solutions

Intervention 2026-10-20 — consolidation éditoriale, navigation et SEO.

## Pages canoniques

| Route | Rôle |
| --- | --- |
| `/solutions/location` | Location d’équipements (vitrine riche) |
| `/solutions/vente` | Vente sur devis |
| `/solutions/geolocalisation` | GPS, alertes, géozones, installation |
| `/solutions/gestion-de-flotte` | Supervision, tableaux de bord, reporting |
| `/solutions/securisation-actifs` | Sécurisation et suivi d’actifs |
| `/solutions/plateformes-sur-mesure` | Plateformes et intégrations |

## Anciennes routes (hors application)

| Ancienne URL | Redirection Apache (LWS) |
| --- | --- |
| `/solutions/location-equipements` | `/solutions/location` |
| `/solutions/vente-equipements` | `/solutions/vente` |
| `/solutions/geolocalisation-gestion-flotte` | `/solutions/gestion-de-flotte` |

Voir `docs/deployment/lws-legacy-redirects.md`.

## Choix éditoriaux

- **Location / vente** : URLs courtes, pages vitrines déjà les plus complètes.
- **Géolocalisation et flotte** : intentions distinctes, pas de fusion ; la page combinée couvrait surtout le périmètre « flotte » élargi.
- Contenu des anciennes pages éditoriales (`location.ts`, `sale.ts`, `fleet-management.ts`) : redondant avec les vitrines ; pas de copie intégrale, seulement alignement des liens.

## Ancres migrées

| Ancien lien | Nouveau lien |
| --- | --- |
| `…/location-equipements#vehicules` | `/solutions/location#vehicules` |
| `…/location-equipements#engins` | `/solutions/location#camions` |
| `…/location-equipements#outils` | `/solutions/location#outils` |
| `…/vente-equipements#vehicules` | `/solutions/vente#vehicules` |
| `…/vente-equipements#materiels` / `#outillage` | `/solutions/vente#outils` |
| `…/vente-equipements#demande` | `/solutions/vente#demande-equipement` |
| `…/geolocalisation-gestion-flotte#alertes` | `/solutions/geolocalisation#alertes` |
| `…/geolocalisation-gestion-flotte#iot` | `/solutions/gestion-de-flotte#tableaux-de-bord` |
| Titre groupe « Connecter » | `/solutions#connecter-piloter` |

## Navigation finale

- **Hub** (`solutions-hub.ts`) : six cartes sous Louer / Connecter / Construire ; section `#connecter-piloter`.
- **Mégamenu** (`header-navigation.ts`) : mêmes destinations ; Louer → `/solutions/location`, Acheter → `/solutions/vente`.
- **Footer** : six liens canoniques + projets.
- **Liens contextuels** : géolocalisation ↔ gestion de flotte (`SolutionCompanionLink`).

## SEO

- **33** routes applicatives, **27** indexables, **6** `noindex` (inchangés).
- Anciennes routes : absentes du sitemap, de `discoverAppRoutes`, des breadcrumbs et JSON-LD applicatifs.
- Redirections HTTP : uniquement au déploiement LWS.

## Futures sous-pages

Toute nouvelle page Solutions doit :

1. être listée dans `detailedSolutionPages` et le mégamenu si elle est une destination de premier niveau ;
2. avoir une entrée dans `src/lib/seo/routes.ts` ;
3. éviter de recréer un doublon « éditorial court » + « vitrine longue » sur la même intention.
