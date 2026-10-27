# Audit des flux de données — site ONLOUTOU

Date de l’audit : 2026-10-19  
Périmètre : dépôt `ONLOUTOU-site` (Next.js App Router), sans modification de `dist/`.

## Méthode

- Recherche statique dans `src/`, `package.json`, `next.config.ts`, `.openai/hosting.json`, `.env.example`
- Mots-clés : `fetch`, `localStorage`, `sessionStorage`, `cookie`, `gtag`, `analytics`, `wa.me`, `tel:`, `geolocation`, etc.
- Revue des configurateurs « client » et des builders WhatsApp

## Synthèse

| Élément | Résultat |
|--------|----------|
| API backend ONLOUTOU pour formulaires | **Absent** (aucun `fetch` vers API métier détecté) |
| `localStorage` | **Absent** |
| `sessionStorage` | **Vérifié** — préremplissage navigation produits / équipements uniquement |
| Analytics (GA, GTM, etc.) | **Absent** dans le code source |
| Cookies marketing | **Non détectés** dans le code (audit hébergement prod : **À confirmer**) |
| Portails partenaire / livreur | **Prévisualisation** — pas de collecte |
| WhatsApp | **Vérifié** — transmission au clic sur lien `wa.me` préparé côté client |

---

## Tableau des parcours

| Parcours | Données | Déclencheur | Destination | Stockage | Durée connue | Statut |
|---|---|---|---|---|---|---|
| Contact — choix WhatsApp | Message prédéfini ou saisi dans l’URL de choix | Clic lien WhatsApp | WhatsApp (Meta) | Non côté site | N/A côté site | Vérifié |
| Contact — téléphone | Numéro affiché | Clic `tel:` | Opérateur téléphonique | Non côté site | N/A | Vérifié |
| Produits — demande (`ProductRequestBuilder`) | Famille, usage, mode, quantité, zone, budget, etc. | Saisie locale ; lien `wa.me` généré dans le DOM | WhatsApp après clic utilisateur | État React + éventuellement `sessionStorage` (prefill entre pages produits) | Session navigateur ; prefill consommé à la lecture | Vérifié |
| Produits — rails / explorer | Identifiants de préremplissage (famille, mode, usage) | Navigation interne | `sessionStorage` uniquement | `sessionStorage` clé `onloutou-product-request-prefill` | Jusqu’à fermeture onglet / suppression | Vérifié |
| Livraison — demande (`DeliveryRequestBuilder`) | Bien, lieux, contraintes, contact | Saisie locale ; clic WhatsApp | WhatsApp | État React uniquement | Session navigateur | Vérifié |
| Devenir livreur (`DriverInterestForm`) | Profil, zone, transport, expérience | Saisie locale ; clic WhatsApp | WhatsApp | État React | Session navigateur | Vérifié |
| Devenir partenaire (`PartnerApplicationBuilder`) | Organisation, capacités, zone, proposition | Saisie locale ; clic WhatsApp | WhatsApp | État React | Session navigateur | Vérifié |
| Équipements — outils / connectés / véhicules / etc. | Champs des builders WhatsApp + prefill session | Saisie / navigation ; clic WhatsApp | WhatsApp | `sessionStorage` pour prefill (clés dédiées outils/connectés) | Session navigateur | Vérifié |
| Cartes / CTA WhatsApp génériques | Message template | Clic | WhatsApp | Non | N/A | Vérifié |
| Espace partenaire / livreur (aperçu) | Aucune saisie persistée | — | — | — | — | Absent |
| Aide — recherche | Requête de recherche | Frappe clavier | Mémoire React uniquement | Non | Session page | Vérifié |
| Centre d’aide — WhatsApp escalade | Message template | Clic | WhatsApp | Non | N/A | Vérifié |

**Note technique :** les liens WhatsApp incluent le message encodé dans l’attribut `href` une fois le formulaire rempli (visible dans le HTML avant envoi). Aucun envoi serveur ONLOUTOU avant le clic.

---

## Services tiers

| Service | Fonction | Données possibles | Chargement | Cookies | Vérification |
|---|---|---|---|---|---|
| WhatsApp (Meta) | Messagerie après clic utilisateur | Contenu du message, numéro de destination, métadonnées WhatsApp | Lien externe `wa.me` | Selon WhatsApp | Vérifié (lien) |
| Opérateur téléphonique | Appel via `tel:` | Numéro appelé | Lien natif | N/A | Vérifié |
| Hébergeur production | Hébergement du site | Journaux techniques possibles (IP, requêtes) | À la visite du site déployé | À confirmer | À confirmer |
| Google Analytics / GTM / pixels | — | — | Non chargé dans le code | — | Absent |
| Sentry / Hotjar / etc. | — | — | Non chargé | — | Absent |

