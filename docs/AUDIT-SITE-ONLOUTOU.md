# Audit du site ONLOUTOU — 6 novembre 2026 (tour 1 et tour 2)

Résultats **datés du 06/11/2026**, distincts de l’intégration antérieure (12/12) et de `docs/FORM-E2E-RESULTS.md` (8 passés + 2 ignorés, 05/11/2026). Le tour 2 (ce document mis à jour) corrige des constats du tour 1 qui étaient inexacts ou incomplets ; ils sont signalés par « corrigé au tour 2 ».

Documents liés : `docs/PREPARATION-MISE-EN-PRODUCTION.md` (domaine, proxy et limitation de débit, mesure publicitaire, cookies), `docs/FORM-INTEGRATION.md`.

## Résumé

| | État |
|---|---|
| Accueil à 320×568, première visite | Bouton « Faire une demande de location » **entièrement visible au-dessus du bandeau cookies** (capture ci-dessous) ; le lien « Équiper ma flotte en GPS » reste en partie masqué tant que le choix du bandeau n’est pas fait |
| Parcours connectés (7) | **7/7 pilotés depuis l’interface**, ordinateur et émulation Pixel 5 |
| Compteur backend | **22 parcours sur 22 vérifiés de bout en bout** (hors pièces jointes, volontairement désactivées) |
| Tests | Aucun test automatisé en échec à la fin du tour 2 (détail §6) |
| Non fait / impossible ici | Téléphone réel, Safari/iOS, Firefox, production (domaine, proxy, indexation, positions, performances terrain) |

![Accueil à 320 × 568, première visite, avant tout clic sur le bandeau](captures/audit-2026-11-06/round2/home-320-after.png)

Avant : `captures/audit-2026-11-06/round2/home-320-before.png`.

## 0. Périmètre, environnement, limites

- Copie testée : ce dossier (`Next start` sur 3000, API Express compilée sur 4000, relais `/api/v1`, PostgreSQL 5433).
- **Bases** : écriture d’audit dans `onloutou_audit` ; tests d’intégration dans `onloutou_integration` ; base de dev `onloutou` **jamais utilisée pour écrire** par les tests du tour 2.
- **Garde-fou des E2E (tour 2)** : `tests/e2e-db-guard.ts`. Les E2E s’arrêtent **avant toute écriture, création du compte admin comprise**, sauf si `DATABASE_URL` est défini explicitement dans le shell, pointe sur 127.0.0.1/localhost et porte un nom `onloutou_audit`, `onloutou_e2e`, `onloutou_integration` ou `onloutou_test`. Vérifié : lancement sans variable → refus ; lancement avec l’URL de la base de dev → refus. Le script `backend/scripts/ensure-e2e-admin.ts` applique la même règle.
- **Compte `e2e-admin@onloutou.local` dans la base de dev** (vérification en lecture seule, rien supprimé) : **il existe**, créé à 18:57 par mon premier lancement E2E, avant le garde-fou. Aucune demande d’audit n’a été écrite dans cette base. Suppression à votre décision.
- Processus : mes serveurs d’audit ont été identifiés par ligne de commande et dossier avant tout arrêt ; seuls ceux-là ont été arrêtés. L’API de dev (arrêtée plus tôt pour libérer le port 4000) a été relancée à la fin et son `/health` vérifié (voir §7).
- Navigateurs : **Chromium émulé uniquement** (Playwright, profil « Pixel 5 » pour les E2E mobiles). Aucun téléphone physique, ni Safari/iOS, ni Firefox.
- Aucun push, merge, déploiement, campagne, traceur publicitaire ni message réel. Les liens WhatsApp ont été lus (`href`), jamais ouverts.

## 1. Inventaire

- 44 routes `page.tsx` (hors 404) : 27 indexables et dans le sitemap, 17 `noindex`. Aucune route dynamique : le catalogue public est servi par `/produits` et `/equipements/*`.
- Hors navigation mais joignables : `/espace-livreur/{connexion,inscription,dossier}`, `/espace-partenaire/{connexion,inscription,catalogue}`, `/admin/*`, pages légales (pied de page), `/partenaires/*`.
- Formulaires qui enregistrent (14) : contact (6 besoins, dont `?need=gps`), brief location, brief vente, `/produits`, `/projets`, `/livraison`, `/devenir-partenaire`, `/devenir-livreur`, hubs véhicules, motos, camions, outils, connectés.
- Constructeurs hérités non montés : `DeliveryRequestBuilder`, `ProjectBriefBuilder`, `PlatformProjectBrief` (`docs/legacy-forms.md`).

