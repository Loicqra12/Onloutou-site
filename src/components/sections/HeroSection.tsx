import { homeMedia } from "@/content/media";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { LcpPicture } from "@/components/ui/LcpPicture";

export function HeroSection() {
  const photo = homeMedia.hero.photo;

  return (
    <section id="accueil" data-section="hero" className="relative overflow-hidden bg-[#141414] text-white">
      <div className="container-content relative z-[1] flex flex-col justify-center py-12 sm:py-16 lg:min-h-[720px] lg:py-20">
        <HeroEntrance />
      </div>
      <div className="home-hero-photo relative h-[min(78vw,440px)] sm:h-[460px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[64%]">
        <LcpPicture
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 64vw"
          className="h-full w-full object-cover object-[72%_40%]"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#141414] from-[6%] via-[#141414]/80 via-[34%] to-transparent to-[68%] lg:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
