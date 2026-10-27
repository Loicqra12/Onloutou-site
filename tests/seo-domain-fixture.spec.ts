import { expect, test } from "@playwright/test";
import sitemap from "@/app/sitemap";
import { getSitemapPaths } from "@/lib/seo/routes";
import { absolutePublicAssetUrl, absoluteUrl, getSiteUrl } from "@/lib/seo/site-url";
import { resolveOpenGraphImages } from "@/lib/seo/social-metadata";

const FIXTURE_ORIGIN = "https://onloutou.example";

test.describe("SEO — contexte B (fixture onloutou.example)", () => {
  test("URL et sitemap avec origine de test", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = FIXTURE_ORIGIN;

    expect(getSiteUrl()).toBe(FIXTURE_ORIGIN);
    expect(absoluteUrl("/contact")).toBe(`${FIXTURE_ORIGIN}/contact`);
    expect(absoluteUrl("/")).toBe(`${FIXTURE_ORIGIN}/`);
    expect(absolutePublicAssetUrl("/assets/x.png")).toBe(`${FIXTURE_ORIGIN}/assets/x.png`);

    const entries = sitemap();
    const paths = getSitemapPaths();

    expect(entries.length).toBe(27);
    expect(paths.length).toBe(27);

    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(27);
    for (const entry of entries) {
      expect(entry.url.startsWith(`${FIXTURE_ORIGIN}/`) || entry.url === `${FIXTURE_ORIGIN}/`).toBe(
        true,
      );
      expect(entry.url).not.toContain("localhost");
    }

    for (const entry of entries) {
      expect(entry.url).not.toMatch(/https:\/\/[^/]+\/\//);
    }

    const excluded = [
      "/conditions-utilisation",
      "/mentions-legales",
      "/confidentialite",
      "/cookies",
      "/espace-partenaire",
      "/espace-livreur",
    ];
    for (const path of excluded) {
      for (const url of urls) {
        expect(url).not.toContain(path.slice(1));
      }
    }

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  test("resolveOpenGraphImages — absolu uniquement avec origine", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = FIXTURE_ORIGIN;

    const resolved = resolveOpenGraphImages([
      { url: "/assets/images/foo.png", alt: "test" },
    ]);
    const first = Array.isArray(resolved) ? resolved[0] : resolved;
    expect(first).toMatchObject({
      url: `${FIXTURE_ORIGIN}/assets/images/foo.png`,
    });

    process.env.NEXT_PUBLIC_SITE_URL = "";
    const empty = resolveOpenGraphImages([{ url: "/assets/images/foo.png", alt: "test" }]);
    expect(empty).toBeUndefined();

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });
});
