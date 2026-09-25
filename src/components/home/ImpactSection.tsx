import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/Counter";

const statRail = [
  { value: <Counter to={80000} suffix="+" />, label: "Retailers in network" },
  { value: <Counter to={600} suffix="+" />, label: "Distribution partners" },
  { value: <Counter to={100} suffix="+" />, label: "Manufacturers" },
  { value: <Counter prefix="₹" to={4000} suffix="+ Cr" />, label: "Annual revenue" },
  { value: <Counter to={150} suffix="K sq ft" />, label: "Infrastructure" },
];

const cellBorders = [
  "border-r border-b lg:border-b-0 lg:border-r",
  "border-b lg:border-b-0 lg:border-r",
  "border-r border-b lg:border-b-0 lg:border-r",
  "border-b lg:border-b-0 lg:border-r",
  "col-span-2 lg:col-span-1",
];

export function ImpactSection() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.975_0.008_75)] text-ink pt-28">
      {/* Horizon field (decorative dot halftone) */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-full z-[1] pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(oklch(0.17 0.01 60) 0.9px, transparent 1.25px)",
          backgroundSize: "15px 15px",
          WebkitMaskImage: "radial-gradient(ellipse 62% 58% at 50% 88%, black 4%, transparent 72%)",
          maskImage: "radial-gradient(ellipse 62% 58% at 50% 88%, black 4%, transparent 72%)",
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-[140px] -left-[120px] h-[520px] w-[520px] rounded-full bg-[rgba(225,27,34,0.10)] blur-[160px] pointer-events-none"
      />

      <div className="relative z-[2] mx-auto max-w-7xl px-6 lg:px-10">
        {/* Band 1 — Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-[oklch(0.50_0.01_60)] font-semibold">
                Impact at scale
              </span>
            </div>
            <h2 className="mt-[22px] font-display text-[clamp(32px,6vw,64px)] font-bold tracking-[-0.035em] leading-[1.02] max-w-[18ch]">
              Scale is only useful if it is{" "}
              <span className="font-serif-display italic text-brand">accountable</span>.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[46ch]">
              Since 1997, SMG has built the reach to move products across India and the operating
              strength to back it up. From marketplaces to retail distribution and global trade, our
              businesses turn demand into sales at scale.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 bg-ink text-white pl-5 py-[9px] pr-[9px] rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors"
              >
                How we got here
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-[oklch(0.85_0.012_75)] text-ink px-5 py-[9px] rounded-full text-sm font-medium hover:border-ink/40 transition-colors"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>

        {/* Band 2 — Hero figure */}
        <div className="relative mt-16 lg:mt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-8 sm:gap-10">
          <div>
            <div
              className="font-display font-bold leading-[0.82] tracking-[-0.055em] text-[clamp(72px,20vw,210px)] text-transparent"
              style={{
                backgroundImage: "radial-gradient(oklch(0.17 0.01 60) 0.006em, transparent 0.0074em)",
                backgroundSize: "0.038em 0.038em",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              <Counter to={100} suffix="M+" />
            </div>
            <div className="mt-[18px] text-xs uppercase tracking-[0.24em] text-[oklch(0.50_0.01_60)] font-semibold">
              Consumers reached every year
            </div>
          </div>
          <div className="sm:pb-7 max-w-[300px]">
            <div className="font-serif-display text-[26px] leading-[1.3] text-ink">
              &ldquo;Coverage is the product.&rdquo;
            </div>
            <div className="mt-3 text-xs text-[oklch(0.55_0.01_60)] tracking-[0.04em]">
              Operating principle, since 1997
            </div>
          </div>
        </div>

        {/* Band 3 — Stat rail */}
        <div className="relative mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-5 border-t border-[oklch(0.88_0.012_75)]">
          {statRail.map((s, i) => (
            <div
              key={s.label}
              className={`pt-[30px] px-5 pb-[88px] border-[oklch(0.88_0.012_75)] ${cellBorders[i]}`}
            >
              <div className="font-display text-[34px] font-bold tracking-[-0.035em]">{s.value}</div>
              <div className="mt-2.5 text-[10.5px] uppercase tracking-[0.2em] text-[oklch(0.50_0.01_60)] font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
