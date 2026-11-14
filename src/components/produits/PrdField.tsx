"use client";

import type { ReactNode } from "react";

export function PrdField({
  id,
  label,
  children,
  className,
}: {
  id?: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className ? `prd-field ${className}` : "prd-field"} htmlFor={id}>
      <span className="prd-field__label">{label}</span>
      {children}
    </label>
  );
}

export function PrdControl({ children }: { children: ReactNode }) {
  return <span className="prd-field__control">{children}</span>;
}

export function PrdDateRange({
  startId,
  endId,
  startDate,
  endDate,
  onChange,
  startLabel = "Date de début",
  endLabel = "Date de fin",
}: {
  startId: string;
  endId: string;
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  startLabel?: string;
  endLabel?: string;
}) {
  return (
    <div className="prd-date-range">
      <span className="prd-field__control">
        <input
          id={startId}
          type="date"
          value={startDate}
          aria-label={startLabel}
          max={endDate || undefined}
          onChange={(event) => onChange(event.target.value, endDate)}
        />
      </span>
      <span className="prd-field__control">
        <input
          id={endId}
          type="date"
          value={endDate}
          aria-label={endLabel}
          min={startDate || undefined}
          onChange={(event) => onChange(startDate, event.target.value)}
        />
      </span>
    </div>
  );
}

export function PrdStepper({
  label,
  value,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="prd-stepper">
      <button type="button" aria-label={`Diminuer ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`Augmenter ${label}`} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
