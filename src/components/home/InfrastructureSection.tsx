"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Package, Building2, Ship, Store } from "lucide-react";
import warehouse from "@/assets/infra-warehouse.jpg";

const infraStats = [
  { icon: Package, n: "70+", label: "Fulfillment centers", desc: "Positioned close to demand across 21 cities." },
  { icon: Building2, n: "9", label: "Global offices", desc: "Gurgaon HQ, with teams across five regions." },
  { icon: Ship, n: "5", label: "Trade regions", desc: "Sourcing and export lanes, port to shelf." },
  { icon: Store, n: "80K+", label: "Retailers served", desc: "From metros through to deep tier-3 towns." },
];

const PARALLAX_DEPTH = 120;

export function InfrastructureSection() {
  return (
    <section className="bg-surface-2 overflow-hidden">
      <div className="pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Infrastructure</div>
            <h2 className="mt-3 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1]">
              The backbone<br />behind the brands.
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink-soft text-[17px] leading-[1.65]">
            Warehouses, fulfillment centers and offices across the country — owned, operated and accountable.
          </p>
        </div>
      </div>

      <div className="mt-14 pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="overflow-hidden rounded-3xl">
            <InfrastructureBanner />
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {infraStats.map((s) => (
              <div key={s.label} className="bg-surface p-4 md:p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line text-accent">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="font-display text-xl font-semibold tracking-[-0.03em] text-ink">{s.n}</div>
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">{s.label}</div>
                <div className="mt-1 max-w-[30ch] text-xs leading-[1.6] text-ink-soft">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfrastructureBanner() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const park = () => {
      const frame = frameRef.current;
      const img = imgRef.current;
      if (!frame || !img) return;
      const r = frame.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 when the frame sits below the fold, +1 when it has passed above it
      const centered = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      img.style.transform = `translate3d(0, ${(-centered * PARALLAX_DEPTH).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        park();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    park();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={frameRef} className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div ref={imgRef} className="absolute -top-[45%] left-0 h-[190%] w-full will-change-transform">
        <Image src={warehouse} alt="Warehouse" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.17_0.01_60)_0%,oklch(0.17_0.01_60/0.55)_40%,oklch(0.17_0.01_60/0.1)_85%)]" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-10 lg:pb-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 text-white">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">
              Bhiwandi · Gurgaon · Hyderabad · Kolkata
            </div>
            <div className="mt-2.5 font-display text-[28px] md:text-[34px] font-semibold tracking-[-0.03em]">
              300K+ sq ft, owned and operated
            </div>
          </div>
          <Link
            href="/businesses/marketplace-operations"
            className="inline-flex flex-none items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-ink hover:bg-white/90 transition-colors"
          >
            See the network
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fe0000] text-white">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