## 2. Accueil et premier écran (tour 2)

Constat rectifié : au tour 1, j’avais écrit que l’accueil n’avait « aucun bouton ». C’était inexact : les boutons existaient mais étaient **sous le paragraphe d’introduction, donc sous le bandeau cookies** à 320×568.

Appliqué : titre « Qui loue tout en Côte d’Ivoire ? ONLOUTOU. », photos et identité noir/jaune/ivoire inchangés. Sous le titre : bouton principal **« Faire une demande de location »** → `/solutions/location` ; lien secondaire **« Équiper ma flotte en GPS »** → `/solutions/geolocalisation`. La location couvre véhicules et équipements. « Devenir partenaire » reste dans le menu (Partenaires → Devenir partenaire).

Mesures à 320×568, navigateur neuf, **avant tout clic sur le bandeau** (`scripts/audit-home-first-visit.mjs`) :

| Élément | Haut → bas (px) | Taille |
|---|---|---|
| Bouton principal | 259 → 305 | 284 × 46 |
| Lien secondaire | 307 → 351 | 195 × 44 (en partie sous le bandeau, qui commence à 322) |
| Bandeau cookies | 322 → 560 | ≈ 42 % de l’écran |

Aucun défilement horizontal. Bandeau : texte lisible, trois choix visibles (« Tout accepter », « Uniquement les nécessaires », « Gérer les préférences »), atteignables au clavier ; défilement interne s’il est plus haut que l’écran. Le texte juridique n’a pas été raccourci (validation juridique requise).

## 3. Livraison et partenariat (tour 2)

- **Ce que promet `/livraison`** : présenter un **besoin de livraison** que ONLOUTOU qualifie avant toute proposition ; la page n’annonce ni délai ni disponibilité.
- **Qui demande quoi.** Deux actions distinctes existent : **commander un service** (`/livraison`) et **proposer ses services de livraison** (`/devenir-livreur`, `/devenir-partenaire`). Au tour 1, la demande `/livraison` était classée `PARTNER_DELIVERY` (« Partenaire — logistique »), donc comme une offre de partenaire. **Corrigé** : elle est enregistrée avec le type **`DELIVERY`** (source `livraison-demande`) ; l’intérêt livreur de `/devenir-livreur` est **`PARTNER_DELIVERY`** (il était `OTHER`). Dans la fiche détaillée de l’admin, les deux se lisent « Livraison » et « Partenaire — logistique » ; **la liste `/admin/demandes` affiche encore le code brut** (`DELIVERY`, `PARTNER_DELIVERY`), à traduire.
- Preuve (`scripts/audit-delivery-types.mjs`, base d’audit, `round2/delivery-types.json` et `round2/admin-types-livraison-livreur.png`) : requêtes envoyées depuis l’interface `source: livraison-demande, type: DELIVERY` et `source: devenir-livreur-interet, type: PARTNER_DELIVERY` ; les deux dossiers sont retrouvés dans `/admin/demandes` avec leur référence `ONL-…` et ces types.
- **Téléphone de `/devenir-partenaire`** (et `/devenir-livreur`, `/livraison`) : un texte sans numéro est refusé avec « Indiquez un numéro de téléphone (par exemple 07 12 34 56 78) ou une adresse e-mail valide. » ; un numéro ivoirien valide (espaces, +225, tirets acceptés ; 8 à 15 chiffres) ou un e-mail est accepté ; la saisie n’est jamais effacée.
- **Titres SEO alignés sur l’action** : `/livraison` → « Livraison : présenter votre besoin à ONLOUTOU » ; `/devenir-livreur` → « Livreurs : présenter votre profil à ONLOUTOU » ; descriptions : l’envoi ne garantit ni disponibilité, ni délai, ni acceptation. `test:seo` 64/64.

## 4. Sept parcours connectés depuis l’interface (tour 2)

