# Formulaires et API — état d’intégration (nov. 2026)

Légende : **Connecté** = `POST /api/v1/requests` ou parcours auth dédié, avec `clientRequestId` (anti-doublon). **WhatsApp seul** = message préparé sans dossier si l’API est absente ou le parcours non branché.

| Parcours | Composant | Page | Endpoint / module | Statut |
|----------|-----------|------|-------------------|--------|
| Contact | `CtcForm` | `/contact` | `POST /requests` (schéma contact) | Connecté |
| Véhicules | `VhpForm` / `VhpContext` | `/equipements/vehicules` | `RENTAL` / `PURCHASE` | Connecté |
| Motos | `MopForm` / `MopContext` | `/equipements/motos` | idem | Connecté |
| Camions & engins | `CmeForm` / `CmeContext` | `/equipements/camions-engins` | `RENTAL` + payload | Connecté |
| Outils & matériel | `TemForm` / `TemContext` | `/equipements/outils-materiels` | `EQUIPMENT_CATALOG` | Connecté |
| Équipements connectés | `CnxForm` / `CnxContext` | `/equipements/equipements-connectes` | `PRODUCT` | Connecté |
| Location (solution) | `RentalBriefBuilder` | `/solutions/location` | `RENTAL` | Connecté |
| Vente | `EquipmentRequestBuilder` | `/solutions/vente` | `PURCHASE` | Connecté |
| Projets plateforme | `PrjBrief` (page `/projets`) ; `ProjectBriefBuilder` (hors page) | `/projets` | `CUSTOM_PLATFORM` | Connecté (audit 06/11/2026 ; auparavant WhatsApp seul) |
| Livraison | `DeliveryRequestBuilder` | aucune (composant non monté ; `/livraison` utilise `PtnDeliveryForm`) | `DELIVERY` | Code seul, non atteignable |
| GPS / géoloc | `Glx*` (showcase) | `/solutions/geolocalisation` | Pas de formulaire dossier | Liens contact / à brancher |
| Aide | sections statiques | `/aide` | N/A | Liens uniquement |
| Candidature partenaire (compte) | `PartnerRegisterForm` | `/espace-partenaire/inscription` | `POST /auth/register/partner` | Connecté |
| Espace partenaire | `PartnerCatalogPanel` | `/espace-partenaire/catalogue` | Catalogue si `APPROVED` | Connecté |
| Proposition partenaire | `PtnProposalForm` | `/devenir-partenaire` | `PARTNER_*` / `OTHER` | Connecté |
| Besoin logistique partenaire | `PtnDeliveryForm` | `/livraison` | `PARTNER_DELIVERY` | Connecté |
| Intérêt livreur | `DriverInterestForm` | `/devenir-livreur` | `OTHER` (candidature) | Connecté |
| Builders legacy (non redesign) | `*RequestBuilder` divers | pages anciennes | — | Souvent WhatsApp seul |

## Comportement commun (demandes connectées)

1. Validation minimale côté client puis **validation Zod** côté API.
2. Enregistrement **avant** affichage de la référence ; texte explicite : demande enregistrée ≠ réservation confirmée.
3. WhatsApp **optionnel ensuite**, avec référence ajoutée au message si enregistrement OK.
4. Échec API : champs conservés, message d’erreur ; WhatsApp éventuel sans dossier clairement indiqué.
5. **`clientRequestId`** : même UUID réutilisé sur retry → une seule ligne en base.

## Pièces jointes

Aucun upload validé (stockage S3 + antivirus). Les hubs camions/outils peuvent mentionner un nom de fichier dans le payload ; **aucun fichier n’est reçu**. Ne pas envoyer de pièces d’identité via WhatsApp.

## Administration

- `/admin/demandes` — liste, détail (message + payload JSON), changement de statut.
- `/admin/candidatures` — décision partenaires / livreurs (parcours auth existant).

## Socle PostgreSQL

- Migrations `express_session` et `clientRequestId` appliquées via `prisma migrate deploy` (install normale, sans contournement test).
- Tests d’intégration : base `onloutou_integration` uniquement ; **`INTEGRATION_ALLOW_MAIN` retiré** du code source (rebuild API si `dist/` obsolète).

## Tests exécutés (session)

| Commande | Résultat |
|----------|----------|
| `npm run db:migrate` | OK (express_session + idempotency) |
| `npm run test:api:integration` | 11/11 |
| `npm run typecheck` | OK |
| `npm run build:api` | OK |
| `npm run build` (Next) | À lancer après changements UI |
| Parcours navigateur manuels | Recommandés (mobile, double clic, panne API) |

## Limitations restantes

- GPS : pas de formulaire commercial dédié branché sur `GPS`.
- Upload documents / scan antivirus non production-ready.
- Inscription livreur **compte** (`/auth/register/driver`) distincte du formulaire d’**intérêt** sur `/devenir-livreur`.
- Anciennes pages builders hors redesign peuvent encore être WhatsApp-only.
- Le site dans son ensemble n’est **pas** annoncé comme entièrement opérationnel tant que ces points et les parcours non testés en navigateur restent ouverts.
