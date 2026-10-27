import { serializeJsonLd } from "@/lib/seo/json-ld";
import { getSiteUrl } from "@/lib/seo/site-url";

type JsonLdProps = {
  id: string;
  data: unknown;
};

export function JsonLd({ id, data }: JsonLdProps) {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function JsonLdFromSiteUrl({
  id,
  build,
}: {
  id: string;
  build: (baseUrl: string) => unknown | null | undefined;
}) {
  const base = getSiteUrl();
  if (!base) return null;
  const data = build(base);
  return <JsonLd id={id} data={data} />;
}
