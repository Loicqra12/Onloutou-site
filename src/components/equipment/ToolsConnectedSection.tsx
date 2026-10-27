import Link from "next/link";
import { toolsConnectedSection } from "@/content/tools-equipment-page";

export function ToolsConnectedSection() {
  const data = toolsConnectedSection;

  return (
    <section className="tem-connected section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="tem-connected-title">
      <div className="container-content max-w-3xl">
        <h2 id="tem-connected-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="tem-connected__lead">{data.lead}</p>
        <div className="tem-connected__links">
          {data.links.map((link) => (
            <Link key={link.href} href={link.href} className="tem-connected__link link-motion">{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
