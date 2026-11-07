# Documents confidentiels et stockage S3

## Analyse antivirus (statut)

| Statut | Téléchargement via l’API |
|--------|---------------------------|
| `PENDING` | Refusé (423) |
| `QUARANTINED` | Refusé (423) |
| `REJECTED` | Refusé (423) |
| `CLEAN` | Autorisé si S3 configuré |
| Autre / inconnu | Refusé (423) |

Aucune route publique ne permet à un utilisateur de passer son fichier en `CLEAN`. Tant que le scan antivirus n’est pas branché en production, les fichiers restent en `PENDING` et ne sont pas téléchargeables.

Les tests d’intégration peuvent simuler `CLEAN` **uniquement** en base de test (`NODE_ENV=test`), sans exposer cette possibilité en API.

## Liens signés (bucket privé)

L’endpoint `GET /api/v1/documents/:id/access` renvoie une **URL présignée S3** (AWS SDK `getSignedUrl`), pas un jeton métier à usage unique.

- **Durée** : `120` secondes (`expiresInSeconds` dans la réponse JSON). Constante : `PRIVATE_DOCUMENT_SIGNED_URL_SECONDS` dans le code.
- **Droits** : lecture (`GetObject`) sur la clé du document dans le bucket privé.
- **Expiration** : après la durée configurée, S3/MinIO refuse la requête HTTP ; l’URL peut être **réutilisée plusieurs fois** tant qu’elle n’a pas expiré (comportement standard des URLs présignées).
- **Révocation** : changer le statut du document en base (ex. `REJECTED`) empêche de **nouvelles** URLs ; une URL déjà émise reste valide jusqu’à expiration S3 (fenêtre courte).

Ce n’est **pas** un mécanisme d’usage unique au sens « une seule requête HTTP ». Pour un besoin métier d’usage unique, il faudrait un proxy de téléchargement ou des clés éphémères — non implémenté à ce stade.

## Jetons de réinitialisation de mot de passe

Les jetons de reset sont **distincts** des URLs S3 : hashés en base, expiration 1 h, **usage unique** lors de la confirmation (`usedAt`).
