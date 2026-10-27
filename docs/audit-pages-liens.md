# Audit — Pages non terminées & liens (site ONLOUTOU, Next.js 16 App Router)

> Analyse en **lecture seule**. Aucun fichier modifié. Méthode : lecture de chaque `page.tsx` et de ses sources (`src/content`, `src/lib`, `src/components`), extraction automatisée de tous les liens, vérification des ancres, `npm run typecheck` et `npm run build`.

---

## Synthèse (réponse directe)

**Verdict global : le site est techniquement sain et éditorialement complet. Aucune page n'est un stub, un placeholder, un "lorem ipsum" ni un "coming soon" accidentel.**

- `npm run typecheck` → **OK (exit 0)**.
- `npm run build` → **OK (exit 0)** : les **40 routes** (36 pages + `_not-found` + `robots.txt` + `sitemap.xml`) sont prégénérées en statique, sans erreur.
- **463 liens internes** extraits → **0 lien cassé** (toutes les cibles de chemin existent).
- **Toutes les ancres `#...`** référencées entre pages résolvent vers un `id` réel.
- Liens externes : uniquement `wa.me` (WhatsApp), `whatsapp.com` (mentions légales), `schema.org` (contexte JSON-LD, non navigationnel). **Aucun `example.com`, aucun `href="#"` de navigation, aucun placeholder.**

**Ce qui mérite réellement l'attention n'est PAS de l'incomplétude, mais de la redondance et une incohérence de navigation :**

1. **Doublons de solutions (contenu dupliqué / SEO).** Chaque thème « louer / acheter / géoloc+flotte » possède **deux pages indexables distinctes et auto-canoniques** couvrant le même sujet : une page « vitrine » riche et une page « éditoriale » plus légère. Les deux sont dans le `sitemap.xml` et chacune se déclare `canonical` d'elle-même → duplication de contenu non arbitrée.
2. **Incohérence de navigation.** Le hub `/solutions` ne liste que les 5 pages « éditoriales », alors que le méga-menu Solutions pointe majoritairement vers les pages « vitrines » et sous-ancres. L'utilisateur voit deux pages différentes pour le même sujet selon le point d'entrée.
3. **3 fichiers de contenu orphelins (code mort)** — pas des pages, mais à nettoyer.
4. **2 espaces portail** (`/espace-livreur`, `/espace-partenaire`) sont des **aperçus conceptuels assumés** (`noindex`, badge « en préparation ») — complets en tant que prévisualisation, mais sans back-office réel (par design).

Conclusion sur la question initiale : il n'y a **pas de sous-page « pas faite » ou cassée**. Le point faible du projet est la **coexistence de pages doublons** sur `/solutions` et la **divergence des cibles de navigation**, à trancher éditorialement.

---

## A. Tableau récapitulatif de toutes les routes

Statut : **COMPLÈTE** = page construite, contenu réel, liens valides. **À ARBITRER** = complète techniquement mais en doublon/incohérence. **APERÇU (par design)** = prévisualisation assumée, non indexée.

