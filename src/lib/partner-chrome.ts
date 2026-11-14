/** Pages that own their chrome. Public landings keep the site header. */
export function isPartnerMinimalChrome(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/espace-livreur") return false;
  if (path.startsWith("/espace-livreur/")) return true;
  if (path === "/espace-partenaire") return false;
  return path.startsWith("/espace-partenaire/");
}
