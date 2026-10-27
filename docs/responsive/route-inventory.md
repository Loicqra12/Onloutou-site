# Inventaire des routes (responsive)

Généré automatiquement depuis `src/app/**/page.tsx` le 2026-10-20.

Total : **33** routes applicatives (+ page 404 via `not-found.tsx`, testée séparément).

| Route | Type | Composants critiques | Interactions | Images | Priorité |
| --- | --- | --- | --- | --- | --- |
| `/` | Accueil | sections/AboutPreviewSection, sections/ContactCtaSection, sections/FleetPreviewSection, sections/HeroSection, sections/InstitutionalLogoBand, sections/HomeEquipmentMosaic | formulaire, hero | — | Critique |
| `/a-propos` | Contenu institutionnel | sections/WestAfricaMap, ui/Button, ui/EditorialNotice, ui/HighlightedText, ui/PageHero, motion/TitleReveal | formulaire, hero | oui | Moyenne |
| `/aide` | Conversion / service | seo/JsonLd, help/HelpArticleList, help/HelpCategoryNavigation, help/HelpCenterHero, help/HelpCenterProvider, help/HelpContactBand | hero, accordéon | — | Critique |
| `/conditions-utilisation` | Juridique | seo/JsonLd, legal/LegalPageHero, legal/LegalTableOfContents, legal/TermsOfUseContent | hero, tableau | — | Haute |
| `/confidentialite` | Juridique | seo/JsonLd, legal/LegalPageHero, legal/LegalTableOfContents, legal/PrivacyPolicyContent | formulaire, hero, tableau | — | Haute |
| `/contact` | Conversion / service | motion/StaggerReveal, ui/ContactChoiceCard, ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/PreparationChecklist | formulaire, hero | — | Critique |
| `/cookies` | Juridique | seo/JsonLd, legal/CookiesPolicyContent, legal/LegalPageHero, legal/LegalTableOfContents | formulaire, hero, tableau | — | Haute |
| `/devenir-livreur` | Partenaires | seo/JsonLd, delivery/DriverCompensationSection, delivery/DriverCriteriaSection, delivery/DriverFutureSpaceSection, delivery/DriverInterestForm, delivery/DriverJourney | formulaire, hero, accordéon | oui | Moyenne |
| `/devenir-partenaire` | Partenaires | seo/JsonLd, partners/BecomePartnerAudiences, partners/BecomePartnerHero, partners/PartnerApplicationBuilder, partners/PartnerReadinessCheck, motion/Reveal | hero, accordéon | oui | Moyenne |
| `/equipements` | Équipements | seo/JsonLd, equipment/ConnectedEquipmentSection, equipment/EquipmentHero, equipment/EquipmentOrientationBand, equipment/EquipmentOrientationTool, equipment/EquipmentProcess | hero, accordéon | oui | Moyenne |
| `/equipements/camions-engins` | Équipements | seo/JsonLd, heavy-equipment/HeavyEquipmentConnectedSection, heavy-equipment/HeavyEquipmentHero, heavy-equipment/HeavyEquipmentProcess, heavy-equipment/HeavyEquipmentProfiles, heavy-equipment/HeavyEquipmentQualificationBand | hero, tableau, accordéon | oui | Moyenne |
| `/equipements/equipements-connectes` | Équipements | seo/JsonLd, equipment/AssetEquipmentExplorer, equipment/ConnectedArchitecture, equipment/ConnectedEquipmentFamilies, equipment/ConnectedEquipmentHero, equipment/ConnectedEquipmentRequestBuilder | hero, tableau, accordéon | oui | Moyenne |
| `/equipements/motos` | Équipements | seo/JsonLd, motion/Reveal, motorcycles/MotorcycleContextCriteria, motorcycles/MotorcycleProcess, motorcycles/MotorcycleProfiles, motorcycles/MotorcycleRequestBuilder | hero, accordéon | oui | Moyenne |
| `/equipements/outils-materiels` | Équipements | seo/JsonLd, equipment/EquipmentFamilyExplorer, equipment/EquipmentInspectionSection, equipment/EquipmentReadinessSection, equipment/EquipmentSelectionMatrix, equipment/ToolsConnectedSection | hero, tableau, accordéon | oui | Moyenne |
| `/equipements/vehicules` | Équipements | seo/JsonLd, motion/Reveal, vehicles/VehicleProfiles, vehicles/VehicleRequestBuilder, vehicles/VehicleSelectionCriteria, vehicles/VehicleSelectionProcess | hero, tableau, accordéon | oui | Moyenne |
| `/espace-livreur` | Prévisualisation espace | seo/JsonLd, driver-portal/DriverModuleMatrix, driver-portal/DriverPortalHero, driver-portal/DriverPortalPreview, driver-portal/DriverPortalSections, ui/ProcessTimeline | hero, tableau, accordéon | — | Critique |
| `/espace-partenaire` | Prévisualisation espace | seo/JsonLd, partner-portal/PartnerModuleMatrix, partner-portal/PartnerPortalHero, partner-portal/PartnerPortalPreview, partner-portal/PartnerPortalSections, ui/ProcessTimeline | hero, tableau, accordéon | — | Critique |
| `/expertise` | Contenu institutionnel | ui/ContactCtaBand, ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ProcessTimeline, ui/SectorCard | hero | — | Moyenne |
| `/livraison` | Conversion / service | seo/JsonLd, delivery/DeliveryAudienceSwitch, delivery/DeliveryDigitalSection, delivery/DeliveryFinalCta, delivery/DeliveryHero, delivery/DeliveryJourney | hero, accordéon | oui | Critique |
| `/mentions-legales` | Juridique | seo/JsonLd, legal/LegalNoticeContent, legal/LegalPageHero, legal/LegalTableOfContents | formulaire, hero, tableau | — | Haute |
| `/partenaires` | Partenaires | seo/JsonLd, partners/CollaborationPath, partners/FuturePartnerSpaces, partners/PartnerInterestBuilder, partners/PartnerProfiles, partners/PartnerRoleSplit | hero, accordéon | oui | Moyenne |
| `/partenaires/fournisseurs` | Partenaires | ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ServiceContactCta | formulaire, hero | — | Moyenne |
| `/partenaires/livreurs` | Partenaires | ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ServiceContactCta | formulaire, hero, tableau | — | Moyenne |
| `/partenaires/technologiques` | Partenaires | ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ServiceContactCta | formulaire, hero | — | Moyenne |
| `/produits` | Conversion / service | seo/JsonLd, products/ProductAccessComparison, products/ProductDeliveryTeaser, products/ProductFamilyShowcase, products/ProductQualitySection, products/ProductSourcingSection | hero, accordéon | oui | Critique |
| `/projets` | Contenu institutionnel | seo/JsonLd, projects/FieldMethodStory, projects/ProjectBriefBuilder, projects/ProjectDeliverables, projects/ProjectDomainsShowcase, projects/ProjectFramingSection | hero, accordéon | oui | Moyenne |
| `/solutions` | Solutions (alias) | ui/AudienceEntryCard, ui/ContactCtaBand, ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ProcessTimeline | formulaire, hero, tableau | — | Moyenne |
| `/solutions/geolocalisation` | Solutions (alias) | seo/JsonLd, geolocation/GeolocationDeployment, geolocation/GeolocationHero, geolocation/GeolocationUseCases, geolocation/FieldInstallationStory, geolocation/HowGeolocationWorks | formulaire, hero, tableau, accordéon | oui | Moyenne |
| `/solutions/gestion-de-flotte` | Solutions (alias) | seo/JsonLd, fleet/FleetCapabilities, fleet/FleetDashboardViews, fleet/FleetDeployment, fleet/FleetManagementHero, fleet/OperationsCommandCenter | hero, tableau, accordéon | oui | Moyenne |
| `/solutions/location` | Solutions (alias) | seo/JsonLd, rental/RentalBriefBuilder, rental/RentalBriefGuide, rental/RentalCategories, rental/RentalDualWorld, rental/RentalHero | hero, accordéon | — | Moyenne |
| `/solutions/plateformes-sur-mesure` | Solutions (alias) | seo/JsonLd, platforms/CustomPlatformHero, platforms/PlatformAdoption, platforms/PlatformDashboardDemo, platforms/PlatformDesignMethod, platforms/PlatformFoundationsBand | formulaire, hero, accordéon | oui | Moyenne |
| `/solutions/securisation-actifs` | Solutions (alias) | ui/EditorialNotice, ui/HighlightedText, ui/PageHero, ui/ServiceContactCta, ui/ServiceFaq, ui/SolutionCrossLinks | formulaire, hero, accordéon | — | Moyenne |
| `/solutions/vente` | Solutions (alias) | seo/JsonLd, sales/BuyOrRentComparison, sales/EquipmentFamilies, sales/EquipmentRequestBuilder, sales/SalesConnected, sales/SalesEnvironment | hero, accordéon | — | Moyenne |
| `404` (not-found) | Erreur | layout/BrandLogo | lien retour | — | Haute |

## Exclusions débordement (scroll horizontal volontaire)

| Sélecteur | Raison |
| --- | --- |
| `.leg-table-wrap` | Tableaux juridiques / cookies |
| `.home-terrain-strip`, `.home-show-track` | Galeries défilantes accueil |
| `.epp-preview__nav ul`, `.epp-products__table-wrap`, `.epp-matrix__wrap` | Prévisualisation partenaire |
| `.edl-matrix__wrap` | Matrice modules livreur |
| `.hlp-nav`, `.hlp-nav__list` | Filtres catégories aide (mobile) |
| `.sales-compare__table-wrap` | Matrice comparaison produits (desktop) |
