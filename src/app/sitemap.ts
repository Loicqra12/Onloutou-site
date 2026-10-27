import type { MetadataRoute } from "next";
import { getSitemapPaths } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getSitemapPaths();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    const url = absoluteUrl(path);
    if (!url) continue;
    entries.push({ url });
  }

  return entries;
}
