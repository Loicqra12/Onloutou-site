import Image from "next/image";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";

type Media = { src: string; alt: string; width: number; height: number; objectPosition?: string };

type Props = {
  /** « photo » : photo à droite fondue dans un panneau sombre. « split » : texte et photo côte à côte. */
  variant: "photo" | "split";
  id: string;
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  intro: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  note: string;
  media: Media;
  caption?: string;
};

/**
 * Premier écran commun aux pages Location et Vente : un titre, une photo, une action.
 * Départ du texte sur la grille de la navigation, jaune réservé au bouton et à quelques mots.
 */
export function CommerceHero({
  variant,
  id,
  breadcrumb,
  eyebrow,
  titleBefore,
  titleAccent,
  intro,
  primary,
  secondary,
  note,
  media,
  caption,
}: Props) {
  return (
    <section className={`cm-hero cm-hero--${variant}`} aria-labelledby={id}>
      {variant === "photo" ? (
        <>
          <figure className="cm-hero__bg">
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              priority
              quality={86}
              sizes="(max-width: 899px) 100vw, 62vw"
              style={{ objectPosition: media.objectPosition }}
            />
          </figure>
          <div className="cm-hero__veil" aria-hidden />
        </>
      ) : null}

      <div className="cm-hero__inner">
        <div className="cm-hero__copy">
          <Breadcrumb items={breadcrumb} />
          <p className="cm-eyebrow">{eyebrow}</p>
          <h1 id={id} className="cm-h1">
            {titleBefore}
            <span className="cm-accent">{titleAccent}</span>
          </h1>
          <p className="cm-intro">{intro}</p>
          <div className="cm-actions">
            <a href={primary.href} className="cm-btn cm-btn--primary">
              {primary.label}
            </a>
            <a href={secondary.href} className="cm-link">
              {secondary.label}
              <span aria-hidden> ↓</span>
            </a>
          </div>
          <p className="cm-note">{note}</p>
        </div>

        {variant === "split" ? (
          <figure className="cm-hero__figure">
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              priority
              quality={86}
              sizes="(max-width: 899px) 100vw, 52vw"
              style={{ objectPosition: media.objectPosition }}
            />
            {caption ? <figcaption>{caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
