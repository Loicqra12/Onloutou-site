/**
 * Loader d'images pour l'export statique (LWS) : pas de serveur d'optimisation.
 * `scripts/build-lws.mjs` génère, pour chaque PNG/JPG, deux variantes WebP
 * (`-828.webp` pour mobile, `-1920.webp` pour grand écran).
 */
export default function lwsImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  // encodeURI : certains fichiers ont des espaces ou des accents (un espace casserait le srcset).
  const url = /\.(png|jpe?g)$/i.test(src) ? src.replace(/\.(png|jpe?g)$/i, width <= 900 ? "-828.webp" : "-1920.webp") : src;
  return encodeURI(decodeURI(url));
}
