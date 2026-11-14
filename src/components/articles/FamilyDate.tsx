"use client";

import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";

export type FamilyPrefix = "elm" | "inf" | "mob" | "rec" | "enf";

type DateProps = {
  prefix: FamilyPrefix;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  min?: string;
  max?: string;
};

/** Champ date natif (calendrier utilisable), dans l’enveloppe de champ déjà employée sur le site. */
export function FamilyDate({
  prefix,
  id,
  value,
  onChange,
  placeholder = "À préciser",
  ariaLabel,
  min,
  max,
}: DateProps) {
  return (
    <span className={`${prefix}-field--icon`}>
      <VhpIcon name="calendar" strokeWidth={1.5} />
      <input
        id={id}
        type="date"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        min={min || undefined}
        max={max || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </span>
  );
}

type RangeProps = {
  prefix: FamilyPrefix;
  startId: string;
  endId: string;
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  startLabel?: string;
  endLabel?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  fieldClass?: string;
};

export function FamilyDateRange({
  prefix,
  startId,
  endId,
  startDate,
  endDate,
  onChange,
  startLabel = "Date de début",
  endLabel = "Date de fin",
  startPlaceholder = "À préciser",
  endPlaceholder = "À préciser",
  fieldClass,
}: RangeProps) {
  const labelClass = fieldClass ?? `${prefix}-buy__field`;
  return (
    <div className={`${prefix}-date-range`}>
      <label className={labelClass} htmlFor={startId}>
        <span>{startLabel}</span>
        <FamilyDate
          prefix={prefix}
          id={startId}
          value={startDate}
          onChange={(value) => onChange(value, endDate)}
          placeholder={startPlaceholder}
          ariaLabel={startLabel}
          max={endDate || undefined}
        />
      </label>
      <label className={labelClass} htmlFor={endId}>
        <span>{endLabel}</span>
        <FamilyDate
          prefix={prefix}
          id={endId}
          value={endDate}
          onChange={(value) => onChange(startDate, value)}
          placeholder={endPlaceholder}
          ariaLabel={endLabel}
          min={startDate || undefined}
        />
      </label>
    </div>
  );
}
