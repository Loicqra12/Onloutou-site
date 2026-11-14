/** Formate une période ISO (AAAA-MM-JJ) pour l’affichage et le panier. */
export function formatFamilyPeriod(startDate: string, endDate: string, fallback = ""): string {
  const start = startDate.trim();
  const end = endDate.trim();
  if (start && end) return `${start} \u2013 ${end}`;
  return start || end || fallback;
}

export function periodPatch(startDate: string, endDate: string): {
  startDate: string;
  endDate: string;
  dates: string;
} {
  return {
    startDate: startDate.trim(),
    endDate: endDate.trim(),
    dates: formatFamilyPeriod(startDate, endDate),
  };
}
