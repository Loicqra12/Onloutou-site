"use client";

export function LegalPrintButton() {
  return (
    <button type="button" className="leg-print" onClick={() => window.print()}>
      Imprimer
    </button>
  );
}
