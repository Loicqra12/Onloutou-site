"use client";

import Image from "next/image";
import {
  cmeCapacities,
  cmeCatalog,
  cmeCategories,
  cmeForm,
  cmeImage,
  cmeImageSize,
  cmeMission,
  cmeMissions,
  cmePeriods,
  cmeZones,
  type CmeCapacityId,
  type CmeCategoryId,
  type CmeGroupId,
  type CmeMissionId,
} from "@/content/trucks-hub";
import { useCme, type CmeOperator } from "./CmeContext";
import { CmeIcon, type CmeIconName } from "./CmeIcon";

function Select({
  id,
  icon,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  icon: CmeIconName;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <span className="cme-field cme-field--icon cme-field--select">
      <CmeIcon name={icon} strokeWidth={1.5} />
      <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <CmeIcon name="chevronDown" className="cme-field__caret" strokeWidth={2} />
    </span>
  );
}

export function CmeCatalog() {
  const t = useCme();
  const c = cmeCatalog;
  const count = t.named.length;
  const activeCategory = t.category ? cmeCategories.find((x) => x.id === t.category) : null;

  return (
    <section id={c.id} className="cme-section cme-catalog" aria-labelledby="cme-catalog-title">
      <div className="cme-wrap">
        <h2 id="cme-catalog-title" className="cme-h2 cme-h2--center">
          <span className="cme-underline cme-underline--start">{c.title.slice(0, 1)}</span>
          {c.title.slice(1)}
        </h2>
        <p className="cme-lead cme-lead--center">{c.lead}</p>

        <div className="cme-filters" role="search" aria-label="Filtres du catalogue">
          <span className="cme-field cme-field--icon cme-filters__search">
            <CmeIcon name="search" strokeWidth={1.5} />
            <input
              type="search"
              value={t.query}
              placeholder={c.searchPlaceholder}
              aria-label={c.searchLabel}
              onChange={(e) => t.setQuery(e.target.value)}
              autoComplete="off"
            />
          </span>
          <Select
            id="cme-f-family"
            icon="box"
            label={c.filters.family}
            value={t.category ?? ""}
            onChange={(v) => (v ? t.selectCategory(v as CmeCategoryId) : t.selectCategory(null))}
            options={cmeCategories.map((x) => ({ value: x.id, label: x.label }))}
          />
          <Select
            id="cme-f-mission"
            icon="target"
            label={c.filters.mission}
            value={t.missionFilter}
            onChange={(v) => t.setMissionFilter(v as CmeMissionId | "")}
            options={cmeMissions.map((m) => ({ value: m.id, label: m.label }))}
          />
          <Select
            id="cme-f-capacity"
            icon="gear"
            label={c.filters.capacity}
            value={t.capacityFilter}
            onChange={(v) => t.setCapacityFilter(v as CmeCapacityId | "")}
            options={cmeCapacities.map((m) => ({ value: m.id, label: m.label }))}
          />
          <Select
            id="cme-f-zone"
            icon="pin"
            label={c.filters.zone}
            value={t.zoneHint}
            onChange={t.setZoneHint}
            options={cmeZones.map((z) => ({ value: z, label: z }))}
          />
          <Select
            id="cme-f-period"
            icon="calendar"
            label={c.filters.period}
            value={t.periodHint}
            onChange={t.setPeriodHint}
            options={cmePeriods.map((z) => ({ value: z, label: z }))}
          />
        </div>

        <div className="cme-tabs" role="group" aria-label="Familles d’équipements">
          {c.groups.map((g) => {
            const on = t.group === g.id;
            return (
              <button key={g.id} type="button" className={on ? "cme-tab is-on" : "cme-tab"} aria-pressed={on} onClick={() => t.selectGroup(g.id as CmeGroupId)}>
                <CmeIcon name={g.icon} strokeWidth={1.4} />
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>

        <h3 className="cme-sr">
          {t.query.trim() ? `Résultats pour « ${t.query.trim()} »` : activeCategory ? activeCategory.label : "Équipements disponibles sur demande"}
        </h3>
        <p className="cme-sr" role="status" aria-live="polite">
          {t.products.length} {t.products.length > 1 ? "types affichés" : "type affiché"}
        </p>

        {t.products.length ? (
          <ul className="cme-products">
            {t.products.map((p) => {
              const added = t.hasProduct(p.id);
              const [w, h] = cmeImageSize[p.image];
              return (
                <li key={p.id} className="cme-product">
                  <div className="cme-product__media">
                    <Image src={cmeImage(p.image)} alt={p.alt} width={w} height={h} sizes="(min-width: 1100px) 28vw, (min-width: 640px) 45vw, 90vw" className="cme-product__img" />
                  </div>
                  <div className="cme-product__body">
                    <h4>{p.name}</h4>
                    <p>{p.text}</p>
                    <p className="cme-product__cap">
                      <CmeIcon name="layers" strokeWidth={1.4} />
                      {c.capacityPending}
                    </p>
                    <button
                      type="button"
                      className={added ? "cme-btn cme-btn--add is-added" : "cme-btn cme-btn--add"}
                      aria-pressed={added}
                      onClick={() => t.toggleProduct(p)}
                    >
                      {added ? c.added : c.add}
                      <CmeIcon name={added ? "check" : "plus"} strokeWidth={2} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="cme-empty" role="status">
            <p>{c.empty}</p>
            <button type="button" className="cme-btn cme-btn--add" onClick={t.resetFilters}>
              {c.reset}
            </button>
          </div>
        )}

        <div className="cme-catalog__foot">
          <p className="cme-catalog__note">
            <CmeIcon name="info" strokeWidth={1.5} />
            {c.note}
          </p>
          <p className="cme-catalog__count" role="status" aria-live="polite">
            {count ? (
              <>
                <strong>
                  {count} {count > 1 ? "équipements ajoutés" : "équipement ajouté"}
                </strong>{" "}
                <a
                  href={`#${cmeForm.id}`}
                  className="cme-underlink"
                  onClick={(e) => {
                    e.preventDefault();
                    t.scrollTo(cmeForm.id);
                  }}
                >
                  Voir ma demande
                  <CmeIcon name="arrowRight" strokeWidth={2} />
                </a>
              </>
            ) : null}
          </p>
        </div>

        <CmeMission />
      </div>
    </section>
  );
}

function CmeMission() {
  const t = useCme();
  const m = cmeMission;
  const [w, h] = cmeImageSize[m.image.id];
  return (
    <div className="cme-mission">
      <div className="cme-mission__photo" id={m.id}>
        <div className="cme-mission__bg" aria-hidden="true" />
        <Image src={cmeImage(m.image.id)} alt={m.image.alt} width={w} height={h} sizes="(min-width: 1100px) 36vw, 100vw" className="cme-mission__img" />
        <div className="cme-mission__copy">
          <h3 className="cme-mission__title">
            {m.title.map((l) => (
              <span key={l} className="cme-line">
                {l}
              </span>
            ))}
          </h3>
          <span className="cme-mission__rule" aria-hidden="true" />
          <p>
            {m.text.map((l) => (
              <span key={l} className="cme-line">
                {l}
              </span>
            ))}
          </p>
        </div>
      </div>

      <form
        className="cme-config"
        aria-label={m.card.title}
        onSubmit={(e) => {
          e.preventDefault();
          t.applyConfig();
        }}
      >
        <h3>{m.card.title}</h3>
        <div className="cme-config__row">
          <label htmlFor="cme-cfg-mission">{m.card.mission}</label>
          <span className="cme-field cme-field--icon cme-field--select">
            <CmeIcon name="excavator" strokeWidth={1.4} />
            <select id="cme-cfg-mission" value={t.mission} onChange={(e) => t.setMission(e.target.value)}>
              {cmeMissions.map((x) => (
                <option key={x.id} value={x.label}>
                  {x.label}
                </option>
              ))}
            </select>
            <CmeIcon name="chevronDown" className="cme-field__caret" strokeWidth={2} />
          </span>
        </div>
        <div className="cme-config__row">
          <label htmlFor="cme-cfg-terrain">{m.card.terrain}</label>
          <span className="cme-field cme-field--icon cme-field--select">
            <CmeIcon name="route" strokeWidth={1.4} />
            <select id="cme-cfg-terrain" value={t.terrain} onChange={(e) => t.setTerrain(e.target.value)}>
              <option value="">{m.card.terrainPlaceholder}</option>
              {m.card.terrains.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <CmeIcon name="chevronDown" className="cme-field__caret" strokeWidth={2} />
          </span>
        </div>
        <div className="cme-config__row">
          <label htmlFor="cme-cfg-capacity">{m.card.capacity}</label>
          <span className="cme-field cme-field--icon">
            <CmeIcon name="list" strokeWidth={1.4} />
            <input
              id="cme-cfg-capacity"
              type="text"
              value={t.capacity}
              placeholder={m.card.capacityPlaceholder}
              onChange={(e) => t.setCapacity(e.target.value)}
              autoComplete="off"
            />
          </span>
        </div>
        <div className="cme-config__row">
          <span id="cme-cfg-op-label">{m.card.operator}</span>
          <div className="cme-seg" role="radiogroup" aria-labelledby="cme-cfg-op-label">
            <span className="cme-seg__icon" aria-hidden="true">
              <CmeIcon name="user" strokeWidth={1.4} />
            </span>
            {m.card.operators.map((o) => (
              <label key={o.id} className={t.operator === o.id ? "is-on" : undefined}>
                <input type="radio" name="cme-operator" value={o.id} checked={t.operator === o.id} onChange={() => t.setOperator(o.id as CmeOperator)} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="cme-btn cme-btn--yellow cme-config__submit">
          {m.card.submit}
          <CmeIcon name="arrowUpRight" />
        </button>
        {t.configApplied ? (
          <p className="cme-config__ok" role="status">
            {m.card.applied}
          </p>
        ) : null}
      </form>

      <div className="cme-banner cme-banner--wide">
        <CmeIcon name="headset" strokeWidth={1.3} className="cme-banner__icon" />
        <p>
          <strong>{m.banner.title}</strong>
          <span>{m.banner.text}</span>
        </p>
        <a
          href={`#${cmeForm.id}`}
          className="cme-btn cme-btn--yellow cme-btn--sm"
          onClick={(e) => {
            e.preventDefault();
            t.scrollTo(cmeForm.id);
          }}
        >
          {m.banner.cta}
          <CmeIcon name="arrowRight" />
        </a>
      </div>
    </div>
  );
}