Test `tests/connected-e2e.spec.ts`, contextes de navigateur séparés par rôle, base d’audit, comptes de test jetables. Résultat : **7/7 sur ordinateur et 7/7 en émulation Pixel 5**. Les captures n’affichent aucun mot de passe (champs masqués) ni donnée réelle ; elles sont dans `captures/audit-2026-11-06/round2/connected/`.

| # | Parcours | Action à l’écran | Résultat observé | Preuve |
|---|---|---|---|---|
| 1 | Inscription partenaire (2 comptes) | Remplir e-mail, mot de passe, nom, organisation, zone → « Créer mon dossier » | Message « Candidature enregistrée » ; « Statut du dossier : Candidature reçue, en attente d’examen » ; formulaire de fiches absent (« disponible après validation ») | `pixel5-1-partenaire-candidature-recue.png` |
| 5 | Candidatures (admin) | `/admin/candidatures`, ligne de chaque organisation → « Valider » | Les deux dossiers apparaissent en `SUBMITTED`, passent en `APPROVED` ; dossiers livreurs visibles aussi | `pixel5-5-…partenaires.png`, `pixel5-5b-…livreurs.png` |
| 2 | Connexion | Mauvais mot de passe puis bon | « Identifiants incorrects. » et on reste sur la page ; puis catalogue ouvert avec « Statut du dossier : Approuvé » | `pixel5-2-connexion-partenaire-approuve.png` |
| 3 | Catalogue : **un même produit** | Créer la fiche → « Soumettre pour validation » | « Brouillon (non transmis) », absente de `/produits` ; puis « Transmis, en attente de validation » | `pixel5-3a-…brouillon.png`, `pixel5-3b-…transmis.png` |
| 6 | Produits (admin) | `/admin/produits`, la même fiche → « Publier » | Ligne retirée de la file ; côté partenaire « Validé et publié » ; **visible sur `/produits`** (titre, catégorie, description ; ni organisation, ni propriétaire, ni motif de refus) | `pixel5-6a-…en-attente.png`, `pixel5-6b-…visible-publiquement.png` |
| 4 | Dossier livreur | Inscrire deux livreurs ; l’admin valide le premier | Dossier « Candidature reçue », puis « Approuvé » pour le validé ; le second reste « Candidature reçue » | `pixel5-4-dossier-livreur-approuve.png` |
| 7 | Droits entre deux comptes | Le partenaire B tente de modifier/soumettre la fiche de A, d’ouvrir `/driver/me`, l’admin ; le livreur 2 tente le dossier du livreur 1, les routes partenaire et admin | Refus (code ≥ 403) partout ; la liste de B ne contient pas la fiche de A ; `/admin/produits` affiche l’erreur d’accès ; le livreur 2 ne voit que son propre dossier | `pixel5-7a-partenaire-refuse-admin.png`, `pixel5-7b-livreur-2-dossier-propre.png` |

**Pièces jointes : ligne séparée, désactivée.** Le téléversement répond 503 sans stockage S3, aucun antivirus n’est branché, le statut `PENDING` est conservé. Aucun envoi réel n’est possible ; à ne pas activer avant validation du stockage et de l’antivirus.

Défauts trouvés et corrigés pendant ces parcours :
- **Fiche partenaire impossible à transmettre** : le catalogue partenaire n’avait aucun bouton pour soumettre un brouillon. Ajouté : « Soumettre pour validation », statuts en français, motif de refus affiché.
- **Liste publique du catalogue** (`GET /catalog/products`) : exposait des champs internes (identifiants du propriétaire, motif de refus). Elle ne renvoie plus que les champs publics (test d’intégration ajouté).
- **Formulaires sans libellés associés** (connexion, inscription, catalogue : aucun `for`/`id`) : corrigé, ce qui rend aussi les champs repérables par un lecteur d’écran.
- **Messages d’erreur non annoncés** : `class="adm-error"` sans `role="alert"` ; ajouté partout.
- **Page publique `/produits`** : affichait « aucune fiche » même avec des fiches validées ; elle liste maintenant les fiches partenaires publiées.

## 5. Responsive, clavier, zoom (tour 1 et 2)

### Matrice publique finale (après la dernière modification de CSS)

