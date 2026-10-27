# Matrice d’indexation SEO

Généré dans le cadre de l’audit technique SEO (2026-10-19). Source de vérité code : `src/lib/seo/routes.ts`.

**Domaine canonique :** non configuré tant que `NEXT_PUBLIC_SITE_URL` est vide — **domaine canonique à fournir avant mise en production**.

| Route | Type | Indexation | Sitemap | Canonical | Metadata | JSON-LD | Décision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Accueil | index | oui* | si env | oui | Org/WebSite* | Indexable |
| `/solutions` (+ 7 sous-pages canoniques) | Solutions | index | oui* | si env | oui | Breadcrumb/Service* | Indexable |
| `/expertise` | Institutionnel | index | oui* | si env | oui | — | Indexable |
| `/equipements` (+ 5 sous-pages) | Équipements | index | oui* | si env | oui | Breadcrumb* | Indexable |
| `/produits` | Conversion | index | oui* | si env | oui | Breadcrumb* | Indexable |
| `/projets` | Institutionnel | index | oui* | si env | oui | Breadcrumb* | Indexable |
| `/partenaires` (+ 3 sous-pages) | Partenaires | index | oui* | si env | oui | — | Indexable |
| `/devenir-partenaire` | Partenaires | index | oui* | si env | oui | Breadcrumb* | Indexable |
| `/livraison` | Service | index | oui* | si env | oui | Breadcrumb/Service* | Indexable |
| `/devenir-livreur` | Recrutement | index | oui* | si env | oui | Breadcrumb* | Indexable |
| `/a-propos` | Institutionnel | index | oui* | si env | oui | — | Indexable |
| `/contact` | Contact | index | oui* | si env | oui | — | Indexable |
| `/aide` | Support | index | oui* | si env | oui | Breadcrumb + FAQ | Indexable (FAQ visible) |
| `/espace-partenaire` | Prévisualisation | noindex, follow | non | si env | oui | Breadcrumb* | Hors index |
| `/espace-livreur` | Prévisualisation | noindex, follow | non | si env | oui | Breadcrumb* | Hors index |
| `/mentions-legales` | Juridique | noindex, follow | non | si env | oui | Breadcrumb* | awaiting-validation |
| `/confidentialite` | Juridique | noindex, follow | non | si env | oui | Breadcrumb* | awaiting-validation |
| `/cookies` | Juridique | noindex, follow | non | si env | oui | Breadcrumb* | awaiting-validation |
| `/conditions-utilisation` | Juridique | noindex, follow | non | si env | oui | Breadcrumb* | awaiting-validation |
| `404` | Technique | noindex | non | — | oui | — | Non indexable |

\* Sitemap et URL absolues JSON-LD / canonical : uniquement lorsque `NEXT_PUBLIC_SITE_URL` est défini au build.

## Comportement sans domaine configuré

- Pas de canonical, pas de `metadataBase`, pas d’`openGraph.url` absolue.
- Pas d’`og:image` ni de `twitter:image`.
- Sitemap vide ; pas de ligne `Sitemap:` dans `robots.txt`.
- Pas de JSON-LD dépendant d’une origine absolue.
- Aucun fallback `localhost` dans le HTML.
- Titres, descriptions et politique `robots` par page inchangés.

## Activation avant production

1. Définir `NEXT_PUBLIC_SITE_URL` avec le domaine officiel.
2. Produire ou valider une image sociale **1200×630** et renseigner `APPROVED_SOCIAL_OG_IMAGE_PATH` dans `social-metadata.ts`.
3. Relancer `npm run build`.
4. Relancer `npm run test:seo`.
5. Vérifier canonical, sitemap, `robots.txt` et JSON-LD.
6. Déployer seulement après ces contrôles.

## Mise à jour architecture Solutions (2026-10-20)

- Retrait applicatif de `/solutions/location-equipements`, `/solutions/vente-equipements`, `/solutions/geolocalisation-gestion-flotte` (redirections 301 documentées pour LWS).
- **33** routes applicatives, **27** indexables, **6** `noindex` inchangés.

## Visuel social

**Visuel social ONLOUTOU 1200×630 encore à produire et valider.**
