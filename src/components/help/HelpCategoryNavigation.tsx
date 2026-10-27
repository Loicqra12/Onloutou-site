"use client";

import Link from "next/link";
import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import { helpCategories, helpContactEscalation } from "@/content/help-center";

export function HelpCategoryNavigation() {
  const { activeCategoryId, setActiveCategoryId } = useHelpCenter();

  return (
    <nav className="hlp-nav" aria-label="Catégories du centre d’aide">
      <p className="hlp-nav__title">Catégories</p>
      <ul className="hlp-nav__list">
        {helpCategories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <li key={category.id}>
              <a
                href={`#${category.id}`}
                className={`hlp-nav__link${isActive ? " hlp-nav__link--active" : ""}`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.title}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="hlp-nav__footer">
        <Link href={helpContactEscalation.primaryCta.href} className="hlp-nav__cta link-motion">
          {helpContactEscalation.primaryCta.label}
        </Link>
        <a href="#hlp-hero-title" className="hlp-nav__top link-motion">Retour en haut</a>
      </div>
    </nav>
  );
}
