# Pages et sections modifiées — 6 novembre 2026

Document de lecture rapide : **quelle page, quelle section, ce qui a changé, où le voir**. Le détail technique et les mesures sont dans `docs/AUDIT-SITE-ONLOUTOU.md`.

## A. Étape logos et animations (dernier échange)

| Étape | Page | Section | Ce qui a changé | Comment vérifier |
|---|---|---|---|---|
| 1 | **Toutes les pages** (contenu principal) | Tous les accordéons `<details>` (FAQ, critères, étapes) | Ouverture et fermeture **en douceur** (hauteur animée sur 0,28 s). Amélioration progressive : navigateurs sans cette fonction = comportement d’avant ; **aucune animation si « réduire les animations » est activé** | Ouvrir une question de FAQ, par exemple sur `/solutions/location` |
| 2 | `/solutions/geolocalisation` | **Nouvelle section « Références »**, après « Usages » | Logos **Banque Atlantique** et **BNI**, avec le titre « Des références en géolocalisation. » | Défiler jusqu’après les cartes d’usage. Captures : `captures/audit-2026-11-06/round3/geolocalisation-references-{320,desktop}.png` |
| 3 | `/equipements/camions-engins` | **Catégories** (8 cartes) | La carte survolée ou active au clavier met l’image en avant (agrandissement de 6 %, ombre, flèche qui avance) et les autres s’estompent (opacité 0,72). **Les tailles ne changent pas** : hauteurs égales conservées. Contour de focus noir visible au clavier. Sur téléphone : retour visuel à l’appui. Aucun mouvement si « réduire les animations » est activé | Passer la souris ou la touche Tab sur les cartes. Capture : `captures/audit-2026-11-06/round3/camions-engins-categories-survol.png` |
| 4 | `/solutions/geolocalisation` | Étapes du processus, fonctionnalités, usages, références, étapes d’installation, bloc de pilotage | **Apparition douce au défilement** (opacité et glissement de 14 px vers le haut, une seule fois, décalage de 70 ms entre cartes voisines) | Défiler la page ; 25 éléments concernés |
| 4 | `/equipements/camions-engins` | Catégories, cartes de conditions, étapes « Comment ça marche » | Même apparition douce | Défiler la page ; 15 éléments concernés |
| 5 | `/expertise` | Cartes de services, secteurs, étapes de méthode | Apparition douce au défilement (16 éléments) | Défiler la page |
| 5 | `/solutions/securisation-actifs` | Cartes du dispositif, pistes à explorer | Idem (11 éléments) | Défiler la page |
| 5 | `/solutions/plateformes-sur-mesure` | Cartes d’information, liste d’adoption | Idem (8 éléments) | Défiler la page |
| 5 | `/equipements/outils-materiels` | Catégories, propositions, étapes, contrôles | Idem (15 éléments) | Défiler la page |
| 5 | `/partenaires`, `/devenir-partenaire`, `/devenir-livreur`, `/livraison` | Tuiles, cartes et étapes (jamais les formulaires) | Idem (2 à 7 éléments selon la page et la largeur) | Défiler la page |

Pages qui avaient déjà leur propre apparition au défilement et n’ont pas été touchées : accueil, location, vente, produits, projets, flotte, équipements connectés.

Règles de l’étape 4 et 5 : rien n’est masqué sans JavaScript ni avec « réduire les animations » (0 élément masqué mesuré dans ce cas) ; ce qui est déjà visible au chargement n’est jamais masqué ; après un défilement complet, **0 élément reste masqué** (mesuré à 1280 et 320 px). Composant réutilisable : `src/components/motion/PageReveal.tsx` (le sélecteur de la page et les cibles sont passés en paramètres). L’accueil garde son propre mécanisme.

Fichiers : `src/components/motion/PageReveal.tsx` (étape 4, nouveau), `src/styles/trucks-page.css` (étape 3), `src/app/globals.css` (étape 1), `src/components/geolocation/redesign/GlxReferences.tsx` (nouveau), `src/app/solutions/geolocalisation/page.tsx`, `src/styles/geolocation-page.css` (étape 2).

Vérifié : typecheck et lint propres ; pages géolocalisation, location, vente et aide : tests passants ; aucun débordement horizontal à 320 px et en ordinateur ; animation de hauteur observée en navigateur.

### Correction de mon message précédent
J’avais écrit que le site n’avait aucun logo de partenaire. **C’était faux.** Cinq logos existent déjà dans `public/assets/images/logo/logo-partner/` (Banque Atlantique, BNI, ChapeChape Résidence, Orange, Comoé Capital) et sont affichés sur l’**accueil**, section « Des relations qui font partie de notre parcours ». Un composant `InstitutionalLogoBand` existe aussi mais n’est monté sur aucune page. Le logo BNI que vous évoquiez est donc déjà sur l’accueil ; je l’ai ajouté sur la page géolocalisation, où l’accueil l’associe déjà au libellé « Géolocalisation ».

