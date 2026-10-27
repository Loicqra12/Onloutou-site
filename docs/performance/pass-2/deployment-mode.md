# Mode d’hébergement — constat pass 2

| Élément | Constat réel | Conséquence |
| --- | --- | --- |
| Mode de build | `npm run build` → App Router, pages **SSG** (pré-rendues) | HTML statique par route dans `.next/` |
| Dossier produit | **`.next/`** (build Next.js) | `npm run build` **ne modifie pas** `dist/` |
| Dossier `dist/` | Site statique **legacy** (index.html, script.js, styles.css du 14/10/2026) | **Référence historique**, pas la sortie du build Next actuel |
| Serveur Node requis | **Oui** pour `next start` et pour `/_next/image` | Export pur `dist` Next **non configuré** (`output: "export"` absent) |
| Optimiseur Next Image | **Oui** avec `next start` ; **non** si seuls les fichiers `dist/` legacy sont servis | Mesures pass 1/2 = mode `next start` |
| `next.config.ts` | Pas de `distDir` custom, pas `images.unoptimized` | Comportement Next par défaut |
| `.openai/hosting.json` | `"static": { "directory": "dist" }` | **Incohérence** avec le build Next → **non modifié** (validation produit requise) |
| Mode mesuré précédemment | `next start` @ 127.0.0.1:3000 | Cohérent avec optimiseur actif |
| Mode qui sera réellement déployé | **À valider** : soit hébergement Node (`next start`/adapter), soit pipeline vers un export statique + CDN images | Choix bloquant pour LCP en production |
| Écart éventuel | Hosting pointe `dist` legacy ; app réelle = Next 16 dans `.next` | Risque de mesurer un mode plus performant que le CDN statique final |

**Décision :** continuer l’optimisation sur **`next start`** (optimiseur actif) **et** produire des **variantes WebP** dans `public/` pour un déploiement statique futur sans `/_next/image`.
