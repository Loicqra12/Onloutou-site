"use client";

import Image from "next/image";
import {
  temCatalog,
  temCategoryById,
  temCities,
  temEnergies,
  temFamilies,
  temFamilyById,
  temImage,
  temProducts,
  temUsages,
  type TemEnergyId,
  type TemUsageId,
} from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemDate } from "./TemDate";
import { TemIcon } from "./TemIcon";

export function TemCatalog() {
  const t = useTem();
  const c = temCatalog;
  const title = t.query.trim()
    ? `Résultats pour « ${t.query.trim()} »`
    : t.category
      ? temCategoryById(t.category).label
      : temFamilyById(t.family).label;
  const compareItems = t.compared.map((id) => temProducts.find((p) => p.id === id)!).filter(Boolean);

  return (
    <section id="familles-materiels" className="tem-section tem-catalog" aria-labelledby="tem-catalog-title">
      <div className="tem-wrap">
        <p className="tem-kicker">{c.kicker}</p>
        <h2 id="tem-catalog-title" className="tem-h2">
          {c.titleBefore}
          <span className="tem-underline">{c.titleUnderline}</span>
          <span className="tem-line">{c.titleAfter}</span>
        </h2>

        <div className="tem-catalog__search" role="search" aria-label="Rechercher un équipement">
          <span className="tem-field tem-field--icon tem-field--grow">
            <TemIcon name="search" strokeWidth={1.5} />
            <input
              type="search"
              value={t.query}
              placeholder={c.searchPlaceholder}
              aria-label={c.searchPlaceholder}
              onChange={(e) => t.setQuery(e.target.value)}
              autoComplete="off"
            />
          </span>
          <span className="tem-field tem-field--icon tem-field--select">
            <TemIcon name="pin" strokeWidth={1.5} />
            <select aria-label="Ville" value={t.city} onChange={(e) => t.setCity(e.target.value)}>
              {temCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <TemIcon name="chevronDown" strokeWidth={2} className="tem-field__caret" />
          </span>
          <TemDate id="tem-catalog-date" value={t.start} onChange={t.setStart} placeholder={c.datePlaceholder} ariaLabel="Date de début" className="tem-field--date" />
        </div>

        <div className="tem-catalog__grid">
          <aside className="tem-filters" aria-label={c.filterTitle}>
            <h3>{c.filterTitle}</h3>
            <p className="tem-filters__label" id="tem-families-label">
              {c.familyTitle}
            </p>
            <ul className="tem-families" aria-labelledby="tem-families-label">
              {temFamilies.map((f) => {
                const active = !t.query.trim() && t.family === f.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      className={active ? "tem-family is-active" : "tem-family"}
                      aria-pressed={active}
                      onClick={() => t.selectFamily(f.id)}
                    >
                      <TemIcon name={f.icon} strokeWidth={1.5} />
                      <span>{f.label}</span>
                      <TemIcon name={active ? "chevronDown" : "chevronRight"} strokeWidth={2} className="tem-family__caret" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <fieldset className="tem-usage">
              <legend>{c.usageTitle}</legend>
              {temUsages.map((u) => (
                <label key={u.id} className={t.usage === u.id ? "is-checked" : undefined}>
                  <input
                    type="radio"
                    name="tem-usage"
                    value={u.id}
                    checked={t.usage === u.id}
                    onChange={() => t.setUsage(u.id as TemUsageId)}
                  />
                  <span className="tem-radio" aria-hidden="true" />
                  <span>{u.label}</span>
                </label>
              ))}
            </fieldset>

            <div className="tem-energy">
              <label htmlFor="tem-energy" className="tem-filters__label">
                {c.energyTitle}
              </label>
              <span className="tem-field tem-field--icon tem-field--select">
                <TemIcon name="bolt" strokeWidth={1.5} />
                <select id="tem-energy" value={t.energy} onChange={(e) => t.setEnergy(e.target.value as TemEnergyId | "")}>
                  <option value="">{c.energyPlaceholder}</option>
                  {temEnergies.map((en) => (
                    <option key={en.id} value={en.id}>
                      {en.label}
                    </option>
                  ))}
                </select>
                <TemIcon name="chevronDown" strokeWidth={2} className="tem-field__caret" />
              </span>
            </div>

            <a
              href="#demande-materiel"
              className="tem-help"
              onClick={(e) => {
                e.preventDefault();
                t.scrollTo("demande-materiel");
              }}
            >
              <TemIcon name="headset" strokeWidth={1.4} />
              <strong>{c.help.title}</strong>
              <span>{c.help.text}</span>
              <TemIcon name="arrowRight" strokeWidth={1.8} className="tem-help__arrow" />
            </a>
          </aside>

          <div className="tem-results">
            <h3 className="tem-results__title">{title}</h3>
            <p className="tem-results__lead">{c.lead}</p>
            <p className="tem-sr" role="status" aria-live="polite">
              {t.products.length} équipement{t.products.length > 1 ? "s" : ""} affiché{t.products.length > 1 ? "s" : ""}
            </p>

            {t.products.length === 0 ? (
              <div className="tem-empty">
                <p>Aucun matériel ne correspond à ces critères pour le moment.</p>
                <p>Réinitialisez les filtres ou décrivez votre besoin : nous étudions aussi les demandes hors catalogue.</p>
                <button type="button" className="tem-btn tem-btn--ghost" onClick={t.resetFilters}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <ul className="tem-products">
                {t.products.map((p) => {
                  const added = t.hasProduct(p.id);
                  const compared = t.compared.includes(p.id);
                  return (
                    <li key={p.id} className="tem-product">
                      <label className="tem-product__compare">
                        <input
                          type="checkbox"
                          checked={compared}
                          disabled={!compared && t.compared.length >= 3}
                          onChange={() => t.toggleCompare(p.id)}
                          aria-label={`${c.compare} : ${p.name}`}
                        />
                        <span className="tem-check" aria-hidden="true">
                          <TemIcon name="check" strokeWidth={3} />
                        </span>
                        <span>{c.compare}</span>
                      </label>
                      <div className="tem-product__media">
                        <Image
                          src={temImage(p.image)}
                          alt={p.name}
                          width={p.imageWidth}
                          height={p.imageHeight}
                          sizes="(min-width: 1100px) 20vw, (min-width: 640px) 40vw, 80vw"
                          className="tem-product__img"
                        />
                      </div>
                      <span className="tem-chip">{temCategoryById(p.category).label}</span>
                      <h4>{p.name}</h4>
                      <p>{p.text}</p>
                      <button
                        type="button"
                        className={added ? "tem-add is-added" : "tem-add"}
                        aria-pressed={added}
                        onClick={() => t.toggleProduct(p)}
                      >
                        {added ? c.added : c.add}
                        <TemIcon name={added ? "check" : "plus"} strokeWidth={2.2} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {compareItems.length >= 2 ? (
              <div className="tem-compare" role="region" aria-label="Comparaison des équipements">
                <div className="tem-compare__head">
                  <strong>Comparaison ({compareItems.length})</strong>
                  <button type="button" className="tem-textbtn" onClick={t.clearCompare}>
                    Effacer la comparaison
                  </button>
                </div>
                <div className="tem-compare__scroll">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Équipement</th>
                        <th scope="col">Univers</th>
                        <th scope="col">Énergie</th>
                        <th scope="col">Usages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareItems.map((p) => (
                        <tr key={p.id}>
                          <th scope="row">{p.name}</th>
                          <td>{temCategoryById(p.category).label}</td>
                          <td>{temEnergies.find((e) => e.id === p.energy)?.label}</td>
                          <td>{p.usages.map((u) => temUsages.find((x) => x.id === u)?.label).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
