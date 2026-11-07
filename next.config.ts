import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Export statique pour hébergement mutualisé (LWS / cPanel) : `npm run build:lws`.
 * Le backend est hébergé ailleurs ; le site l'appelle via NEXT_PUBLIC_API_BASE (URL absolue).
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: "export" as const, trailingSlash: true, distDir: "lws-deploy" }
    : {}),
  images: {
    ...(isStaticExport ? { loader: "custom" as const, loaderFile: "./src/lib/lws-image-loader.ts" } : {}),
    qualities: [75, 86],
    // Pas de variantes trop petites : les vignettes recadrées (object-fit: cover)
    // étaient servies à 256 px puis agrandies, d’où le flou.
    imageSizes: [384, 640],
    deviceSizes: [828, 1080, 1200, 1920, 2048],
  },
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  ...(isStaticExport
    ? {}
    : {
        async rewrites() {
          const apiOrigin = process.env.API_ORIGIN ?? "http://127.0.0.1:4000";
          return [
            { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
            { source: "/health", destination: `${apiOrigin}/health` },
          ];
        },
      }),
};

export default nextConfig;
