import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { HashAnchorAlign } from "@/components/navigation/HashAnchorAlign";
import { MotionBootstrap } from "@/components/motion/MotionBootstrap";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeDescription } from "@/app/home-metadata";
import { siteMedia } from "@/content/media";
import { site } from "@/content/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildTwitterMetadata } from "@/lib/seo/social-metadata";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: homeDescription,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: homeDescription,
    locale: "fr_FR",
    type: "website",
    siteName: site.name,
    ...(siteUrl ? { url: `${siteUrl}/` } : {}),
  },
  twitter: buildTwitterMetadata(
    `${site.name} — ${site.tagline}`,
    homeDescription,
  ),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      {
        url: siteMedia.logo.src,
        type: "image/png",
        sizes: `${siteMedia.logo.width}x${siteMedia.logo.height}`,
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${dmSans.variable}`}>
      <body>
        <JsonLd id="organization-jsonld" data={organizationJsonLd()} />
        <JsonLd id="website-jsonld" data={websiteJsonLd()} />
        <MotionBootstrap />
        <HashAnchorAlign />
        <ScrollProgress />
        <a
          href="#contenu-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-button)] focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-bold focus:text-brand-ink"
        >
          Aller au contenu principal
        </a>
        <SiteChrome>{children}</SiteChrome>
        <CookieNotice />
      </body>
    </html>
  );
}
