import Link from "next/link";
import { dpPaths, dpSpace } from "@/content/devenir-partenaire";

export function PartnerPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <p className="ps-crumb">
        <Link href={dpPaths.home}>{dpSpace.breadcrumbHome}</Link>
        {" / "}
        <span>{title}</span>
      </p>
      <h1>{title}</h1>
      <p>{dpSpace.placeholderLead}</p>
    </div>
  );
}
