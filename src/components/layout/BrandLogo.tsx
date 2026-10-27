import Image from "next/image";
import Link from "next/link";
import { siteMedia } from "@/content/media";

type BrandLogoProps = {
  className?: string;
  /** `dark` : emblème et nom jaune, pour le header et le footer noirs. */
  theme?: "light" | "dark";
};

export function BrandLogo({ className = "", theme = "light" }: BrandLogoProps) {
  const dark = theme === "dark";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-[22px] font-extrabold tracking-tight ${className}`}
      aria-label="ONLOUTOU — retour à l’accueil"
    >
      <Image
        src={siteMedia.logo.src}
        alt=""
        width={siteMedia.logo.width}
        height={siteMedia.logo.height}
        className={
          dark
            ? "h-9 w-auto max-w-[5.5rem] shrink-0 object-contain sm:h-10 sm:max-w-[6.75rem]"
            : "h-10 w-auto max-w-[9.5rem] shrink-0 object-contain sm:h-11 sm:max-w-[11rem]"
        }
        aria-hidden
        priority
      />
      {dark && (
        <span className="whitespace-nowrap text-[1.05rem] leading-none sm:text-[1.35rem]">
          <span className="text-[#F5C400]">ON</span>
          <span className="text-white">LOUTOU</span>
        </span>
      )}
      {!dark && (
        <span className="text-brand-ink">
          <span className="rounded bg-brand-yellow px-1.5 py-0.5 text-brand-ink">ON</span>
          LOUTOU
        </span>
      )}
    </Link>
  );
}