`scripts/audit-responsive-matrix.mjs`, 45 routes × 8 largeurs (320, 360, 375, 390, 430, 768, 1024, 1440) = **360 mesures**, JSON **complet** : `captures/audit-2026-11-06/round2/final/responsive-matrix.json` (capturé aux largeurs 320 et 360).

| | Avant (tour 1) | Final (tour 2) |
|---|---|---|
| Défilement horizontal global | 2 pages (`/solutions/location`, `/vente`, 1024 px) | **0 / 360** |
| Erreurs de chargement / HTTP 5xx | — | 0 / 0 |
| Textes < 12 px à 320 px | 477 | 332 (libellés décoratifs sans classe dédiée, 10–11,8 px) |
| Boîtes d’éléments cliquables < 24 px à 320 px | 234 | 186 (mesure de la boîte visible, voir ci-dessous) |

Les erreurs console restantes sont attendues : 401 sur les pages privées sans session (40), 404 volontaire de la sonde (8).

### Zone réellement cliquable

La boîte visible n’est pas la zone cliquable (surface agrandie par `::after`). `scripts/audit-hit-areas.mjs` balaie des points autour de chaque lien trop petit (320 et 390 px) et garde ceux qui touchent vraiment l’élément (`elementFromPoint`) ; JSON : `round2/hit-areas.json`.
- Avant correction : 79 éléments avec une zone < 24 px, dont les liens `link-motion` de `/produits` et `/solutions/location` (20–22 px de haut, **la zone cliquable était celle de la boîte, donc vraiment petite**).
- Correction (CSS mobile) : liens `a.link-motion` et fil d’Ariane des pages légales à **44 px de haut**.
- Après : **tous ≥ 24 px**, à deux exceptions : le lien d’évitement « Aller au contenu principal » (invisible tant qu’il n’a pas le focus) et des **liens placés dans une phrase** des pages légales (22–24 px, exception « en ligne » de WCAG 2.5.8). **Le seuil de 44 px n’est pas atteint partout** : lignes du pied de page 32–40 px, « Retour en haut » 126 × 32 px.
- Remarque : au premier passage, le bandeau cookies recouvre « Retour en haut » du pied de page ; c’est attendu tant que le choix n’est pas fait.

### Écrans connectés aux 8 largeurs, avec une session du bon rôle

`scripts/audit-connected-matrix.mjs` : admin (demandes, candidatures, produits), partenaire approuvé (catalogue), livreur (dossier) × 8 largeurs, session par rôle. **45 mesures, 0 débordement, 0 action rognée, 0 action < 36 px.** JSON : `round2/connected-matrix/connected-matrix.json` ; captures 320/360 dans le même dossier.

- **Tableaux admin à 320/360** : disposition en cartes (≤ 640 px, en-têtes masqués, libellé par cellule) ; boutons d’action ≥ 36 px (44 px sous 640 px) ; 50 lignes de demandes et 39 candidatures mesurées sans rognage. Les statuts s’affichent encore en code brut (`SUBMITTED`, `APPROVED`) : à traduire (non fait).
- **Dernier champ et bouton d’envoi** : champ « Description » 95 px, bouton « Enregistrer le brouillon » 45 px de haut, tous deux dans la largeur et atteignables en défilant (320 et 360).
- **Messages d’erreur** (`scripts/audit-form-errors.mjs`, 8 cas : connexion partenaire, livreur, admin avec mauvais mot de passe ; inscription avec e-mail déjà pris ; à 320 et 360) : message visible dans la fenêtre, bouton d’envoi 45 px, aucun débordement. Captures : `round2/form-errors/`.
- **Clavier** : 14 tabulations sur chacun des 5 écrans à 320 et à 1024 px ; chaque arrêt a un contour ou une ombre de focus visible ; aucun focus hors de la fenêtre.
- **Zoom 200 %** : équivalent d’un zoom navigateur de 200 % sur écran 1280 px = 640 px de large : 7 pages (accueil, contact, livraison, produits, devenir-partenaire, connexion partenaire, admin login), 0 débordement (`round2/zoom200-public/`). **Cas extrême non résolu** : texte agrandi à 200 % sur une fenêtre de 320 px (`round2/connected-matrix/zoom200/`) : le mot-symbole « ONLOUTOU » est tronqué dans l’en-tête et le bandeau cookies occupe tout l’écran (il défile en interne, ses boutons restent atteignables).