### À confirmer par le propriétaire
- Que Banque Atlantique et BNI acceptent d’être affichées comme références **en géolocalisation** sur une page de service (ce libellé existe déjà sur l’accueil ; la nouvelle page le répète sur une page qui vise à convaincre).
- Les trois autres logos (ChapeChape, Orange, Comoé Capital) ne sont pas reprises ailleurs : leur usage reste celui de l’accueil.

### Non fait, volontairement
- **Accordéon horizontal strict** (cartes qui s’élargissent en réduisant leurs voisines) pour les catégories d’engins : fait en version **sans changement de taille** (étape 3). Un vrai élargissement casserait les hauteurs égales testées et n’existe pas au toucher ; il a été écarté pour cette raison.
- **Visuel de partage 1200×630** : c’est une décision de design (le logo seul n’est pas autorisé comme visuel de partage). Je ne l’ai pas inventé ; 18 pages indexables en sont toujours privées.
- **Illustrations de processus** (location en 4 étapes, livraison) et **bandeau défilant de logos** : pas ajoutés ; avec 5 logos, une grille fixe vaut mieux qu’un défilement.
- **Révélation au défilement** : volontairement absente de `/contact`, des pages légales, de l’aide, des espaces connectés et de l’admin (pages d’usage : on ne retarde pas l’accès à un formulaire ou à une information).
- Effets de type machine à écrire / éditeur de code : déconseillés, voir mon avis précédent.

## B. Audit tour 2 : pages et sections modifiées

| Page | Section | Changement |
|---|---|---|
| `/` (accueil) | Hero | Titre et photos conservés. Sous le titre : bouton **« Faire une demande de location »** (→ `/solutions/location`) et lien **« Équiper ma flotte en GPS »** (→ `/solutions/geolocalisation`). À 320 px, les actions passent avant le paragraphe d’introduction pour rester au-dessus du bandeau cookies |
| Toutes les pages | Bandeau cookies | Plus compact sur petit mobile ; zone tactile du bouton « Gérer les préférences » agrandie |
| `/livraison` | Formulaire et titre SEO | La demande est enregistrée comme **Livraison** (et non plus comme offre de partenaire) ; téléphone ou e-mail validé ; titre « Livraison : présenter votre besoin à ONLOUTOU » |
| `/devenir-livreur` | Formulaire et titre SEO | Intérêt enregistré comme **Partenaire — logistique** ; champ téléphone/e-mail validé ; titre « Livreurs : présenter votre profil à ONLOUTOU » |
| `/devenir-partenaire` | Formulaire | Un texte sans numéro est refusé avec un message clair ; un numéro ivoirien valide est accepté ; la saisie est conservée |
| `/produits` | Catalogue | Les fiches partenaires **publiées** apparaissent sous la note éditoriale (titre, catégorie, description ; jamais l’organisation) ; texte de la note ajusté |
| `/espace-partenaire/inscription`, `/connexion`, `/catalogue` | Formulaires et catalogue | Libellés reliés aux champs ; erreurs annoncées (`role="alert"`) ; **bouton « Soumettre pour validation »**, statuts en français, motif de refus affiché |
| `/espace-livreur/inscription`, `/connexion` | Formulaires | Libellés reliés aux champs ; erreurs annoncées |
| `/admin/demandes`, `/admin/candidatures`, `/admin/produits` | Tableaux | **Cartes lisibles à 320/360 px**, boutons d’action plus grands, focus visible ; mêmes erreurs annoncées |
| `/admin/login` | Formulaire | Erreur annoncée |
| Pages légales | Fil d’Ariane | Zone cliquable de 44 px de haut sur mobile |
| `/produits`, `/solutions/location`, autres pages | Liens texte isolés | Zone cliquable de 44 px de haut sur mobile |
| API (hors pages) | Catalogue public | La liste ne renvoie plus de champs internes |
| API (hors pages) | Proxy et cookies | `TRUST_PROXY` en nombre de sauts ; `COOKIE_SECURE` absent = sécurisé en production |

## C. Pages et documents ajoutés ou mis à jour

- `docs/AUDIT-SITE-ONLOUTOU.md` : rapport complet.
- `docs/PREPARATION-MISE-EN-PRODUCTION.md` : domaine, proxy, mesure publicitaire, cookies.
- `docs/MODIFICATIONS-PAGES-ET-SECTIONS.md` : ce document.
- `scripts/audit-*.mjs` : scripts de mesure rejouables.

## Visuel de partage par défaut (1200 x 630)

