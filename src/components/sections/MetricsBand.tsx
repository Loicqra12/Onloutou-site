import { metrics, metricsDisclaimer } from "@/content/home";

export function MetricsBand() {
  return (
    <section
      className="bg-brand-charcoal text-brand-white"
      aria-labelledby="metrics-heading"
    >
      <div className="container-content py-10">
        <h2 id="metrics-heading" className="sr-only">Chiffres clés</h2>
        <p className="mb-6 text-center text-xs leading-relaxed text-[#aaaaaa] sm:text-sm">
          {metricsDisclaimer}
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-brand-charcoal md:border-r md:border-[#343434] md:pr-6 last:md:border-r-0"
            >
              <strong className="block font-display text-3xl font-extrabold tracking-tight text-brand-yellow sm:text-4xl">
                {metric.value}
              </strong>
              <span className="mt-2 block text-[11px] uppercase tracking-[0.1em] text-[#aaaaaa]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
