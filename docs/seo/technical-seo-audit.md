# Audit SEO technique — ONLOUTOU

Date : 2026-10-19

## État initial

- Métadonnées partielles via `createPageMetadata` sans `metadataBase`.
- `sitemap.ts` : liste incomplète (sous-pages équipements absentes), fallback `https://onloutou.com`, `lastModified` artificiel, `priority` / `changeFrequency` arbitraires.
- `robots.ts` : minimal, sans référence sitemap.
- Canonicals et JSON-LD dépendaient d’un domaine non confirmé (`onloutou.com` en dur).
- Avertissement build `metadataBase` non défini.

## Problèmes détectés

| Problème | Gravité |
| --- | --- |
| Domaine canonique fictif | Bloquant production |
| Sitemap ≠ routes réelles | Élevé |
| Prévisualisations partenaire/livreur indexables | Élevé |
| Pages juridiques : statut noindex OK mais canonical fictif | Moyen |
| Open Graph sans image par défaut | Moyen |
| Pas de tests SEO automatisés | Moyen |

## Corrections réalisées

- Infrastructure `src/lib/seo/` : `site-url.ts`, `metadata.ts`, `routes.ts`, `json-ld.ts`, `constants.ts`.
- `NEXT_PUBLIC_SITE_URL` documenté dans `.env.example` (sans faux domaine).
- `metadataBase`, canonical, sitemap et JSON-LD absolus **uniquement si** l’env est renseignée.
- Sitemap généré depuis `getSitemapPaths()` (30 routes indexables sur 36 à l’audit initial ; **27 sur 33** après consolidation Solutions du 2026-10-20).
- `noindex, follow` : juridique (validation) + `/espace-partenaire` + `/espace-livreur`.
- Layout : Organization + WebSite JSON-LD ; Open Graph / Twitter sans image tant qu’aucun visuel 1200×630 n’est validé.
- Rattrapage 2026-10-20 : `social-metadata.ts`, images OG relatives omises sans origine, carte Twitter `summary`, validation `NEXT_PUBLIC_SITE_URL`, suppression scripts de migration ponctuels.
- Composant `JsonLd` / `JsonLdFromSiteUrl` ; suppression des fallbacks `onloutou.com`.
- Tests Playwright `tests/seo-*.spec.ts` + `npm run test:seo`.

## Architecture retenue

- API Metadata native Next.js uniquement.
- Titres : `%s | ONLOUTOU` (accueil en `title.absolute` sans doublon).
- Classification centralisée dans `routes.ts`.

## Pages indexables (30)

Toutes les routes applicatives sauf : `/mentions-legales`, `/confidentialite`, `/cookies`, `/conditions-utilisation`, `/espace-partenaire`, `/espace-livreur`.

## Pages exclues du sitemap (6)

Idem ci-dessus.

## Open Graph

- **Visuel social ONLOUTOU 1200×630 encore à produire et valider.**
- Le logo `embleme-ovale-onloutou.png` (~1918×820) n’est pas déclaré comme bannière sociale.
- Sans domaine : pas d’`og:image` (évite le warning `metadataBase` et les URL `localhost`).
- Avec domaine : images OG uniquement pour les pages qui fournissent un média explicite (URL absolue construite).
- Twitter : carte `summary` (pas `summary_large_image` tant qu’il n’y a pas de visuel 1200×630 approuvé).
- Pas de compte Twitter/X déclaré.

## Comportement sans domaine configuré

- Pas de `metadataBase`.
- Pas de `alternates.canonical`.
- Pas de `openGraph.url` absolue.
- Pas d’`og:image` ni de `twitter:image`.
- Sitemap vide (`<urlset>` sans `<loc>`).
- Pas de ligne `Sitemap:` dans `robots.txt`.
- Pas de JSON-LD nécessitant une origine absolue (Organization / WebSite / fil d’Ariane).
- Aucune URL `localhost` dans les métadonnées HTML.
- Titres, descriptions et politique `robots` par page inchangés.

## Activation avant production

1. Définir `NEXT_PUBLIC_SITE_URL` avec le domaine officiel (origine `https://`, sans slash final).
2. Produire ou valider une image sociale **1200×630** et renseigner `APPROVED_SOCIAL_OG_IMAGE_PATH` dans `social-metadata.ts`.
3. Relancer `npm run build` (plus de warning `metadataBase` si l’origine est valide).
4. Relancer `npm run test:seo`.
5. Vérifier canonical, sitemap, `robots.txt` et JSON-LD.
6. Déployer seulement après ces contrôles.

## Maillage interne

- Aucune route morte détectée dans header / footer / navigation centralisée (inchangé).
- Sitemap aligné sur l’inventaire `src/app/**/page.tsx`.

## Tests

```bash
npm run test:seo
```

## Limites restantes

- **Domaine canonique à fournir avant mise en production** (`NEXT_PUBLIC_SITE_URL` + rebuild).
- Image Open Graph 1200×630 à valider.
- Pages juridiques : passage en `index` automatique lorsque le statut passera à `validated` / `published` dans le contenu.

## Informations nécessitant validation humaine

- URL publique officielle ONLOUTOU.
- Hébergeur production (mentions légales).
- Image sociale marketing.
