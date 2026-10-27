# Redirections Apache (LWS) — routes Solutions obsolètes

Ces règles seront intégrées au `.htaccess` de déploiement **après** validation du chemin de publication statique (phase export LWS). Elles ne sont pas actives dans le build Next.js local.

## Contexte

Trois pages Solutions redondantes ont été retirées de l’application (33 routes applicatives). Les URL historiques doivent renvoyer en **301** vers les pages canoniques.

## Règles prévues

```apache
Redirect 301 /solutions/location-equipements /solutions/location
Redirect 301 /solutions/vente-equipements /solutions/vente
Redirect 301 /solutions/geolocalisation-gestion-flotte /solutions/gestion-de-flotte
```

## Notes

- Conserver les ancres côté client si des liens externes pointent encore vers `#vehicules`, `#alertes`, etc. sur les anciennes URL : après redirection, le navigateur conserve en général le fragment ; vérifier au déploiement.
- Ne pas dupliquer ces redirections dans `next.config.ts` (export statique sans serveur Node).