| # | Route | Statut | Justification |
|---|-------|--------|---------------|
| 1 | `/` | COMPLÈTE | 10 sections composées (`src/app/page.tsx`), ancres `#flotte`/`#installation` présentes. |
| 2 | `/a-propos` | COMPLÈTE | 194 lignes, 5 ancres (`about-history/principles/implantation/team/references`) toutes présentes. |
| 3 | `/aide` | COMPLÈTE | Centre d'aide piloté par `help-center.ts` (807 lignes), recherche + FAQ JSON-LD. |
| 4 | `/conditions-utilisation` | COMPLÈTE | `TermsOfUseContent`, contenu `legal.ts`, indexation conditionnelle. |
| 5 | `/confidentialite` | COMPLÈTE | `PrivacyPolicyContent`, `privacy.ts` (245 lignes). |
| 6 | `/contact` | COMPLÈTE | 142 lignes, formulaire + WhatsApp + tel réels. |
| 7 | `/cookies` | COMPLÈTE | `CookiesPolicyContent`, `cookies.ts` (185 lignes). |
| 8 | `/devenir-livreur` | COMPLÈTE | 135 lignes de composition + formulaire d'intérêt. |
| 9 | `/devenir-partenaire` | COMPLÈTE | `PartnerApplicationBuilder`, `become-partner-page.ts`. |
| 10 | `/equipements` | COMPLÈTE | Hub équipements, ancre `#orientation-equipement` présente. |
| 11 | `/equipements/camions-engins` | COMPLÈTE | `trucks-machinery-page.ts` (473 lignes). |
| 12 | `/equipements/equipements-connectes` | COMPLÈTE | `connected-equipment-page.ts` (503 lignes). |
| 13 | `/equipements/motos` | COMPLÈTE | `motorcycles-page.ts` (363 lignes). |
| 14 | `/equipements/outils-materiels` | COMPLÈTE | `tools-equipment-page.ts` (398 lignes). |
| 15 | `/equipements/vehicules` | COMPLÈTE | `vehicles-page.ts` (338 lignes). |
| 16 | `/espace-livreur` | APERÇU (par design) | Portail conceptuel, `robots: noindex` (`ROBOTS_PREVIEW_PORTAL`), nav « en préparation ». Pas de back-office. |
| 17 | `/espace-partenaire` | APERÇU (par design) | Idem portail partenaire, `noindex`, statut `planned/in-development`. |
| 18 | `/expertise` | COMPLÈTE | 139 lignes, ancre `#approche` présente. |
| 19 | `/livraison` | COMPLÈTE | `delivery-page.ts` (514 lignes), ancre `#demande-livraison`. |
| 20 | `/mentions-legales` | COMPLÈTE | `LegalNoticeContent`, `legal.ts`. |
| 21 | `/partenaires` | COMPLÈTE | `partners-page.ts` (459 lignes), ancres `#profils-partenaires`/`#espaces-partenaires`. |
| 22 | `/partenaires/fournisseurs` | COMPLÈTE | `supplierPage` dans `partners-page.ts`. |
| 23 | `/partenaires/livreurs` | COMPLÈTE | Fiche partenaire livreurs. |
| 24 | `/partenaires/technologiques` | COMPLÈTE | Fiche partenaire tech. |
| 25 | `/produits` | COMPLÈTE | `products-page.ts` (548 lignes). Bloc « fiches à venir » = design assumé (voir §B). |
| 26 | `/projets` | COMPLÈTE | `projects-page.ts` (462 lignes), ancres `#brief-projet`/`#domaines-projets`. |
| 27 | `/solutions` | À ARBITRER | Hub complet, mais ne liste que les 5 pages « éditoriales » (voir §E). |
| 28 | `/solutions/geolocalisation` | À ARBITRER (vitrine) | Page riche (131 l.) via composants `geolocation/*`. **Doublon thématique** avec #30 et #29. |
| 29 | `/solutions/geolocalisation-gestion-flotte` | À ARBITRER (éditoriale) | Page légère (83 l.) via `fleet-management.ts`. Canonique du méga-menu « connecter », mais chevauche #28 et #30. |
| 30 | `/solutions/gestion-de-flotte` | À ARBITRER (vitrine) | Page riche (163 l.) via composants `fleet/*`. Doublon thématique. |
| 31 | `/solutions/location` | À ARBITRER (vitrine) | Page riche (89 l.) via composants `rental/*`. **Doublon** de #32. |
| 32 | `/solutions/location-equipements` | À ARBITRER (éditoriale) | Page légère (92 l.) via `solutions/location.ts`. Référencée par le hub. |
| 33 | `/solutions/plateformes-sur-mesure` | COMPLÈTE | Page riche (79 l.), composants `platforms/*`. Pas de doublon. |
| 34 | `/solutions/securisation-actifs` | COMPLÈTE | `solutions/asset-security.ts`. Pas de doublon. |
| 35 | `/solutions/vente` | À ARBITRER (vitrine) | Page riche (106 l.) via composants `sales/*`. **Doublon** de #36. |
| 36 | `/solutions/vente-equipements` | À ARBITRER (éditoriale) | Page légère (60 l.) via `solutions/sale.ts`. Référencée par le hub. |
| — | `not-found.tsx` (404) | COMPLÈTE | Page 404 présente. |

