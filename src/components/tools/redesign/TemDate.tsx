"use client";

import { useState } from "react";
import { TemIcon } from "./TemIcon";

type Props = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
};

/** Champ date : affiche « À préciser » tant qu’aucune date n’est saisie, puis bascule en sélecteur natif. */
export function TemDate({ id, value, onChange, placeholder, label, ariaLabel, className }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <span className={`tem-field tem-field--icon ${className ?? ""}`}>
      <TemIcon name="calendar" strokeWidth={1.5} />
      <input
        id={id}
        type={value || focused ? "date" : "text"}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? label}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </span>
  );
}
