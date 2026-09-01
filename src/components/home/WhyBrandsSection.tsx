"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Truck,
  Warehouse,
  Landmark,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import fulfillmentImg from "@/assets/infra-fulfillment.jpg";
import opsImg from "@/assets/ops-control-room.jpg";
import retailImg from "@/assets/infra-retail.jpg";
import warehouseImg from "@/assets/infra-warehouse.jpg";
import tradingImg from "@/assets/trading-showroom.jpg";
import officeImg from "@/assets/infra-office.jpg";

type Reason = {
  key: string;
  icon: LucideIcon;
  image: StaticImageData;
  alt: string;
  word: string;
  title: string;
  desc: string;
  statLabel: string;
  statBig: ReactNode;
  pillValue: string;
  pillSuffix: string;
  caption?: string;
  visual: ReactNode;
};

const N = 6;

const reasons: Reason[] = [
  {
    key: "reach",
    icon: MapPin,
    image: fulfillmentImg,
    alt: "Fulfillment network",
    word: "Reach",
    title: "Nationwide Reach",
    desc: "Active presence across India with 80% pincode coverage and 15+ fulfillment centers.",
    statLabel: "Pincode coverage",
    statBig: (
      <>
        80<span className="text-[15px] font-semibold text-white/80">%</span>
      </>
    ),
    pillValue: "80%",
    pillSuffix: "of pincodes covered",
    caption: "15+ fulfillment centers serving metro to tier-3.",
    visual: (
      <div className="mt-3 h-[3px] rounded-full bg-white/25">
        <div className="h-[3px] w-[80%] rounded-full bg-brand-3" />
      </div>
    ),
  },
  {
    key: "marketplace",
    icon: ShoppingBag,
    image: opsImg,
    alt: "Marketplace operations",
    word: "Marketplace",
    title: "Marketplace Expertise",
    desc: "Deep operational fluency with Amazon, Flipkart and emerging marketplaces.",
    statLabel: "Orders / month",
    statBig: "55K+",
    pillValue: "55K+",
    pillSuffix: "orders a month",
    caption: "Amazon, Flipkart, Meesho and brand portals.",
    visual: (
      <div className="mt-3 flex h-[26px] items-end gap-1">
        {[38, 56, 44, 74, 100].map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${i === 4 ? "bg-brand-3" : "bg-white/30"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    key: "distribution",
    icon: Truck,
    image: retailImg,
    alt: "Retail distribution",
    word: "Distribution",
    title: "Distribution Leadership",
    desc: "Three decades of relationships with 80,000+ retailers and 600+ distributors.",
    statLabel: "Retailers served",
    statBig: "80,000+",
    pillValue: "80,000+",
    pillSuffix: "retailers served",
    visual: (
      <div className="mt-3.5 flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] text-white/70">
          <span>Distributors</span>
          <span className="font-semibold text-white">600+</span>
        </div>
        <div className="flex justify-between text-[11px] text-white/70">
          <span>Field staff</span>
          <span className="font-semibold text-white">500+</span>
        </div>
      </div>
    ),
  },
  {
    key: "infrastructure",
    icon: Warehouse,
    image: warehouseImg,
    alt: "Warehousing",
    word: "Infrastructure",
    title: "Infrastructure at Scale",
    desc: "150K+ sq ft of owned warehousing and operational facilities.",
    statLabel: "Owned footprint",
    statBig: (
      <>
        150K<span className="text-sm font-semibold text-white/80"> sq ft</span>
      </>
    ),
    pillValue: "150K",
    pillSuffix: "sq ft owned",
    caption: "Owned, not leased — across four hubs.",
    visual: (
      <div className="mt-3.5 grid grid-cols-6 gap-[3px]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-3.5 rounded-sm ${i < 4 ? "bg-brand-3" : "bg-white/25"}`} />
        ))}
      </div>
    ),
  },
  {
    key: "capital",
    icon: Landmark,
    image: tradingImg,
    alt: "Trading operations",
    word: "Capital",
    title: "Capital Strength",
    desc: "₹4,000+ crore revenue base supporting working capital for partner brands.",
    statLabel: "Revenue base",
    statBig: (
      <>
        ₹4,000<span className="text-sm font-semibold text-white/80"> Cr</span>
      </>
    ),
    pillValue: "₹4,000 Cr",
    pillSuffix: "revenue base",
    caption: "Working capital carried on our balance sheet.",
    visual: (
      <div className="mt-3 h-[3px] rounded-full bg-white/25">
        <div className="h-[3px] w-full rounded-full bg-brand-3" />
      </div>
    ),
  },
  {
    key: "partnerships",
    icon: Handshake,
    image: officeImg,
    alt: "Partnerships",
    word: "Partnerships",
    title: "Long-Term Partnerships",
    desc: "Multi-decade relationships with India's most demanding manufacturers.",
    statLabel: "Years in market: 29",
    statBig: "1997",
    pillValue: "1997",
    pillSuffix: "operating since",
    visual: (
      <div className="mt-3.5 flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] text-white/70">
          <span>Years in market</span>
          <span className="font-semibold text-white">29</span>
        </div>
        <div className="flex justify-between text-[11px] text-white/70">
          <span>Manufacturers</span>
          <span className="font-semibold text-white">100+</span>
        </div>
      </div>
    ),
  },
];