**Aucune ligne « INCOMPLÈTE / stub / vide ».** Les statuts « À ARBITRER » signalent de la redondance, pas de l'inachèvement.

---

## B. Marqueurs d'incomplétude : analyse (tous intentionnels)

Recherche globale de `TODO`, `FIXME`, `lorem`, `placeholder`, `coming soon`, `à venir`, `bientôt`, `WIP`, `href="#"`, `console.log`.

**Aucun `TODO`, `FIXME`, `lorem`, `WIP`, ni `console.log` dans `src`.** Les occurrences trouvées sont toutes légitimes :

| Marqueur | Emplacement | Nature — pourquoi ce n'est PAS un défaut |
|----------|-------------|------------------------------------------|
| `placeholder=` | `HelpSearch.tsx:20`, `HeavyEquipmentRequestBuilder.tsx:106`, `PartnerApplicationBuilder.tsx:261`, `DriverInterestForm.tsx:157`, etc. | Attribut HTML `placeholder` de champs de formulaire réels (texte d'invite), usage normal. |
| `placeholder="—"` | `PartnerProductFormPreview.tsx:34`, `DriverAvailabilityPreview.tsx:15` | Champs **désactivés** d'un aperçu de portail (design « prévisualisation »). |
| `"à venir"` | `products-page.ts:385` « Fiches produit détaillées — à venir » | Choix éditorial **documenté** : aucune route `/produits/[slug]` n'est publiée tant qu'une fiche n'est pas validée (cf. `ProductsCatalogFuture.tsx`). Comportement voulu, pas un vide. |
| `"à venir"` / « en préparation » | `PartnerPortalHero.tsx:12-15` | Libellés de statut du portail partenaire (aperçu assumé). |

### Pages « aperçu » assumées (complètes en tant que prévisualisation)
- `src/app/espace-livreur/page.tsx` et `src/app/espace-partenaire/page.tsx` : rendues `noindex` via `ROBOTS_PREVIEW_PORTAL` (`src/lib/seo/routes.ts:10-14`), signalées « En préparation » dans le méga-menu (`header-navigation.ts:276-279`). Le bouton « Accéder à mon espace » n'apparaît que si `partnerPortalRealUrl` est défini (actuellement `null`) — `PartnerPortalHero.tsx:41-43`. **Dégradation gracieuse correcte**, pas une page cassée.

---

## C. Liens cassés (cible interne inexistante)

**Aucun.**

Extraction automatisée de **463 occurrences** de `href="/..."` / `href: "/..."` dans `src/**/*.{ts,tsx}`. Les 36 chemins distincts référencés correspondent tous à une route existante. Vérification croisée des **ancres** : les 28 identifiants d'ancre inter-pages (`#flotte`, `#installation`, `#about-*`, `#demande-*`, `#profils-partenaires`, `#espaces-partenaires`, `#types-plateformes`, `#exemple-dashboard`, `#roles-interfaces`, `#architecture-fonctionnelle`, `#brief-projet`, `#alertes`, `#iot`, `#engins`, `#outils`, `#vehicules`, `#materiels`, `#outillage`, `#demande`, …) ont tous un `id=` correspondant dans le code.

- `/#flotte` → `id="flotte"` dans `FleetPreviewSection.tsx:36` (section de la home).
- `/#installation` → `id="installation"` dans `HomeInstallationSection.tsx:62`.
- `/partenaires#profils-partenaires` / `#espaces-partenaires` → `partners-page.ts:75` et `:204`.

Les liens « skip » / « back-to-top » (`href="#contenu-principal"` dans `layout.tsx:78`, `href="#hlp-hero-title"` dans `HelpCategoryNavigation.tsx:33`) ciblent des `id` locaux présents et sont des usages d'accessibilité valides.

---

## D. Liens externes douteux / placeholder

**Aucun lien externe de type placeholder (`example.com`, `#`, « TODO », vide).**

| URL externe | Emplacement(s) | Évaluation |
|-------------|----------------|------------|
| `https://wa.me/2250554137777?text=...` | `site.ts:10`, généré par `whatsapp-journeys.ts` / `contact-page.ts` | Valide — numéro WhatsApp réel, messages pré-remplis par parcours. |
| `https://www.whatsapp.com/` et `.../legal/privacy-policy` | `privacy.ts:182-183` | Références légales légitimes. |
| `https://schema.org` | ~40 occurrences (JSON-LD) | **Non navigationnel** — valeur `@context` du balisage structuré. Normal. |
| `https://${trimmed}` | `partner-application.ts:83` | Normalisation d'un site web saisi par le partenaire (ajout du préfixe). Logique, pas un lien en dur. |
| `tel:${site.phoneTel}` | 18 emplacements | Valide — constante téléphone réelle (`+2250554137777`). |

*Content was rephrased for compliance with licensing restrictions.*

---

## E. Pages orphelines & incohérences de navigation

### E.1 Pages orphelines (non liées depuis aucune nav)
**Aucune route totalement orpheline** : l'analyse automatisée confirme que les 36 routes sont référencées par au moins un `href`.

### E.2 Incohérence majeure : hub `/solutions` ≠ méga-menu (le vrai problème)
Il existe **deux familles de pages Solutions** couvrant les mêmes thèmes :

| Thème | Page « vitrine » (riche, composants dédiés) | Page « éditoriale » (légère, `src/content/solutions/*`) |
|-------|---------------------------------------------|----------------------------------------------------------|
| Louer | `/solutions/location` (`rental/*`) | `/solutions/location-equipements` (`location.ts`) |
| Acheter | `/solutions/vente` (`sales/*`) | `/solutions/vente-equipements` (`sale.ts`) |
| Géoloc/Flotte | `/solutions/geolocalisation` + `/solutions/gestion-de-flotte` (`geolocation/*`, `fleet/*`) | `/solutions/geolocalisation-gestion-flotte` (`fleet-management.ts`) |

Divergence des points d'entrée :
- **Hub `/solutions`** (`solutions-hub.ts` → `detailedSolutionPages`) ne liste que les pages **éditoriales** : `location-equipements`, `vente-equipements`, `geolocalisation-gestion-flotte`, `securisation-actifs`, `plateformes-sur-mesure`.
- **Méga-menu** (`header-navigation.ts`) : les en-têtes de groupe pointent vers les pages **vitrines** (`/solutions/location`, `/solutions/vente`) et vers `geolocalisation-gestion-flotte` ; les sous-liens pointent vers `location-equipements#...`, `vente-equipements#...`, `geolocalisation`, `gestion-de-flotte`.

Conséquence : selon qu'on passe par le hub ou par le menu, on atterrit sur **deux pages différentes pour le même sujet**. C'est la source la plus probable de la perception « sous-pages en double / incohérentes ».

### E.3 Duplication de contenu indexable (SEO)
`sitemap.ts` → `getSitemapPaths()` inclut **toutes** les routes indexables (sauf les 2 portails `noindex`). Et `createPageMetadata` (`src/lib/seo/metadata.ts:44`) pose un `canonical` **vers la page elle-même**. Donc `location` et `location-equipements` (idem vente, idem géoloc) sont **chacune auto-canonique et indexée** → contenu quasi-dupliqué sans arbitrage de canonical. Risque de cannibalisation SEO.

### E.4 Fichiers de contenu orphelins (code mort, pas des pages)
Détectés sans aucun import dans `src` :
- `src/content/solutions-page.ts` (144 lignes) — non importé. Vestige probable d'une version antérieure du hub (remplacé par `solutions-hub.ts`).
- `src/content/solutions/custom-platforms.ts` (51 lignes) — non importé (la page plateformes utilise `custom-platforms-page.ts`).
- `src/content/assets.ts` — ré-export `@deprecated` volontaire vers `media.ts` (inoffensif).

---

## F. Résultat du build / typecheck

Environnement : `node_modules` présent, exécution locale réussie.

- **`npm run typecheck` (`tsc --noEmit`)** → **exit 0**, aucune erreur de type.
- **`npm run build` (`next build`, Next.js 16.4.1, Turbopack)** → **exit 0**.
  - « Compiled successfully in 10.7s », TypeScript OK.
  - **40/40 pages statiques générées** sans erreur ni avertissement bloquant.
  - Toutes les routes de la liste officielle apparaissent dans la sortie de build (prérendu statique `○`).

Aucune page cassée au build, aucun import manquant, aucune route dynamique en échec.

---

## G. Synthèse priorisée des actions recommandées

> Recommandations seulement — **rien n'a été implémenté**.

**P1 — Arbitrer les doublons de pages Solutions (impact SEO + UX).**
Pour chaque thème (louer / acheter / géoloc+flotte), choisir **une** page canonique et traiter l'autre, au choix :
- fusionner le contenu dans la page retenue, puis **rediriger** l'URL abandonnée (redirection 308 via `next.config` / `redirects()`), ou
- si l'on garde les deux, poser un **`alternates.canonical`** de la page secondaire vers la principale et la **retirer du sitemap** (adapter `getSitemapPaths`).
Paires concernées : `location` ↔ `location-equipements` ; `vente` ↔ `vente-equipements` ; `geolocalisation` + `gestion-de-flotte` ↔ `geolocalisation-gestion-flotte`.

**P2 — Harmoniser hub `/solutions` et méga-menu.**
Faire pointer `detailedSolutionPages` (`solutions-hub.ts`) et les liens du méga-menu (`header-navigation.ts`) vers **le même** ensemble de pages canoniques par thème, pour que l'utilisateur atterrisse toujours au même endroit.

**P3 — Supprimer le code mort.**
Retirer `src/content/solutions-page.ts` et `src/content/solutions/custom-platforms.ts` (non importés). Le ré-export `assets.ts` peut être conservé (deprecated) ou supprimé après vérification.

**P4 — Clarifier le statut des portails (optionnel).**
`/espace-livreur` et `/espace-partenaire` sont des aperçus volontaires. S'assurer que c'est bien l'intention produit (actuellement `noindex` + « en préparation ») ; sinon, planifier le back-office réel. Aucun correctif requis à court terme.

**P5 — Rien d'autre à corriger côté liens.**
Liens internes, ancres et liens externes sont tous valides ; ne pas y toucher.

---

### Annexe — Méthode & preuves
- Routes dérivées de `src/app/**/page.tsx` (36) + `not-found` + `robots`/`sitemap`.
- Extraction liens : regex `href(=\{?|:\s*)["'`]/...` sur `src/**/*.{ts,tsx}` → 463 occurrences, 36 chemins distincts, 0 hors-route.
- Ancres : jeu de 28 ancres inter-pages, toutes appariées à un `id=` (vérif. `Select-String`).
- Orphelins contenu : pour chaque `src/content/**/*.ts`, recherche d'import `content/<rel>` dans le reste de `src`.
- `typecheck` et `build` exécutés localement, exit 0 tous les deux.