### Corrigés au tour 1
1. Bandeau cookies : recouvrait le menu mobile ouvert ; désormais compact et masqué menu ouvert.
2. Coordonnées des briefs : champs en ligne sans style → débordement 1024 px ; bloc `.brief-contact`.
3. Contact sans téléphone ni e-mail : champs ajoutés et validés.

### Test manuel de 5 minutes sur un vrai téléphone (pour Sidney)

Aucun téléphone réel n’a été utilisé dans cet audit : tout est de l’émulation Chromium. Test à faire avec le site local ou de préproduction, en navigation privée, sans toucher au bandeau au départ.
1. **Accueil (1 min)** : ouvrir `/`. Le bouton jaune « Faire une demande de location » est-il entier, au-dessus du bandeau ? Toucher « Uniquement les nécessaires » : le bandeau disparaît-il, le lien « Équiper ma flotte en GPS » apparaît-il en dessous ?
2. **Menu (1 min)** : ouvrir le menu (≡), ouvrir « Partenaires », atteindre « Devenir partenaire », refermer. Rien ne doit rester coincé sous le bandeau.
3. **Saisie avec clavier ouvert (2 min)** : toucher « Faire une demande de location », remplir le nom puis le téléphone avec le clavier affiché. Le champ en cours de saisie reste-t-il visible ? Le bouton « Enregistrer ma demande » est-il atteignable en faisant défiler ?
4. **Référence (1 min)** : envoyer. Une référence `ONL-AAAAMMJJ-XXXXXX` s’affiche-t-elle lisiblement ? Le bouton « Continuer sur WhatsApp » est facultatif : ne pas l’ouvrir si vous ne voulez pas envoyer de message.
Noter le modèle de téléphone, le navigateur et la capture en cas de défaut.

## 6. Tests et commandes (6 novembre 2026, fin du tour 2)

| Commande | Résultat |
|---|---|
| `npm run typecheck` | OK |
| `npm run lint` | 0 erreur, 7 avertissements (rapports Playwright générés exclus du lint) |
| `npm run build` (Next), `npm run build -w @onloutou/backend` | OK |
| `npm run test:api` | 1/1 |
| `npm run test:integration -w @onloutou/backend` (base `onloutou_integration`) | **14/14** (test ajouté : aucun champ interne dans le catalogue public) |
| `npm run test:forms:e2e` (formulaires) | **14/14** (desktop + Pixel 5) |
| Parcours connectés (`connected-e2e`) | **14/14** (7 × 2) |
| `npm run test:seo` | **64/64** |
| Tests de pages, projet desktop (`*-page.spec.ts`) | 166 tests : 161 passants, 3 ignorés (réservés à un autre projet), 2 échecs → corrigés et rejoués seuls : passants |
| « échec API — champs conservés » (flaky du tour 1) | **12/12** en 12 passages (6 desktop + 6 mobile), sans temporisation arbitraire |

**Aucun test automatisé n’échoue à la fin du tour 2.** Les 11 échecs du tour 1 ont été examinés un par un :
- **Obsolètes (flux « WhatsApp seul »), réécrits** : `become-partner`, `delivery`, `driver-partner`, `connected-equipment`, `motorcycles`, `tools-equipment`, `trucks-machinery`, `vehicles`, `contact`, `rental`, `sales`. Ils attendent désormais l’enregistrement (« Demande enregistrée », référence `ONL-…`), puis le lien/bouton WhatsApp **sans ouverture automatique**. Les assertions qui protègent un comportement toujours attendu sont conservées : validation des champs, récapitulatif en direct, aucune écriture en stockage navigateur, message WhatsApp contenant les champs saisis.
- **Deux autres désuets découverts en rejouant toutes les pages** : `products-page` (même changement de flux) et `geolocation-page` (le lien du hero porte désormais `?need=gps`, voulu).
- Aucune régression de page n’a été trouvée dans ces 11 tests.
- « Échec API » : l’assertion attend désormais l’événement `requestfailed` de la requête `POST /api/v1/requests`, puis l’alerte « Connexion impossible », puis la conservation de la saisie.

