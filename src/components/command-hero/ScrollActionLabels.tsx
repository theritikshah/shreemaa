import type { Ref } from "react";

interface ScrollActionLabelsProps {
  labels: string[];
  /** Container whose children, in order, are the label elements. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Short labels over the settled rings. They overlap in one grid cell so
 * switching never shifts layout; opacity is written directly from scroll by
 * the parent. Decorative repetition, so hidden from assistive tech — the
 * section provides one static description instead.
 */
export function ScrollActionLabels({ labels, ref }: ScrollActionLabelsProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 motion-reduce:hidden"
    >
      <div ref={ref} className="grid place-items-center">
        {labels.map((label, i) => (
          <span
            key={label}
            className="col-start-1 row-start-1 whitespace-nowrap font-display text-2xl font-medium tracking-tight text-white md:text-3xl"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
