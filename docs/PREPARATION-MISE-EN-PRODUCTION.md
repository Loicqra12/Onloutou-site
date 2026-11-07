# Préparation de la mise en production — points à valider avant déploiement

Document de préparation du 6 novembre 2026. **Rien de ce qui suit n’a été déployé, publié ni activé.** Les vérifications locales sont décrites avec leur commande ; ce qui dépend de l’hébergeur est marqué « à vérifier sur l’hôte ».

## 1. Domaine, canonical, sitemap, image de partage

Le domaine est lu à la **construction** (`NEXT_PUBLIC_SITE_URL`) : il faut reconstruire pour le changer.

Vérification locale avec `https://onloutou.com` comme origine de test :

```
# 1. build avec l’origine de test, serveur sur un port libre (3100)
$env:NEXT_PUBLIC_SITE_URL = "https://onloutou.com"; npm run build
node node_modules/next/dist/bin/next start -p 3100
# 2. audit
$env:BASE_URL = "http://localhost:3100"; $env:ORIGIN = "https://onloutou.com"
node scripts/audit-seo-origin.mjs
# 3. refaire un build neutre (sans la variable) pour le développement local
```

Résultat du 06/11/2026 (`docs/captures/audit-2026-11-06/round2/seo-origin.json`) : 44 pages parcourues, 27 indexables, **27 URLs dans `sitemap.xml`**, toutes sur l’origine choisie, aucune en `localhost`, chacune joignable ; ligne `Sitemap:` de `robots.txt` correcte ; **canonical correct sur les 27 pages indexables** ; pages `noindex` absentes du sitemap ; **5 images de partage distinctes, toutes chargées** (téléchargement et décodage réels).

- **18 pages indexables n’ont aucune `og:image`** : il n’existe pas de visuel de partage 1200×630 validé (`APPROVED_SOCIAL_OG_IMAGE_PATH = null`), et le logo ne doit pas servir de substitut. Une fois le visuel approuvé, renseigner cette constante.
- **À confirmer avant déploiement : domaine nu (`onloutou.com`) ou `www.onloutou.com`.** Choisir un seul, y rediriger l’autre en 301 à l’hébergeur, et utiliser exactement cette valeur dans `NEXT_PUBLIC_SITE_URL`. Ce choix n’est pas tranché ici.

## 2. Limitation de débit derrière un proxy (à vérifier sur l’hôte)

État du code : l’API limite à **30 dépôts de demande / 15 min** et **20 tentatives d’authentification / 15 min** *par adresse IP*, compteurs **en mémoire** (remis à zéro à chaque redémarrage ; non partagés entre instances).

Le navigateur parle au site Next (`/api/v1/*`), qui relaie vers l’API (`next.config.ts`, `rewrites`). L’API voit donc l’adresse du serveur Next, pas celle du visiteur, tant que `TRUST_PROXY` vaut `0` : **tous les visiteurs partagent alors le même compteur**. Constaté pendant l’audit : après 3 séries de tests d’inscription, la 4ᵉ a été refusée jusqu’au redémarrage de l’API.

Changement fait dans le code : `TRUST_PROXY` accepte désormais un **nombre de sauts de confiance** (0 à 5 ; `true` = 1 pour compatibilité) au lieu d’un simple oui/non. Express n’utilise alors que l’entrée `X-Forwarded-For` ajoutée par *votre* infrastructure, pas celles qu’un visiteur peut écrire.

À faire et à vérifier à l’hébergeur :
1. Compter les proxys réellement traversés avant l’API (exemple : répartiteur de la plateforme → Next → API = **2**). Renseigner exactement ce nombre. Trop bas : tous les visiteurs ont l’IP du proxy ; trop haut : l’IP devient falsifiable.
2. Vérifier que la plateforme **remplace** `X-Forwarded-For` (ou n’y ajoute que l’adresse vue) au lieu de transmettre la valeur envoyée par le client.
3. Vérifier que Next transmet bien l’adresse du visiteur à l’API (en-tête `X-Forwarded-For` ajouté par le relais). Sinon, exposer l’API derrière le même répartiteur, sur un chemin dédié.
4. Test à faire en préproduction : depuis deux réseaux différents, envoyer 25 demandes depuis le réseau A puis une depuis le réseau B → B doit passer ; puis envoyer avec un faux `X-Forwarded-For: 1.2.3.4` depuis A → le compteur de A doit continuer à monter.
5. Si plusieurs instances ou redémarrages fréquents : passer à un compteur partagé (base ou Redis) ; sinon la limite n’est qu’indicative.
6. `COOKIE_SECURE` : correction faite pendant l’audit. Une variable absente donnait `false` (le repli sur `NODE_ENV=production` n’était jamais atteint) ; elle donne maintenant « non défini », donc cookies `Secure` en production. Laisser `COOKIE_SECURE=1` explicitement en production.