export function WhyBrandsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const mcardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mActive, setMActive] = useState(0);

  useEffect(() => {
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const fromScroll = () => {
      const el = trackRef.current;
      if (!el || window.innerWidth < 1024) return;
      const vh = window.innerHeight || 800;
      const len = el.offsetHeight - vh;
      if (len <= 0) return;
      const p = clamp(-el.getBoundingClientRect().top / len, 0, 1);
      const i = Math.min(N - 1, Math.floor(p * N * 0.999));
      setActive((prev) => (prev === i ? prev : i));
    };

    const mobileFromScroll = () => {
      if (window.innerWidth >= 1024) return;
      const vh = window.innerHeight || 800;
      const focus = vh * 0.45;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < N; i++) {
        const el = mcardRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const d = Math.abs(r.top + r.height / 2 - focus);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best !== -1) setMActive((prev) => (prev === best ? prev : best));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fromScroll();
        mobileFromScroll();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    fromScroll();
    mobileFromScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const set = useCallback((i: number) => {
    const n = Math.min(N - 1, Math.max(0, i));
    setActive(n);
    const el = trackRef.current;
    if (el) {
      const vh = window.innerHeight || 800;
      const len = el.offsetHeight - vh;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (len * (n + 0.5)) / N, behavior: "smooth" });
    }
  }, []);

  return (
    <section className="bg-[oklch(0.94_0.008_75)] py-24 md:py-32">
      {/* Section header — desktop only, scrolls normally (not pinned) */}
      <div className="mx-auto hidden w-full max-w-7xl px-6 lg:block lg:px-10">
        <div className="flex flex-wrap items-center gap-3.5 pb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[oklch(0.89_0.012_75)] text-[11.5px] font-semibold text-ink">
            06
          </span>
          <span className="text-[13.5px] font-semibold text-ink">Why brands choose SMG</span>
          <div className="ml-auto flex flex-none items-center gap-3.5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              {String(active + 1).padStart(2, "0")} / 06
            </span>
            <div className="flex flex-none gap-2">
              <button
                type="button"
                onClick={() => set(active - 1)}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.85_0.012_75)] bg-white text-ink transition-colors hover:border-ink/40"
              >
                <ArrowLeft className="h-[15px] w-[15px]" />
              </button>
              <button
                type="button"
                onClick={() => set(active + 1)}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.85_0.012_75)] bg-white text-ink transition-colors hover:border-ink/40"
              >
                <ArrowRight className="h-[15px] w-[15px]" />
              </button>
            </div>
          </div>
        </div>
        <div className="h-px bg-line" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14 pt-6 md:pt-8 md:px-14 items-end">
          <h2 className="md:col-span-5 font-display text-2xl md:text-[clamp(28px,3.4vh_+_10px,46px)] font-bold tracking-[-0.03em] leading-[1.06] text-ink">
            Built for <span className="text-[#fd0000]">serious scale</span>.
          </h2>
          <p className="md:col-span-7 text-sm md:text-[15px] leading-[1.65] text-ink-soft max-w-[56ch]">
            Nationwide reach, three decades of retail relationships and the capital strength
            to carry a brand&apos;s growth.
          </p>
        </div>
      </div>

      {/* Desktop — scroll-driven expanding panels, sticky-pinned with headspace */}
      <div ref={trackRef} className="relative mt-20 hidden lg:block md:mt-28" style={{ height: "520vh" }}>
        <div className="sticky top-24 md:top-28">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div
              className="flex gap-3"
              style={{ height: "min(640px, calc(100vh - 200px))", minHeight: "440px" }}
            >
              {reasons.map((r, i) => {
                  const Icon = r.icon;
                  const on = i === active;
                  return (
                    <div
                      key={r.key}
                      onClick={() => set(i)}
                      className="relative min-w-0 flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ flexGrow: on ? 1 : 0, flexBasis: "112px" }}
                    >
                      <Image
                        src={r.image}
                        alt={r.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,12,11,0.88)_0%,rgba(14,12,11,0.35)_45%,rgba(14,12,11,0.12)_100%)]" />

                      {/* Glass stat card */}
                      <div
                        className="pointer-events-none absolute top-6 right-6 w-[min(196px,calc(100%-32px))] rounded-[14px] border border-white/[0.22] bg-white/[0.12] p-[18px] text-white backdrop-blur-md transition-opacity duration-500"
                        style={{ opacity: on ? 1 : 0 }}
                      >
                        <div className="text-[9.5px] uppercase tracking-[0.2em] text-white/65">
                          {r.statLabel}
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-1.5 font-display text-[40px] font-bold leading-none tracking-[-0.04em]">
                          {r.statBig}
                        </div>
                        {r.visual}
                        {r.caption && (
                          <div className="mt-2.5 text-[11px] leading-[1.5] text-white/70">{r.caption}</div>
                        )}
                      </div>

                      {/* Collapsed — single word, vertical, slides out on expand */}
                      <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          opacity: on ? 0 : 1,
                          transform: on ? "translateY(48px)" : "translateY(0)",
                        }}
                      >
                        <span
                          className="whitespace-nowrap font-display text-[clamp(20px,2.6vw,30px)] font-bold uppercase tracking-[-0.01em] text-white"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          {r.word}
                        </span>
                      </div>

                      {/* Expanded — full detail, slides in on expand */}
                      <div
                        className="absolute text-white transition-[left,right,bottom,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          left: on ? 24 : 16,
                          right: on ? 24 : 16,
                          bottom: on ? 24 : 18,
                          opacity: on ? 1 : 0,
                          transform: on ? "translateY(0)" : "translateY(20px)",
                          pointerEvents: on ? "auto" : "none",
                        }}
                      >
                        <Icon className="h-[17px] w-[17px] text-brand-3" />
                        <div
                          className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em]"
                        >
                          {r.title}
                        </div>
                        <p
                          className="mt-2 max-w-[42ch] text-[13.5px] leading-[1.6] text-white/75 transition-opacity duration-400"
                          style={{ display: on ? "block" : "none", opacity: on ? 1 : 0 }}
                        >
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-2">
                {reasons.map((r, i) => (
                  <span
                    key={r.key}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      i === active ? "w-9 bg-brand" : "w-3.5 bg-[oklch(0.86_0.012_75)]"
                    }`}
                  />
                ))}
                <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.55_0.01_60)]">
                  {String(active + 1).padStart(2, "0")} / 06
                </span>
              </div>
            </div>
          </div>
        </div>
      {/* Mobile — scroll-driven stacked accordion */}
      <div className="mx-auto max-w-xl px-5 lg:hidden">
        <div className="flex flex-wrap items-center gap-2.5 pb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[oklch(0.89_0.012_75)] text-[10.5px] font-semibold text-ink">
            06
          </span>
          <span className="text-[12.5px] font-semibold text-ink">Why brands choose SMG</span>
        </div>
        <div className="h-px bg-line" />
        <h2 className="mt-5 max-w-[16ch] font-display text-2xl font-bold leading-[1.06] tracking-[-0.03em] text-ink">
          Built for <span className="text-[#fd0000]">serious scale</span>.
        </h2>
        <p className="mt-3 text-sm leading-[1.65] text-ink-soft">
          Nationwide reach, three decades of retail relationships and the capital strength to
          carry a brand&apos;s growth.
        </p>

        <div className="mt-6 flex items-center gap-2.5">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[oklch(0.90_0.012_75)]">
            <div
              className="h-[3px] rounded-full bg-brand transition-[width] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${((mActive + 1) / N) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-[oklch(0.55_0.01_60)]">
            {String(mActive + 1).padStart(2, "0")} / 06
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            const on = i === mActive;
            return (
              <div
                key={r.key}
                ref={(el) => {
                  mcardRefs.current[i] = el;
                }}
                className="overflow-hidden rounded-[18px] border bg-white transition-[border-color,box-shadow] duration-400"
                style={{
                  borderColor: on ? "oklch(0.84 0.012 75)" : "oklch(0.92 0.012 75)",
                  boxShadow: on ? "0 16px 32px -20px rgba(20,18,16,0.45)" : "none",
                }}
              >
                <div
                  className="relative overflow-hidden transition-[height] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ height: on ? 196 : 88 }}
                >
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `scale(${on ? 1 : 1.12})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,12,11,0.82),rgba(14,12,11,0.15)_65%)]" />
                  <div className="absolute inset-x-3.5 bottom-3 flex items-center gap-2.5 text-white">
                    <span
                      className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg transition-colors duration-400"
                      style={{ background: on ? "var(--brand)" : "rgba(255,255,255,0.18)" }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-display text-base font-semibold tracking-[-0.02em]">{r.title}</span>
                    <span
                      className="ml-auto flex items-baseline gap-1.5 transition-opacity duration-400"
                      style={{ opacity: on ? 0 : 1 }}
                    >
                      <span className="font-display text-[15px] font-bold tracking-[-0.02em]">{r.pillValue}</span>
                      <span className="text-[10px] text-white/72">{r.pillSuffix}</span>
                    </span>
                  </div>
                </div>
                <div
                  className="overflow-hidden transition-[max-height] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ maxHeight: on ? 220 : 0 }}
                >
                  <div className="px-4 pb-4 pt-3.5">
                    <p
                      className="text-[13.5px] leading-[1.6] text-ink-soft transition-[opacity,transform] duration-[460ms]"
                      style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 14}px)` }}
                    >
                      {r.desc}
                    </p>
                    <div
                      className="mt-3.5 flex items-baseline gap-2.5 border-t border-[oklch(0.92_0.012_75)] pt-3 transition-[opacity,transform] duration-[460ms]"
                      style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 14}px)` }}
                    >
                      <span className="font-display text-[26px] font-bold tracking-[-0.035em] text-ink">
                        {r.statBig}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.55_0.01_60)]">
                        {r.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
