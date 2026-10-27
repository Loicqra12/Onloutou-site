# Espaces plateforme ONLOUTOU (préparation)

Document d’architecture **non implémenté** — sépare les fonctions envisagées, confirmées et à décider. Aucune API ni authentification fictive dans le site public actuel.

## Client (envisagé)

| Fonction | Statut | Notes |
|----------|--------|-------|
| Demandes location / achat | Envisagé | Lien avec catalogue futur |
| Contrats et documents | Envisagé | Périmètre juridique à définir |
| Factures | Envisagé | Intégration comptable à décider |
| Actifs suivis | Confirmé métier | Déjà couvert côté offre GPS |
| Support | Envisagé | Canaux et SLA contractuels |

## Partenaire (envisagé)

| Fonction | Statut | Notes |
|----------|--------|-------|
| Profil et documents | Envisagé | KYC / validation à définir |
| Équipements et disponibilités | Envisagé | Dépend du catalogue produit |
| Demandes qualifiées | Envisagé | Workflow à concevoir |
| Commissions / paiements | À décider | Règles commerciales non publiées |

## Livreur (envisagé)

| Fonction | Statut | Notes |
|----------|--------|-------|
| Missions | Envisagé | Pas de promesse de volume |
| Preuve de remise | Envisagé | Photo, code ou signature — choix produit |
| Itinéraire | Envisagé | Intégration cartographie à décider |

## Administration (envisagé)

| Fonction | Statut | Notes |
|----------|--------|-------|
| Utilisateurs et rôles | Envisagé | RBAC à spécifier |
| Partenaires et équipements | Envisagé | |
| Commandes et livraisons | Envisagé | Hors scope site public Phase 4 |
| Contenus site | Confirmé besoin | CMS ou git — à décider |
| Supervision opérationnelle | Confirmé métier | Lié offre GPS existante |

## Décisions ouvertes

- Modèle de données produit (SKU, stock, prix).
- Paiement en ligne vs hors ligne.
- SSO / auth provider.
- Hébergement des espaces connectés et séparation des environnements.

## Hors scope actuel

Authentification, dashboards, panier, paiement, commande fonctionnelle, administration publique.