## 3. Mesure publicitaire (SEA) : attribuer une demande une seule fois

Aucun traceur n’est installé et rien ne doit l’être avant validation du consentement. Principe retenu, à implémenter ensuite :

1. **Le dossier enregistré est la preuve.** Une conversion n’existe que s’il y a un dossier serveur : réponse `201` avec une référence `ONL-…`. Jamais sur un clic de bouton.
2. **Une conversion par `clientRequestId`.** Le navigateur génère l’identifiant avant l’envoi et le renvoie à l’identique en cas de nouvel essai. Le serveur répond avec le même dossier (vérifié : même référence, un seul enregistrement). Cas de la **réponse perdue** : l’utilisateur ou le client renvoie, le serveur renvoie la même référence ; le navigateur n’a donc reçu la référence qu’une fois (au premier succès) et ne déclenche la conversion que si `reference` n’a pas déjà été enregistrée dans l’onglet (`sessionStorage`, clé = référence). Résultat : 0 conversion si aucune réponse n’est jamais reçue, 1 si une réponse finit par arriver, jamais 2.
3. **Rattachement à la campagne au premier enregistrement seulement.** À l’arrivée sur une page avec paramètres de campagne (`utm_*`, identifiant de clic), les conserver dans l’onglet (mémoire ou `sessionStorage`) **uniquement si le visiteur a consenti** à la mesure ; les joindre au `payload` de la première requête acceptée ; les ignorer sur les nouveaux essais (même `clientRequestId`, le serveur conserve la première valeur). Preuve à retenir pour la validation : **le dossier réellement enregistré** (référence, source, date), pas le compteur de l’outil publicitaire.
4. **Le clic WhatsApp est un autre événement** (`whatsapp_click`), compté à part, avec la référence si elle existe. Il ne compte jamais comme demande.
5. **Aucune donnée personnelle vers un outil publicitaire** : ni téléphone, ni e-mail, ni message, ni nom, ni zone libre. Seuls partent : le nom de l’événement, une valeur de catégorie (type de demande), et l’identifiant de clic de la régie. La référence `ONL-…` n’est pas envoyée non plus (elle sert à rapprocher côté ONLOUTOU, dans le dossier).
6. Prérequis non remplis : consentement à la mesure (la bannière dit « aucun cookie de mesure »), domaine définitif, contrat avec la régie.

## 4. Cookies — description factuelle pour validation juridique

Relevé dans le code (`backend/src/app.ts`, `backend/src/middleware/csrf.ts`). Aucun cookie publicitaire ni de mesure d’audience n’est déposé.

| Nom | Rôle | Déposé quand | Durée | Attributs |
|---|---|---|---|---|
| `onloutou.sid` | Session : maintient la connexion d’un partenaire, d’un livreur ou de l’administration ; lie le jeton CSRF à la session | Après récupération d’un jeton CSRF (à l’envoi d’un formulaire qui enregistre ou à une connexion) | 14 jours (cookie persistant) ; supprimé à la déconnexion | `HttpOnly`, `SameSite=Lax`, `Secure` en production, chemin `/` |
| `onloutou.csrf` (local) / `__Host-onloutou.csrf` (production) | Protection contre les envois forgés (jeton double soumission) | En même temps | Session du navigateur (supprimé à la fermeture) | `HttpOnly`, `SameSite=Lax`, `Secure` en production, chemin `/` |

Stockage navigateur (hors cookies, relevé dans le code) : `localStorage`, clé `onloutou-cookie-choice` (le choix fait dans le bandeau, sans date d’expiration) ; `sessionStorage`, clés commençant par `onloutou-` (présélection d’une famille ou d’un mode d’une page à l’autre ; supprimée dès qu’elle est lue, et au plus tard à la fermeture de l’onglet). Aucune saisie de formulaire n’y est stockée (vérifié par les tests de pages : 0 entrée après saisie).

À décider par le propriétaire : ces deux cookies sont strictement nécessaires au service demandé (envoi sécurisé, connexion) ; la politique de cookies doit les nommer et indiquer leur durée. Le jeton CSRF n’est demandé qu’au premier envoi (requête non-GET) : une simple visite, ou la consultation d’une page, ne dépose aucun de ces cookies (vérifié dans le code ; à confirmer sur le site déployé).