Précisions honnêtes :
- **Limite de débit constatée en test** : la limite d’authentification (20 par 15 min et par adresse IP, en mémoire) a bloqué des séries d’inscriptions/connexions répétées jusqu’au redémarrage de l’API, **deux fois** ce tour (un test admin et le parcours « livreur » échouaient). Ce n’est pas un défaut de test mais **un risque réel en production** si tous les visiteurs partagent une adresse (voir `docs/PREPARATION-MISE-EN-PRODUCTION.md` §2). Avant chaque lot E2E, j’ai redémarré l’API d’audit.
- Non relancés ce tour : `npm run test:responsive` (11 largeurs, débordement seul), tests de performance, tests légaux. Leur dernier résultat n’est pas mis à jour ici.

## 7. Décisions pour le propriétaire

1. **Domaine nu ou `www`** : choix non tranché ; une seule forme doit servir de canonical, de sitemap et de `NEXT_PUBLIC_SITE_URL`, l’autre doit rediriger (301).
2. **Visuel de partage** : 18 pages indexables n’ont aucune `og:image`, faute d’un visuel 1200×630 approuvé ; le logo ne doit pas servir de remplaçant.
3. **Compte `e2e-admin@onloutou.local`** dans la base de dev : à supprimer ou à conserver.
4. **Politique de cookies** : décrire `onloutou.sid` (session, 14 jours) et `onloutou.csrf` / `__Host-onloutou.csrf` (session du navigateur), déposés au premier envoi ; la description factuelle est dans `docs/PREPARATION-MISE-EN-PRODUCTION.md` §4.
5. **Proxy et limitation de débit** : `TRUST_PROXY` accepte maintenant un nombre de sauts (0–5) ; à régler sur l’infrastructure réelle et à tester (§2 du même document). Autre correction : `COOKIE_SECURE` non défini retombe désormais sur « sécurisé en production » (une variable absente donnait « non sécurisé »).
6. **Mesure publicitaire** : principe d’attribution unique prêt sur papier ; aucun traceur ni donnée personnelle vers une régie ; consentement à décider.
7. **Pièces jointes** : ne pas activer avant stockage S3 et antivirus.
8. **Pages légales** encore en attente de validation (restent `noindex`).
9. **Statuts admin** encore en code brut ; texte large à 200 % sur 320 px ; seuil de 44 px non atteint sur les lignes du pied de page.

## 8. Marketing côté visiteur

| Intention | Ce que le visiteur comprend | Chemin | Constat |
|---|---|---|---|
| PME qui loue un véhicule ou un équipement | « Qui loue tout en Côte d’Ivoire ? ONLOUTOU. » puis bouton « Faire une demande de location » | accueil → bouton → brief (nom, téléphone) → Enregistrer | **1 clic** depuis l’accueil ; besoin transmis, référence affichée, WhatsApp optionnel |
| Gestionnaire de flotte | Lien « Équiper ma flotte en GPS » | accueil → lien → page géolocalisation → `/contact?need=gps` | Le besoin « GPS » est porté au formulaire (type `GPS`) |
| Propriétaire d’équipement ou transporteur | « Devenir partenaire » dans le menu | menu → Partenaires → Devenir partenaire | Enregistré (`PARTNER_SUPPLIER` / `PARTNER_DELIVERY`) ; téléphone ou e-mail désormais validé |

Vente, livraison, projets, contact : libellés des boutons alignés sur l’action réelle (« Enregistrer ma demande », etc.) ; `/projets` envoie un dossier.

## 9. SEO (build de production local)

