# Builders « legacy » — parcours publics

Ces composants ne sont **pas** retirés du dépôt : ils servent encore de base contenu ou peuvent être réutilisés. Seuls ceux **montés sur une route publique** comptent pour l’intégration API.

| Composant | Route publique | Statut |
|-----------|----------------|--------|
| `ProductRequestBuilder` | `/produits` | **Connecté** (`PURCHASE` + `BriefContactSave`) |
| `EquipmentRequestBuilder` | `/solutions/vente` | Connecté |
| `RentalBriefBuilder` | `/solutions/location` | Connecté |
| `ProjectBriefBuilder` | `/projets` | Connecté |
| `DeliveryRequestBuilder` | `/livraison` | Connecté |
| `VehicleRequestBuilder` | — (hors `app/`) | Non exposé — WhatsApp seul si réutilisé |
| `MotorcycleRequestBuilder` | — | Non exposé |
| `HeavyEquipmentRequestBuilder` | — | Non exposé |
| `ToolsEquipmentRequestBuilder` | — | Non exposé |
| `ConnectedEquipmentRequestBuilder` | — | Non exposé |
| Hubs redesign (`VhpForm`, `MopForm`, …) | `/equipements/*` | Connectés |

**Justification WhatsApp-only** : les builders non routés restent des maquettes historiques ; le parcours officiel passe par les pages redesign ou `/contact`.