---

## Stockage navigateur (clés vérifiées)

| Clé / mécanisme | Fichiers | Finalité |
|-----------------|----------|----------|
| `sessionStorage` — prefill produits | `ProductIntentRail`, `ProductUseExplorer`, `ProductRequestBuilder` | Préremplir le configurateur produit |
| `sessionStorage` — prefill outils | `EquipmentFamilyExplorer`, `ToolsEquipmentRequestBuilder`, etc. | Préremplir demandes équipements |
| `sessionStorage` — prefill connectés | `AssetEquipmentExplorer`, `ConnectedEquipmentRequestBuilder` | Préremplir demande équipements connectés |

---

## Espaces futurs

Les routes `/espace-partenaire` et `/espace-livreur` sont des prévisualisations statiques sans authentification, sans upload ni API (statut : **Prévu mais non implémenté** pour la collecte).

---

## Points à confirmer avant validation juridique

- Identité du responsable de traitement (voir `legal.ts`)
- Hébergeur et journaux en production
- Cookies éventuels posés par l’hébergeur ou le CDN
- Fondements juridiques et durées de conservation
- Transferts internationaux (WhatsApp, hébergement)
- Procédure d’exercice des droits et autorité compétente

---

## Audit cookies et stockages navigateur

**Date de l’audit :** 2026-10-19  
**Environnement :** `npm run build` + `npm run start` — http://localhost:3000  
**Navigateur :** Chromium (contrôle automatisé + inspection `document.cookie` / stockages)  
**Statut global :** `essential-only` (pas de traceur non essentiel identifié ; sessionStorage fonctionnel ; hébergeur prod à confirmer)

### Routes vérifiées

`/`, `/produits`, `/livraison`, `/contact`, `/aide`, `/espace-partenaire`, `/espace-livreur`

### Interactions testées

- Chargement initial de chaque route (sans interaction utilisateur)
- Lecture de `document.cookie`, `localStorage`, `sessionStorage`, IndexedDB, Cache Storage, iframes, scripts dont l’URL n’appartient pas à l’origine du site
- Préremplissage produits : `sessionStorage` attendu uniquement après action de navigation dédiée (confirmé dans le code source)

### Résultat avant interaction (toutes routes listées)

| Indicateur | Résultat |
|---|---|
| `document.cookie` | Vide |
| `localStorage` | Aucune clé |
| `sessionStorage` | Aucune clé |
| IndexedDB | Aucune base |
| Cache Storage | Aucun cache nommé |
| iframes | 0 |
| Scripts tiers au chargement | 0 (scripts `_next` sur même origine) |

### Résultat après interaction typique

| Action | Effet observé / attendu |
|---|---|
| Navigation interne configurateurs produits / équipements | Clés `onloutou-*` en `sessionStorage` jusqu’à consommation ou fermeture d’onglet |
| Clic lien WhatsApp / `tel:` | Sortie vers service externe ; technologies propres au tiers possibles |
| Formulaires | État React ; pas de cookie applicatif identifié |

### Limites de l’audit

- Hébergement de production et CDN non testés dans cet environnement
- Durées exactes des cookies infrastructure non attestées
- Pas de validation juridique des catégories ou fondements

### Inventaire cookies / stockages

| Nom | Fournisseur | Technologie | Catégorie | Finalité | Déclencheur | Durée | Statut |
|---|---|---|---|---|---|---|---|
| `onloutou-product-request-prefill` | ONLOUTOU | session-storage | Strictement nécessaire (fonctionnel) | Préremplir demande produit | Navigation produits | Session onglet | Vérifié |
| `onloutou-tools-family` | ONLOUTOU | session-storage | Strictement nécessaire (fonctionnel) | Préremplir famille outils | Navigation équipements | Session onglet | Vérifié |
| `onloutou-tools-mode` | ONLOUTOU | session-storage | Strictement nécessaire (fonctionnel) | Préremplir mode location/achat | Choix mode | Session onglet | Vérifié |
| `onloutou-connected-asset` | ONLOUTOU | session-storage | Strictement nécessaire (fonctionnel) | Préremplir actif connecté | Sélection actif | Session onglet | Vérifié |
| Cookies hébergeur / CDN | À confirmer | cookie | Inconnue | Infrastructure possible | Visite prod | À confirmer | À confirmer |

**Bannière de consentement :** non requise au regard de l’audit actuel (`trackingStatus !== non-essential`).