- 46 pages HTML parcourues, aucun lien interne cassé. 404 en `noindex`. Pages légales : `noindex, follow` ; espaces privés : `noindex, nofollow`.
- **Vérification avec `https://onloutou.com` comme origine de test (tour 2)** : build avec `NEXT_PUBLIC_SITE_URL=https://onloutou.com`, serveur local de test. Résultat (`round2/seo-origin.json`) : 27 pages indexables, canonical correct sur chacune ; **27 URLs dans `sitemap.xml`**, toutes sur cette origine, aucune `localhost`, toutes joignables ; ligne `Sitemap:` de `robots.txt` correcte ; pages `noindex` absentes du sitemap ; **5 images de partage distinctes, toutes chargées** ; **18 pages sans `og:image`** (voir §7). Build neutre refait ensuite. Sans domaine défini, canonical/sitemap sont absents par construction (aucun `localhost` en production) : à renseigner avant mise en ligne.
- Lighthouse mobile (émulation, tour 1) : accueil perf 85–87 / accessibilité 100 / bonnes pratiques 100 / SEO 100 ; autres pages testées 88–89 / 96–97 / 100 / 100. Pas de mesure de terrain. Non rejoué au tour 2.
- Cannibalisation possible : `/solutions/location` et `/equipements/vehicules` (location de véhicules) ; `/solutions/geolocalisation`, `/equipements/equipements-connectes`, `/solutions/gestion-de-flotte` (GPS). Une page principale par requête et des liens internes explicites sont recommandés. Positions Google et indexation : non mesurables hors production.

### Préparation SEA

Aucun traceur n’existe. Principe d’attribution unique, gestion de la réponse perdue et du nouvel essai, séparation du clic WhatsApp, interdiction d’envoyer téléphone/e-mail/message à un outil publicitaire : `docs/PREPARATION-MISE-EN-PRODUCTION.md` §3. Preuve de conversion = le dossier réellement enregistré (réponse 201, référence `ONL-…`, un seul `clientRequestId`). **Non prêt à lancer une campagne** : pas de consentement à la mesure, pas de domaine définitif, pas de traceur.

## 10. Preuve backend — compteur

Légende : OK = vérifié de bout en bout depuis l’interface ; N/D = indisponible.

| Page / action | Endpoint | Résultat serveur | Verdict |
|---|---|---|---|
| Contact (6 besoins, GPS inclus) | `POST /requests` | 201 + `ONL-…`, type, nom, téléphone enregistrés | OK |
| Brief location / vente / `/produits` / `/projets` | idem | `RENTAL` / `PURCHASE` / `PURCHASE` / `CUSTOM_PLATFORM` | OK |
| `/livraison` | idem | `DELIVERY` (corrigé au tour 2) | OK |
| `/devenir-partenaire` | idem | `PARTNER_SUPPLIER` | OK |
| `/devenir-livreur` (intérêt) | idem | `PARTNER_DELIVERY` (corrigé au tour 2) | OK |
| Hubs véhicules, motos, camions, outils, connectés (5) | idem | `RENTAL` / `EQUIPMENT_CATALOG` / `PRODUCT` | OK ×5 |
| Double clic, échec avant enregistrement, réponse perdue | idem | même `clientRequestId` → même référence, un dossier | OK |
| Inscription livreur | `POST /auth/register/driver` | dossier `SUBMITTED` | OK |
| Inscription partenaire | `POST /auth/register/partner` | `SUBMITTED` | **OK (UI, tour 2)** |
| Connexion, mauvais mot de passe | `/auth/login` | 401 puis 200 | **OK (UI, tour 2)** |
| Catalogue partenaire → file admin → public (même produit) | `/partner/products`, `/admin/*`, `/catalog/products` | création, soumission, publication, visible publiquement | **OK (UI, tour 2)** |
| Dossier livreur | `/driver/me` | visible de l’admin et du livreur seul | **OK (UI, tour 2)** |
| Admin demandes / candidatures / produits | `/admin/*` | 200 admin, refus des autres comptes | **OK (UI, tour 2)** |
| Droits croisés (2 partenaires, 2 livreurs) | divers | refus ≥ 403, aucune lecture ni modification croisée | **OK (UI, tour 2)** |
| Pièces jointes | `POST` upload | 503 sans stockage ; aucun antivirus | N/D (volontaire) |

**Bilan : 22 parcours sur 22 vérifiés de bout en bout** (13 formulaires + inscription livreur + admin demandes au tour 1 ; inscription partenaire, connexion, catalogue, dossier livreur, admin candidatures, admin produits, droits au tour 2). Les pièces jointes restent hors compteur (désactivées).

## 11. Correctifs du tour 2

