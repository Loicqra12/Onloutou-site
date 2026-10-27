# Implementation Plan — Navigation ONLOUTOU

> Stack : Next.js 16 App Router · React 19 · Tailwind 4 · TypeScript strict
> Next.js 16 breaking change à retenir : `params`/`searchParams`/`cookies`/`headers` sont
> exclusivement async. Turbopack actif par défaut. `middleware` → `proxy`. Ces pages utilisent
> uniquement des composants Server/Client classiques sans params dynamiques : aucun impact direct.

---

## Résultats de l'exploration

| Fichier | Constat |
|---------|---------|
| `src/types/navigation.ts` | `MegaMenuLayout` = 4 valeurs. `NavVisual` sans title/subtitle. `NavGroup` sans iconId. |
| `src/app/globals.css` | Bug confirmé : `.site-header-utility` a `min-height: 36px` SANS `overflow: hidden` → `max-height: 0` ne compresse pas la barre. Aussi : `.site-header-utility-phone:focus-visible` a `outline: none` sans remplacement visible. |
| `src/content/header-navigation.ts` | Solutions : 4 groupes (louer, acheter, connecter, construire). Equipements : 1 groupe plat (7 items). Expertise : 1 groupe « domaines » avec 2 liens cassés (`/#installation`, `/#flotte`). Projets : cards, toutes à `/projets#domaines-projets`. Partenaires : 1 groupe de 14 items avec doublons. À propos : 1 groupe de 7 items. |
| `src/components/layout/SiteHeader.tsx` | `openDesktop` hardcode `setActiveFamily("louer")` uniquement si `id === "solutions"`. |
| `src/components/sections/HomeInstallationSection.tsx` | `id="installation"` existe **sur la page d'accueil** (`/`), pas sur `/expertise`. |
| `src/components/projects/ProjectDomainsShowcase.tsx` | `id="domaines-projets"` (depuis `projectsDomains.id`). Les onglets mobilité/supervision sont des tabpanels à ID générés dynamiquement — pas d'ancre URL directe. |
| `src/components/projects/ProjectBriefBuilder.tsx` | `id="brief-projet"` ✓ |
| `src/app/expertise/page.tsx` | Section prestations : aucun id. Section tenderSection (appels d'offres) : aucun id. `ProcessTimeline` : `id="approche"`. |

---

## Ordre d'implémentation recommandé

L'ordre est dicté par les dépendances TypeScript. Toute erreur de type dans les nouvelles
valeurs de layout casserait la compilation avant même d'arriver au contenu.

---

- [ ] 1. **Étendre `src/types/navigation.ts`**

  Ajouter au type `MegaMenuLayout` les 5 nouvelles valeurs :
  `"columns-3-visual" | "grid-icon-visual" | "two-col-visual-footer" | "three-col-flat" | "two-col-visual"`

  Ajouter à `NavVisual` : `title?: string; subtitle?: string`

  Ajouter à `NavGroup` : `iconId?: string`

  Files: `src/types/navigation.ts`
  Verify: `npm run typecheck` — aucune erreur TypeScript.

---

- [ ] 2. **Corriger le bug CSS barre utilitaire dans `src/app/globals.css`**

  Sur `.site-header-utility` :
  - Retirer `min-height: 36px`
  - Ajouter `overflow: hidden`
  - Ajouter `max-height: 48px` (état par défaut, avant scroll)
  - Ajouter `max-height` à la liste des propriétés de `transition`

  Sur `.site-header-utility-inner` :
  - Réduire `min-height` de 36px à 28px (le téléphone est retiré — voir item 7)
  - Réduire `padding-block` de `0.35rem` à `0.25rem`

  Sur `.site-header-utility-phone:focus-visible` et `.site-header-utility-whatsapp:focus-visible` :
  - Retirer `outline: none` — la règle globale `:focus-visible { outline: 2px solid #f5c400 }` prendra effet

  Sur `.site-header-utility-phone, .site-header-utility-whatsapp` (taille des liens) :
  - Réduire `min-height: 32px` → `min-height: 28px`

  Files: `src/app/globals.css`
  Verify: `npm run build` réussit. Visuellement : barre jaune absente (hauteur 0) lors du scroll vers le bas, réapparaît au retour en haut.

---

- [ ] 3. **Séparer les états interactifs dans `src/app/globals.css`**

  Objectif : `is-active` = soulignement jaune, `is-open` = fond éclairci, hover/focus = couleur jaune seule.

  Modifier le sélecteur couleur — retirer `is-open` du groupe partagé :
  ```css
  /* avant */
  .site-nav-link:hover,
  .site-nav-trigger:hover,
  .site-nav-link.is-active,
  .site-nav-trigger.is-active,
  .site-nav-trigger.is-open {
    color: #f5c400;
  }
  /* après : is-open séparé */
  .site-nav-link:hover,
  .site-nav-trigger:hover,
  .site-nav-link.is-active,
  .site-nav-trigger.is-active {
    color: #f5c400;
  }
  .site-nav-trigger.is-open {
    color: rgba(245, 245, 239, 0.88); /* couleur de base, pas jaune */
    background: rgba(255, 255, 255, 0.08);
    border-radius: 6px;
  }
  ```

  Modifier le sélecteur `::after` — retirer `is-open` du scaleX(1) :
  ```css
  /* avant */
  .site-nav-link:hover::after,
  .site-nav-link.is-active::after,
  .site-nav-trigger:hover::after,
  .site-nav-trigger.is-active::after,
  .site-nav-trigger.is-open::after {
    transform: scaleX(1);
  }
  /* après : is-open n'active plus le trait */
  .site-nav-link:hover::after,
  .site-nav-link.is-active::after,
  .site-nav-trigger:hover::after,
  .site-nav-trigger.is-active::after {
    transform: scaleX(1);
  }
  ```

  Ajouter la règle manquante pour la famille active dans Solutions :
  ```css
  .mega-column.is-active .mega-column-title {
    color: #f5c400;
  }
  .mega-column.is-active .mega-column-title::after {
    /* soulignement discret comme indicateur de sélection */
    content: "";
    display: block;
    height: 2px;
    background: #f5c400;
    margin-top: 2px;
    border-radius: 1px;
  }
  ```

  Files: `src/app/globals.css`
  Verify: `npm run build` réussit.

---

- [ ] 4. **Ajouter les styles CSS des nouveaux layouts dans `src/app/globals.css`**

  Ajouter ces blocs CSS dans la section SITE HEADER (après `.mega-card-copy`) :

  **columns-3-visual** (Solutions restructuré — 3 colonnes + visuel) :
  ```css
  .mega-grid--3col {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
  .mega-columns--3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem 2rem;
  }
  ```

  **grid-icon-visual** (Équipements — grille icon + visuel) :
  ```css
  .mega-grid--icon-visual {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
  .mega-icon-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem 2rem;
    align-items: start;
  }
  .mega-icon-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .mega-icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(245, 196, 0, 0.12);
    color: #f5c400;
    flex-shrink: 0;
    margin-bottom: 0.25rem;
  }
  ```

  **two-col-visual-footer** (Expertise — 2 groupes côte à côte + visuel + footer CTA) :
  ```css
  .mega-grid--two-visual {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
  .mega-two-col {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem 2.5rem;
    align-items: start;
  }
  ```

  **three-col-flat** (Partenaires — 3 groupes, pas de visuel) :
  ```css
  .mega-three-flat {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem 2.5rem;
    align-items: start;
  }
  ```

  **two-col-visual** (À propos — 2 groupes + visuel compact) :
  ```css
  .mega-two-groups-col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  ```

  **MegaMenuVisual title/subtitle** :
  ```css
  .mega-visual-title {
    margin: 0.75rem 0 0.2rem;
    color: #ffffff;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .mega-visual-subtitle {
    margin: 0;
    color: #b8b4ab;
    font-size: 0.8rem;
    line-height: 1.5;
  }
  ```

  Files: `src/app/globals.css`
  Verify: `npm run build` réussit.

---

- [ ] 5. **Mettre à jour `AnnouncementBar.tsx` — retirer le téléphone**

  Retirer le `<a href={tel:...}>` et le `<span>` séparateur `.site-header-utility-sep`.
  Garder uniquement : `<span class="site-header-utility-location">` + `<a class="site-header-utility-whatsapp">`.

  La `<p class="site-header-utility-meta">` ne contiendra plus que l'élément location.
  Le lien WhatsApp reste séparé côté droit.

  Structure simplifiée :
  ```tsx
  <div className="site-header-utility">
    <div className="site-header-utility-inner">
      <span className="site-header-utility-location">{headerUtility.location}</span>
      <a href={headerUtility.whatsappUrl} className="site-header-utility-whatsapp" ...>
        WhatsApp
      </a>
    </div>
  </div>
  ```

  Supprimer aussi `phoneDisplay` et `phoneTel` de la déstructuration de `headerUtility`
  (les propriétés restent dans `header-navigation.ts` pour d'autres usages — footer, etc.).

  Files: `src/components/layout/AnnouncementBar.tsx`
  Verify: `npm run typecheck && npm run build` — aucune erreur.

---

- [ ] 6. **Mettre à jour `MegaMenuVisual.tsx` — ajouter title et subtitle**

  Après le `<div className="mega-visual-frame">`, ajouter avant le `caption` :
  ```tsx
  {visual.title ? <p className="mega-visual-title">{visual.title}</p> : null}
  {visual.subtitle ? <p className="mega-visual-subtitle">{visual.subtitle}</p> : null}
  ```
  Si `visual.title` est présent, ne pas afficher `visual.caption` (title remplace caption).
  Si seulement `caption` est présent, comportement actuel maintenu.

  Files: `src/components/navigation/MegaMenuVisual.tsx`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 7. **Ajouter les nouveaux renderers dans `MegaMenu.tsx`**

  Ajouter un helper `NavGroupIcon` inline dans le fichier (avant le composant `MegaMenu`) :
  ```tsx
  function NavGroupIcon({ iconId }: { iconId?: string }) {
    // Inline SVG par iconId. Valeurs gérées : "car", "bike", "truck", "gear", "signal"
    // Chaque path est un outline 24×24 stroke-based (style du projet PlatformIcons.tsx)
    if (!iconId) return null;
    const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
                     stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true };
    switch (iconId) {
      case "car":   return <svg {...common}><path d="M3 17h18M5 17V9l2-4h10l2 4v8M9 13h6"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>;
      case "bike":  return <svg {...common}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h4l2 4M14 9l2 4"/></svg>;
      case "truck": return <svg {...common}><rect x="1" y="8" width="13" height="9" rx="1"/><path d="M14 10h4l3 3v4h-7V8"/><circle cx="5" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>;
      case "gear":  return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6"/></svg>;
      case "signal":return <svg {...common}><path d="M2 12a10 10 0 0 1 10-10M6 12a6 6 0 0 1 6-6M10 12a2 2 0 0 1 2-2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>;
      default:      return <svg {...common}><circle cx="12" cy="12" r="7"/></svg>;
    }
  }
  ```

  Ajouter les 5 blocs layout dans le JSX de `MegaMenu`, après le bloc `cards` existant :

  **columns-3-visual** :
  ```tsx
  {menu.layout === "columns-3-visual" ? (
    <div className="mega-grid mega-grid--3col">
      <div className="mega-columns--3">
        {menu.groups.map((group) => (
          <div key={group.id}
            className={`mega-column${activeFamily === group.id ? " is-active" : ""}`}
            onPointerEnter={() => onFamilyChange(group.id)}
            onFocusCapture={() => onFamilyChange(group.id)}
          >
            {group.href
              ? <Link href={group.href} className="mega-column-title" prefetch={false} onClick={onNavigate}>{group.title}</Link>
              : <p className="mega-column-title">{group.title}</p>}
            {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
            <ul className="mega-list">
              {group.items.map((e, i) => <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />)}
            </ul>
          </div>
        ))}
      </div>
      {currentVisual && menu.visuals
        ? <div className="mega-visual-stack" aria-live="polite">
            {Object.entries(menu.visuals).map(([id, visual]) => (
              <div key={id} className={`mega-visual-layer${id === activeFamily ? " is-current" : ""}`}>
                <MegaMenuVisual visual={visual} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        : currentVisual ? <MegaMenuVisual visual={currentVisual} onNavigate={onNavigate} /> : null}
    </div>
  ) : null}
  ```

  **grid-icon-visual** :
  ```tsx
  {menu.layout === "grid-icon-visual" ? (
    <div className="mega-grid mega-grid--icon-visual">
      <div className="mega-icon-grid">
        {menu.groups.map((group) => (
          <div key={group.id} className="mega-icon-group">
            <span className="mega-icon-badge"><NavGroupIcon iconId={group.iconId} /></span>
            {group.href
              ? <Link href={group.href} className="mega-column-title" prefetch={false} onClick={onNavigate}>{group.title}</Link>
              : <p className="mega-column-title">{group.title}</p>}
            {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
            <ul className="mega-list">
              {group.items.map((e, i) => <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />)}
            </ul>
          </div>
        ))}
      </div>
      {menu.visual ? <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} /> : null}
    </div>
  ) : null}
  ```

  **two-col-visual-footer** :
  ```tsx
  {menu.layout === "two-col-visual-footer" ? (
    <div className="mega-grid mega-grid--two-visual">
      <div>
        <div className="mega-two-col">
          {menu.groups.map((group) => (
            <div key={group.id}>
              <p className="mega-column-title">{group.title}</p>
              <ul className="mega-list">
                {group.items.map((e, i) => <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />)}
              </ul>
            </div>
          ))}
        </div>
        {menu.footerCta
          ? <Link href={menu.footerCta.href} className="mega-overview" prefetch={false} onClick={onNavigate}>
              <span>{menu.footerCta.label}</span>
              <span aria-hidden className="mega-cta-arrow">↗</span>
            </Link>
          : null}
      </div>
      {menu.visual ? <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} /> : null}
    </div>
  ) : null}
  ```

  **three-col-flat** :
  ```tsx
  {menu.layout === "three-col-flat" ? (
    <div className="mega-three-flat">
      {menu.groups.map((group) => (
        <div key={group.id}>
          <p className="mega-column-title">{group.title}</p>
          <ul className="mega-list mega-list--wide">
            {group.items.map((e, i) => <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />)}
          </ul>
        </div>
      ))}
    </div>
  ) : null}
  ```

  **two-col-visual** :
  ```tsx
  {menu.layout === "two-col-visual" ? (
    <div className="mega-grid mega-grid--split">
      <div className="mega-two-groups-col">
        {menu.groups.map((group) => (
          <div key={group.id}>
            <p className="mega-column-title">{group.title}</p>
            <ul className="mega-list mega-list--wide">
              {group.items.map((e, i) => <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />)}
            </ul>
          </div>
        ))}
        {menu.overviewHref
          ? <Link href={menu.overviewHref} className="mega-overview" onClick={onNavigate}>
              <span>{menu.overviewLabel ?? "En savoir plus"}</span>
              <span aria-hidden className="mega-cta-arrow">↗</span>
            </Link>
          : null}
      </div>
      {menu.visual
        ? <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} compact />
        : null}
    </div>
  ) : null}
  ```

  Files: `src/components/navigation/MegaMenu.tsx`
  Verify: `npm run typecheck && npm run build` — aucune erreur TypeScript ni de build.

---

- [ ] 8. **Corriger `SiteHeader.tsx` — reset activeFamily dynamique**

  Dans `openDesktop`, remplacer le hardcode `if (id === "solutions") setActiveFamily("louer")` par :
  ```tsx
  const item = headerNavigation.find(i => i.id === id && i.type === "menu");
  if (item?.type === "menu" && item.menu.defaultVisual) {
    setActiveFamily(item.menu.defaultVisual);
  }
  ```
  Cela lit `defaultVisual` depuis les données au lieu de coder en dur `"louer"`.

  Files: `src/components/layout/SiteHeader.tsx`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 9. **Restructurer le menu Solutions dans `header-navigation.ts`**

  Remplacer les 4 groupes (louer, acheter, connecter, construire) par 3 groupes :

  ```ts
  // Groupe 1 : Équiper
  {
    id: "equiper",
    title: "Équiper",
    description: "Location, vente et sélection d'équipements.",
    href: "/equipements",
    items: [
      { type: "link", label: "Location de véhicules", href: "/solutions/location#vehicules" },
      { type: "link", label: "Location de camions et engins", href: "/solutions/location#camions" },
      { type: "link", label: "Location d'équipements", href: "/solutions/location#outils" },
      { type: "link", label: "Vente d'équipements", href: "/solutions/vente" },
      { type: "link", label: "Explorer le catalogue", href: "/equipements" },
    ],
  }
  // Groupe 2 : Connecter & piloter
  {
    id: "connecter",
    title: "Connecter & piloter",
    description: "Géolocalisation, flotte, alertes et supervision.",
    href: "/solutions#connecter-piloter",
    items: [
      { type: "link", label: "Géolocalisation", href: "/solutions/geolocalisation" },
      { type: "link", label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
      { type: "link", label: "Alertes et géozones", href: "/solutions/geolocalisation#alertes" },
      { type: "link", label: "Supervision des actifs", href: "/solutions/securisation-actifs" },
      { type: "link", label: "Tableaux de bord", href: "/solutions/gestion-de-flotte#tableaux-de-bord" },
    ],
  }
  // Groupe 3 : Construire
  {
    id: "construire",
    title: "Construire",
    description: "Plateformes Web, mobile et outils métier.",
    href: "/solutions/plateformes-sur-mesure",
    items: [
      { type: "link", label: "Plateformes Web et mobile", href: "/solutions/plateformes-sur-mesure#types-plateformes" },
      { type: "link", label: "Applications métier", href: "/solutions/plateformes-sur-mesure#roles-interfaces" },
      { type: "link", label: "Intégrations", href: "/solutions/plateformes-sur-mesure#architecture-fonctionnelle" },
      { type: "link", label: "Préparer un projet", href: "/solutions/plateformes-sur-mesure#brief-projet" },
    ],
  }
  ```

  Mettre à jour `visuals` avec les 3 nouvelles clés (equiper, connecter, construire).
  Adapter les images : equiper → mobilityImage, connecter → supervisionImage, construire → digitalImage.
  Mettre `defaultVisual: "equiper"`.
  Changer `layout` en `"columns-3-visual"`.

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 10. **Restructurer le menu Équipements dans `header-navigation.ts`**

  Remplacer le groupe plat unique par 5 groupes avec `iconId` et `description` :

  ```ts
  layout: "grid-icon-visual",
  groups: [
    { id: "vehicules", iconId: "car",    title: "Véhicules professionnels",
      description: "Utilitaires, berlines, 4×4", href: "/equipements/vehicules",
      items: [
        { type: "link", label: "Véhicules en location", href: "/solutions/location#vehicules" },
        { type: "link", label: "Véhicules à la vente", href: "/solutions/vente#vehicules" },
      ] },
    { id: "motos",     iconId: "bike",   title: "Motos et deux-roues",
      description: "Livraison et déplacements terrain", href: "/equipements/motos",
      items: [
        { type: "link", label: "Motos professionnelles", href: "/equipements/motos" },
      ] },
    { id: "camions",   iconId: "truck",  title: "Camions et engins",
      description: "Transport lourd, BTP, chantier", href: "/equipements/camions-engins",
      items: [
        { type: "link", label: "Camions et utilitaires lourds", href: "/solutions/location#camions" },
        { type: "link", label: "Engins de chantier", href: "/equipements/camions-engins" },
      ] },
    { id: "outils",    iconId: "gear",   title: "Outils et matériels",
      description: "Outillage professionnel", href: "/equipements/outils-materiels",
      items: [
        { type: "link", label: "Matériels professionnels", href: "/solutions/vente#outils" },
        { type: "link", label: "Outillage", href: "/equipements/outils-materiels" },
      ] },
    { id: "connectes", iconId: "signal", title: "Équipements connectés",
      description: "GPS, trackers, IoT", href: "/equipements/equipements-connectes",
      items: [
        { type: "link", label: "Trackers et boîtiers GPS", href: "/equipements/equipements-connectes" },
        { type: "link", label: "Orienter ma demande", href: "/equipements#orientation-equipement" },
      ] },
  ],
  ```

  Conserver le `visual` existant (`equipmentMenuImage`).
  Retirer `overviewLabel` / `overviewHref` répétitifs (déjà couverts par les items).

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 11. **Restructurer le menu Expertise dans `header-navigation.ts`**

  Remplacer le groupe « domaines » (1 groupe, 6 items, liens cassés) par 2 groupes :

  ```ts
  layout: "two-col-visual-footer",
  groups: [
    {
      id: "preparer",
      title: "Préparer & déployer",
      items: [
        { type: "link", label: "Déploiement terrain", href: "/expertise#approche" },
        { type: "link", label: "Installation et paramétrage", href: "/expertise#installation" },
        { type: "link", label: "Ingénierie matérielle", href: "/expertise" },
        { type: "link", label: "Mise en service", href: "/expertise#approche" },
      ],
    },
    {
      id: "exploiter",
      title: "Exploiter & accompagner",
      items: [
        { type: "link", label: "Supervision et reporting", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Formation", href: "/expertise#formation" },
        { type: "link", label: "Support et maintenance", href: "/expertise" },
      ],
    },
  ],
  footerCta: { label: "Appels d'offres et projets structurés", href: "/projets" },
  ```

  Conserver le `visual` existant (`expertiseImage`) et `overviewHref: "/expertise"`.

  **Liens corrigés** : les anciens `/#installation` → `/expertise#installation` et `/#flotte` → `/solutions/gestion-de-flotte`. Aucun lien n'est rejeté vers l'accueil.

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 12. **Corriger les ancres du menu Projets dans `header-navigation.ts`**

  Mettre à jour les `href` des cards :
  - mobilite : `/projets#mobilite` (au lieu de `/projets#domaines-projets`)
  - supervision : `/projets#supervision` (au lieu de `/projets#domaines-projets`)
  - numerique : `/projets#brief-projet` (déjà correct, conserver)

  Conserver le layout `"cards"`.

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 13. **Restructurer le menu Partenaires dans `header-navigation.ts`**

  Remplacer le groupe unique (14 items, doublons) par 3 groupes ciblés :

  ```ts
  layout: "three-col-flat",
  groups: [
    {
      id: "collaborer",
      title: "Collaborer",
      items: [
        { type: "link", label: "Vue d'ensemble", href: "/partenaires" },
        { type: "link", label: "Devenir partenaire", href: "/devenir-partenaire" },
        { type: "link", label: "Présenter une proposition", href: "/devenir-partenaire" },
        { type: "link", label: "Livraison et coordination", href: "/livraison" },
      ],
    },
    {
      id: "profils",
      title: "Les profils",
      items: [
        { type: "link", label: "Fournisseurs", href: "/partenaires/fournisseurs" },
        { type: "link", label: "Livreurs", href: "/partenaires/livreurs" },
        { type: "link", label: "Technologiques", href: "/partenaires/technologiques" },
        { type: "link", label: "Profils de collaboration", href: "/partenaires#profils-partenaires" },
      ],
    },
    {
      id: "espaces",
      title: "Vos futurs espaces",
      items: [
        { type: "info", label: "Espace partenaire", note: "En préparation — aperçu conceptuel." },
        { type: "info", label: "Espace livreur", note: "En préparation — aperçu conceptuel." },
      ],
    },
  ],
  ```

  Retirer le `visual` du menu Partenaires (layout `three-col-flat` n'en a pas).
  Conserver `overviewHref: "/partenaires"`.

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 14. **Restructurer le menu À propos dans `header-navigation.ts`**

  Remplacer le groupe unique (7 items) par 2 groupes :

  ```ts
  layout: "two-col-visual",
  groups: [
    {
      id: "entreprise",
      title: "L'entreprise",
      items: [
        { type: "link", label: "Notre histoire", href: "/a-propos#about-history" },
        { type: "link", label: "Notre approche", href: "/a-propos#about-principles" },
        { type: "link", label: "Présence régionale", href: "/a-propos#about-implantation" },
        { type: "link", label: "Équipe et compétences", href: "/a-propos#about-team" },
        { type: "link", label: "Références historiques", href: "/a-propos#about-references" },
      ],
    },
    {
      id: "contact-aide",
      title: "Contact & aide",
      items: [
        { type: "link", label: "Nous contacter", href: "/contact" },
        { type: "link", label: "Centre d'aide", href: "/aide" },
      ],
    },
  ],
  ```

  Conserver `visual` (`facadeImage`) et `overviewHref: "/a-propos"`.

  Files: `src/content/header-navigation.ts`
  Verify: `npm run typecheck` — aucune erreur.

---

- [ ] 15. **Ajouter les ancres dans `src/app/expertise/page.tsx`**

  Sur la section des types de prestations (actuellement `<section className="section-spacing bg-brand-paper">`), ajouter `id="installation"` et `className="... scroll-mt-28"`.

  Sur la section des appels d'offres/tenderSection (actuellement `<section className="section-spacing bg-brand-charcoal text-white">`), ajouter `id="formation"` et `className="... scroll-mt-28"`.

  Aucune création de nouvelle section — les ID s'appliquent aux sections existantes les plus pertinentes :
  - `#installation` → section listant "Installation", "Configuration GPS", "Mise en service"
  - `#formation` → section tenderSection qui mentionne "Formation" dans ses points et correspond au bloc "structuré" auquel appartient la formation dans le processus ONLOUTOU

  Files: `src/app/expertise/page.tsx`
  Verify: `npm run build` réussit. `curl -s http://localhost:3000/expertise | grep -c 'id="installation"'` retourne `1`.

---

- [ ] 16. **Ajouter les ancres dans `src/app/projets/page.tsx`**

  Avant `<ProjectDomainsShowcase />`, ajouter deux `<div>` avec ancres :
  ```tsx
  <div id="mobilite" className="scroll-mt-28" />
  <div id="supervision" className="scroll-mt-28" />
  <ProjectDomainsShowcase />
  ```

  Note : mobilité et supervision sont deux onglets du même composant `ProjectDomainsShowcase`
  (id `domaines-projets`). Les ancres distinctes permettent la navigation depuis le menu, mais
  scrollent toutes les deux au même composant — comportement attendu et honnête. Si une activation
  d'onglet par hash URL est souhaitée plus tard, cela est un scope séparé.

  Files: `src/app/projets/page.tsx`
  Verify: `npm run build` réussit. `curl -s http://localhost:3000/projets | grep -c 'id="mobilite"'` retourne `1`.

---

- [ ] 17. **Build final et vérification de bout en bout**

  Exécuter `npm run build` et confirmer 0 erreur TypeScript, 0 erreur de build.
  Démarrer le serveur (`npm run start` ou `npm run dev`) et vérifier manuellement :

  - La barre utilitaire disparaît réellement au scroll (hauteur 0, plus de bande résiduelle)
  - Le menu « Équipements ouvert » affiche un fond semi-transparent sur le trigger sans soulignement
  - Un lien actif (ex. sur `/expertise`) affiche le soulignement jaune sur « Expertise »
  - Solutions s'ouvre en 3 colonnes avec visuel
  - Équipements s'ouvre en grille 2×5 avec icônes jaunes
  - Expertise s'ouvre en 2 colonnes + visuel + lien appels d'offres
  - Partenaires s'ouvre en 3 colonnes sans visuel
  - À propos s'ouvre avec 2 groupes + visuel
  - `/expertise#installation` scroll vers la section prestations
  - `/expertise#formation` scroll vers la section appels d'offres
  - `/projets#mobilite` et `/projets#supervision` scroll vers la section domaines

  Files: aucun (vérification uniquement)
  Verify: `npm run build` → exit code 0.
