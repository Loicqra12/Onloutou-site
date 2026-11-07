# Déploiement DigitalOcean (préparation — ne pas exécuter sans validation)

## Architecture recommandée

- **Droplet** (Ubuntu 24.04) : reverse proxy Caddy ou Nginx (HTTPS Let’s Encrypt), conteneurs API + Next.js.
- **Managed PostgreSQL** (recommandé) : pas d’exposition publique ; `DATABASE_URL` avec TLS et IP autorisées du Droplet.
- **Spaces** : bucket public (`catalog/…`) et bucket privé (`confidential/…`), clés en variables d’environnement.

## Alternative PostgreSQL sur Droplet

Possible mais vous assumez sauvegardes, mises à jour et durcissement. Non recommandé sans compétence ops.

## Variables production

Voir `.env.example`. `COOKIE_SECURE=1`, `TRUST_PROXY=1`, secrets ≥ 32 caractères, origines exactes.

## Sauvegarde / restauration

- Managed DB : snapshots DigitalOcean + test de restauration sur instance de staging.
- Spaces : versioning activé sur le bucket privé ; procédure documentée de restauration objet par objet.

## HTTPS

Terminaison TLS sur le proxy ; l’API et Next écoutent en HTTP local (`127.0.0.1`).

## Santé

`GET /health` pour le load balancer / monitoring.

Aucune ressource payante n’est créée par ce dépôt automatiquement.