| Défaut | Correctif | Fichiers |
|---|---|---|
| E2E pouvaient écrire dans la base de dev | garde-fou avant toute écriture | `tests/e2e-db-guard.ts`, `playwright.forms.config.ts`, `tests/forms-e2e.global-setup.ts`, `backend/scripts/ensure-e2e-admin.ts` |
| Accueil : action sous le bandeau | hero réordonné, deux liens d’action, conteneur ≤ 480 px | `home-hub.ts`, `HomHero.tsx`, `home-redesign.css`, `globals.css` |
| `/livraison` classée comme offre de partenaire | type `DELIVERY`, intérêt livreur `PARTNER_DELIVERY` | `PtnDeliveryForm.tsx`, `PtnDriverInterest.tsx` |
| Téléphone libre accepté | `contactChannelError` | `ptnTypeToApi.ts` + 3 formulaires |
| Titres `/livraison`, `/devenir-livreur` | alignés sur l’action | `delivery-page.ts`, `driver-partner-page.ts` |
| Fiche partenaire non transmissible | bouton « Soumettre pour validation », statuts FR | `PartnerCatalogPanel.tsx` |
| Fiches publiées invisibles sur `/produits` | liste partenaire publique | `PublishedPartnerProducts.tsx`, `ProductsCatalogFuture.tsx` |
| Catalogue public : champs internes exposés | `select` des champs publics | `backend/src/modules/catalog/service.ts` |
| Champs sans libellé associé ; erreurs non annoncées | `htmlFor`/`id`, `role="alert"` | 5 formulaires, 8 composants |
| Tableaux admin illisibles à 320 px | cartes, boutons ≥ 36/44 px, focus visible | `admin.css`, 3 panneaux admin |
| Liens texte trop petits | `a.link-motion` et fil d’Ariane légal à 44 px | `globals.css` |
| `TRUST_PROXY` oui/non | nombre de sauts de confiance | `backend/src/config/env.ts`, `app.ts` |
| `COOKIE_SECURE` absent → non sécurisé | indéfini → sécurisé en production | `backend/src/config/env.ts` |
| Lint parcourait les rapports générés | exclusions, `.gitignore` | `eslint.config.mjs`, `.gitignore` |
| 13 tests obsolètes | réécrits pour le flux « enregistrer d’abord » | voir §6 |

Scripts d’audit ajoutés : `scripts/audit-delivery-types.mjs`, `scripts/audit-home-first-visit.mjs`, `audit-seo-origin.mjs`, `audit-connected-matrix.mjs`, `audit-hit-areas.mjs`, `audit-form-errors.mjs`.

## 12. Tableau de synthèse

| Ce qui fonctionne en local | Ce que Sidney doit vérifier sur son téléphone | Ce qui dépend de la mise en production |
|---|---|---|
| Accueil 320×568 : bouton principal visible au-dessus du bandeau ; demande de location enregistrée avec référence | Bouton entier, bandeau fermable, lien GPS visible ensuite ; menu et « Devenir partenaire » ; saisie avec clavier ouvert ; lisibilité de la référence | Domaine nu ou `www`, redirection 301, `NEXT_PUBLIC_SITE_URL` |
| 22 parcours serveur sur 22, dont 7 connectés en UI (ordinateur + Pixel 5) | Inscription et connexion partenaire/livreur au doigt ; messages d’erreur lisibles | Réglage de `TRUST_PROXY` et test de limitation par visiteur ; compteur partagé si plusieurs instances |
| Canonical, sitemap (27 URLs), `Sitemap:`, 5 images de partage chargées avec `https://onloutou.com` | Aperçu d’un lien partagé sur WhatsApp (après mise en ligne) | Visuel de partage 1200×630 (18 pages sans) ; indexation, positions, performance réelle |
| Tableaux admin en cartes à 320/360 ; clavier ; zoom 200 % à 640 px ; 0 débordement sur 360 mesures publiques et 45 connectées | Admin sur téléphone (boutons faciles à toucher) ; texte agrandi du téléphone | Cookies `Secure` et `__Host-` en HTTPS ; politique de cookies à compléter |
| Pièces jointes bloquées (503) | — | Stockage S3 et antivirus avant toute activation |
| Aucune attribution publicitaire ni traceur | — | Consentement, domaine, outil de mesure : décisions du propriétaire |