- Fichier : public/assets/images/social/onloutou-og-1200x630.jpg (JPEG, ~137 Ko) : photo validée façade + véhicules, logo officiel en haut à gauche, accroche « Location d’équipements / et suivi GPS » (GPS en #F5C400), panneau sombre à gauche.
- Branché via APPROVED_SOCIAL_OG_IMAGE_PATH dans src/lib/seo/social-metadata.ts : appliqué uniquement aux pages sans image OG propre ; les images spécifiques existantes sont inchangées.
- Sans NEXT_PUBLIC_SITE_URL (origine), aucune balise image n'est émise et la carte reste « summary » (comportement testé).
- Aperçus : docs/captures/audit-2026-11-06/round3/og-draft/ (thumb-300.png, thumb-120.png).

## Illustrations des étapes

- Nouveau : src/components/illustrations/StepIllustrations.tsx (SVG décoratifs, aria-hidden, style plat encre + jaune ONLOUTOU, sans promesse ni chiffre).
- « Comment ça marche ? » (/equipements/camions-engins, 4 étapes) : Décrire (fiche + crayon), Étudier (engin + loupe), Proposer (document + validation), Confirmer (clé + coche). Fichier : src/components/trucks/redesign/CmeStatic.tsx.
- « Comment ça se passe ? » (/livraison, 3 étapes) : faisabilité (trajet), conditions (colis + liste), organisation (véhicule + repère). Fichier : src/components/partners/redesign/PtnDelivery.tsx.
- Styles : classe .step-illu en fin de src/app/globals.css.
- Captures : docs/captures/audit-2026-11-06/round3/illustrations/ (desktop et mobile).

### Illustrations des étapes : extension

- /devenir-livreur, bloc « Et ensuite ? » (3 étapes) : étude du profil, échange, modalités. Fichier : src/components/partners/redesign/PtnDriverApply.tsx.
- /partenaires/technologiques, bloc « Notre démarche » (3 étapes, fond noir) : contexte, compatibilité, périmètre. Fichier : src/components/partners/redesign/PtnTech.tsx.
- Les flèches entre étapes du bloc sombre sont masquées quand une illustration est présente.
- Captures : docs/captures/audit-2026-11-06/round3/illustrations/ (livreur-*, tech-*).

## Cohérence des pages Location et Vente

- Hero Location : le texte était collé au bord gauche de la page (largeur 100 % sans marge) ; recentré sur la grille commune (globals.css, fin de fichier).
- Hero Location et Vente : paragraphe de positionnement supprimé (doublon de l'introduction) ; titre h1 harmonisé.
- Titres h2 de ces deux pages harmonisés (jusqu'ici 30 à 54 px selon les sections), sur-titres 11,5 px, introductions 17 px, textes secondaires 14,4 px plus contrastés.
- Vente, bloc Équipements connectés : texte aligné sur la grille, voile plus sombre pour la lisibilité.
- Images floues : attribut sizes corrigé sur les images recadrées de ces pages (quality 86 sur les visuels principaux) ; next.config.ts : variantes minimales 384 px (plus de miniatures servies à 256 px puis agrandies).
- Images manquantes : 3 visuels du dépôt étaient supprimés alors que le code les utilise (ils s'affichaient grâce au cache) ; vehicles/ restaurés depuis Git, chemins camions-engins corrigés vers le dossier camions.
- Captures : docs/captures/audit-2026-11-06/round3/coherence/.


## Refonte visuelle : Location, Vente, Équipements

Captures : `docs/captures/audit-2026-11-06/round4/before/` et `.../after/` (`cote-a-cote.png` = les trois pages à 1440 px).

**Commun** : texte aligné sur la grille de la navigation (départ à 130 px à 1440), titre principal ≤ 3,6 rem, intro 18 px sur 34 rem, bouton principal jaune de 52 px, même rythme entre sections, jaune réservé aux boutons principaux et à quelques mots.

| Page | Ce qui change | Retiré de la page |
|---|---|---|
| `/solutions/location` | Hero photo « véhicules devant le local » (`hom-01-espace-mobilite.webp`), voile sombre côté texte, titre « Louer un véhicule ou du matériel en Côte d’Ivoire », bouton « Faire une demande de location » vers `#demande-location`. Usages terrain, puis 4 étapes illustrées (Décrire, Qualifier, Proposer, Confirmer), formulaire, engagements, FAQ. | Bandeau besoin, catégories, bandeau origines, étapes « Rechercher » et « Accompagner » |
| `/solutions/vente` | Hero scindé avec la photo d’inspection d’un groupe électrogène (distincte d’Équipements), action « Décrire mon besoin d’achat » vers `#demande-equipement`. Section « Trois questions » (usage, fréquence, conditions) et renvoi discret vers la location. | Bandeau de repères, familles, comparaison achat/location, environnement, connecté, processus, services |
| `/equipements` | Gutter aligné sur la navigation, hero plus compact, sélecteur de familles juste après l’intro avec grande photo 16/9, onglets en rangée défilante sur mobile. | Bande des usages, terrain, suivi, processus, confirmations |

**Formulaires** : seulement le CSS (cartes par groupe, libellés lisibles, récapitulatif collant près du bouton d’envoi). Validations, `clientRequestId`, référence ONL-… et WhatsApp après enregistrement inchangés.

**Fichiers** : `src/styles/commerce-pages.css`, `src/components/commerce/CommerceHero.tsx`, `src/components/sales/SalesAdvice.tsx`, `RentalHero/SalesHero/RentalProcess` réécrits, contenus `rental-page.ts` / `sales-page.ts`, `equipment-hub.css`, pages et tests (`rental-page`, `sales-page`, `equipment-page`) mis à jour.