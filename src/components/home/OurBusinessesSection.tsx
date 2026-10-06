"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight, ShoppingBag, Truck, Globe2, Leaf, type LucideIcon } from "lucide-react";
import marketplaceImg from "@/assets/online-shopping.png";
import distributionImg from "@/assets/india-distribution.png";
import exportImg from "@/assets/global-logistics.png";
import oyuImg from "@/assets/tea-sustainability.png";

type Card = {
  key: string;
  href: string;
  external?: boolean;
  dark: boolean;
  badge: string;
  name: string;
  icon: LucideIcon;
  ghost: string;
  statValue: string;
  statLabel: string;
  headline: ReactNode;
  body: string;
  features: string[];
  collage: StaticImageData;
  collageAlt: string;
};

const cards: Card[] = [
  {
    key: "marketplace",
    href: "/businesses/marketplace-operations",
    dark: true,
    badge: "01/04",
    name: "Marketplace Operations",
    icon: ShoppingBag,
    ghost: "01",
    statValue: "55K+",
    statLabel: "Orders / month",
    headline: (
      <>
        Launchpad for <span className="text-accent">digital shelf space</span>.
      </>
    ),
    body: "From launch-day listings to daily pricing, stock and fulfilment, we run the marketplace operation behind brand growth.",
    features: ["Catalog & content", "Inventory sync", "SLA governance"],
    collage: marketplaceImg,
    collageAlt: "Marketplace collage",
  },
  {
    key: "distribution",
    href: "/businesses/distribution-network",
    dark: false,
    badge: "02/04",
    name: "Distribution Network",
    icon: Truck,
    ghost: "02",
    statValue: "70K+",
    statLabel: "Retail touchpoints",
    headline: (
      <>
        <span className="text-accent">50 million consumers</span>, one retailer at a time.
      </>
    ),
    body: "Central and Western India's distribution leader, metro to rural.",
    features: ["Xiaomi · Jio · Samsung", "500+ distributors", "350K sq ft warehousing"],
    collage: distributionImg,
    collageAlt: "Distribution collage",
  },
  {
    key: "global-trade",
    href: "/businesses/global-trade",
    dark: true,
    badge: "03/04",
    name: "Rio World · Global Trade",
    icon: Globe2,
    ghost: "03",
    statValue: "3 regions",
    statLabel: "Sourced & served",
    headline: (
      <>
        Sourcing the world. <span className="text-accent">Exporting India.</span>
      </>
    ),
    body: "Rio World sources smartphones and consumer electronics from multiple channels and supplies buyers across international markets.",
    features: ["Import & sourcing", "Export enablement", "Customs & settlement"],
    collage: exportImg,
    collageAlt: "Global trade collage",
  },
  {
    key: "sustainability",
    href: "https://www.oyugreen.com",
    external: true,
    dark: false,
    badge: "04/04",
    name: "Sustainability · OYU Green",
    icon: Leaf,
    ghost: "04",
    statValue: "4 registries",
    statLabel: "Verra · GS · GCC · CDM",
    headline: (
      <>
        Verified climate impact, <span className="text-accent">at scale</span>.
      </>
    ),
    body: "From tree planting to cleaner cooking and plastic recovery, OYU Green develops projects designed to deliver measurable environmental results.",
    features: ["Nature-based removal", "Cookstoves & water", "Satellite dMRV"],
    collage: oyuImg,
    collageAlt: "Sustainability collage",
  },
];

const BASE_TOP = 240;

export function OurBusinessesSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const rectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gfxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorMotion = useRef(cards.map(() => ({ x: 0, y: 0, tx: 0, ty: 0, initialized: false })));

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      cursorMotion.current.forEach((point, index) => {
        if (!point.initialized) return;
        point.x += (point.tx - point.x) * 0.14;
        point.y += (point.ty - point.y) * 0.14;
        const cursor = cursorRefs.current[index];
        if (cursor) cursor.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (prefersReducedMotion || isMobile) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const update = () => {
      const vh = window.innerHeight || 800;
      const START = vh * 0.55;
      const p = [0, 0, 0, 0, 0];
      const pm = [1, 0, 0, 0, 0];
      for (let j = 1; j < 5; j++) {
        const el = rectRefs.current[j];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        p[j] = clamp((START - top) / (START - BASE_TOP));
        const prevEl = rectRefs.current[j - 1];
        const S = BASE_TOP + (prevEl ? prevEl.getBoundingClientRect().height : vh * 0.7) + vh * 0.65;
        pm[j] = clamp((S - top) / (S - BASE_TOP));
      }

      if (headRef.current) headRef.current.style.opacity = (1 - clamp(pm[1])).toFixed(2);

      for (let i = 0; i < 5; i++) {
        let depth = 0;
        let fadeDepth = 0;
        for (let j = i + 1; j < 5; j++) {
          depth += pm[j];
          fadeDepth += p[j];
        }
        if (i < 4) {
          const inner = innerRefs.current[i];
          const content = contentRefs.current[i];
          if (inner) {
            inner.style.transform = `perspective(1200px) translateY(${(-56 * depth).toFixed(1)}px) translateZ(${(-75 * depth).toFixed(1)}px) rotateX(${(3.5 * depth).toFixed(2)}deg)`;
            inner.style.filter = `brightness(${(1 - 0.08 * Math.min(depth, 3)).toFixed(3)})`;
          }
          if (content) content.style.opacity = (1 - clamp(fadeDepth)).toFixed(2);
        }
        const g = gfxRefs.current[i];
        if (g) {
          const lag = (1 - pm[i]) * 70;
          g.style.transform = `perspective(1000px) translateY(${(lag - 22 * depth).toFixed(1)}px) translateZ(${(-70 * depth).toFixed(1)}px)`;
          g.style.opacity = (1 - clamp(fadeDepth)).toFixed(2);
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="py-20 md:py-36">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 relative">
        {/* Sticky section header */}
        <div ref={headRef} className="sticky top-7 z-0 pb-6 md:pb-10">
          <div className="flex flex-wrap items-center gap-3.5 pb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[oklch(0.89_0.012_75)] text-[11.5px] font-semibold text-ink">
              05
            </span>
            <span className="text-[13.5px] font-semibold text-ink">Our businesses</span>
            <span className="ml-auto text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              Est. 1997 · 9 global offices
            </span>
          </div>
          <div className="h-px bg-line" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14 pt-6 md:pt-8 md:px-14 items-end">
            <h2 className="md:col-span-5 font-display text-2xl md:text-[clamp(28px,3.4vh_+_10px,46px)] font-bold tracking-[-0.03em] leading-[1.06] text-ink">
              Five businesses.
              <br />
              One commerce engine.
            </h2>
            <p className="md:col-span-7 text-sm md:text-[15px] leading-[1.65] text-ink-soft max-w-[56ch]">
              Five businesses, each built for a different route to market. Together, they connect
              brands with customers through marketplaces, retail distribution, trading, global trade
              and sustainability.
            </p>
          </div>
        </div>

        {/* Stacking card deck */}
        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              ref={(el) => {
                rectRefs.current[i] = el;
              }}
              className={`sticky top-20 md:top-[240px] md:h-[clamp(420px,58vh,560px)] ${
                i === 0 ? "" : "mt-[48vh] md:mt-[65vh]"
              }`}
              style={{ zIndex: i + 1 }}
            >
              <Link
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                aria-label={`Explore ${card.name}`}
                ref={(el) => {
                  if (i < 4) innerRefs.current[i] = el;
                }}
                onMouseEnter={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const point = cursorMotion.current[i];
                  point.tx = event.clientX - bounds.left;
                  point.ty = event.clientY - bounds.top;
                  point.x = point.tx;
                  point.y = point.ty;
                  point.initialized = true;
                  const cursor = cursorRefs.current[i];
                  if (cursor) cursor.style.opacity = "1";
                }}
                onMouseMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const point = cursorMotion.current[i];
                  point.tx = event.clientX - bounds.left;
                  point.ty = event.clientY - bounds.top;
                }}
                onMouseLeave={() => {
                  const cursor = cursorRefs.current[i];
                  if (cursor) cursor.style.opacity = "0";
                }}
                className={`relative flex h-full flex-col overflow-hidden rounded-[28px] shadow-[0_24px_60px_-24px_rgba(20,18,16,0.35)] md:cursor-none ${
                  i < 4 ? "origin-top will-change-transform" : ""
                } ${card.dark ? "bg-ink text-white" : "bg-white text-ink"}`}
              >
                <div
                  ref={(el) => { cursorRefs.current[i] = el; }}
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 z-30 hidden h-16 w-16 place-items-center rounded-full opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 md:grid ${
                    card.dark ? "bg-white text-ink" : "bg-ink text-white"
                  }`}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                {/* Top bar */}
                <div className="flex-none min-h-12 flex items-center gap-3 px-5 py-3 md:px-7">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${
                      card.dark ? "bg-white/[0.14]" : "bg-[oklch(0.94_0.008_75)]"
                    }`}
                  >
                    {card.badge}
                  </span>
                  <span className="text-[13.5px] font-semibold">{card.name}</span>
                </div>

                {/* Floating collage (Desktop original layout) */}
                <div
                  ref={(el) => {
                    gfxRefs.current[i] = el;
                  }}
                  aria-hidden
                  className="pointer-events-none absolute bottom-5 left-[17%] top-[52px] z-0 hidden w-[23%] items-center justify-center will-change-transform md:flex"
                >
                  <Image
                    src={card.collage}
                    alt=""
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>

                {/* Content */}
                <div
                  ref={(el) => {
                    if (i < 4) contentRefs.current[i] = el;
                  }}
                  className="z-10 grid min-h-0 flex-1 grid-cols-1 gap-4 px-5 pb-5 pt-2 md:grid-cols-12 md:items-center md:gap-14 md:overflow-visible md:px-14 md:py-7"
                >
                  <div className="flex min-h-0 flex-col justify-end md:col-span-5 md:justify-center">
                    <Icon className="mb-2 h-5 w-5 flex-none self-start text-accent md:mb-4 md:h-6 md:w-6" />

                    {/* Mobile-only collage image (Hidden on desktop) */}
                    <div className="md:hidden my-1 h-24 w-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={card.collage}
                        alt={card.collageAlt}
                        className="h-full w-auto object-contain drop-shadow-md"
                      />
                    </div>

                    <div>
                      <div className="font-display text-[clamp(20px,3vh,38px)] font-bold tracking-[-0.03em]">
                        {card.statValue}
                      </div>
                      <div
                        className={`mt-1 text-[11px] uppercase tracking-[0.2em] ${
                          card.dark ? "text-white/55" : "text-ink-soft"
                        }`}
                      >
                        {card.statLabel}
                      </div>
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-col justify-end md:col-span-7 md:justify-center">
                    <h3 className="font-display text-[clamp(24px,3vh_+_8px,40px)] font-bold tracking-[-0.025em] leading-[1.12]">
                      {card.headline}
                    </h3>
                    <p
                      className={`mt-2 text-[13px] leading-relaxed max-w-[44ch] md:mt-3 md:text-sm ${
                        card.dark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      {card.body}
                    </p>
                    <div className={`h-px my-3 md:my-6 ${card.dark ? "bg-white/[0.14]" : "bg-line"}`} />
                    <div className="grid grid-cols-3 gap-2 md:flex md:gap-10">
                      {card.features.map((f, fi) => (
                        <div key={f} className="min-w-0">
                          <div
                            className={`text-[10px] tracking-[0.16em] ${
                              card.dark ? "text-white/40" : "text-[oklch(0.60_0.01_60)]"
                            }`}
                          >
                            {String(fi + 1).padStart(2, "0")}
                          </div>
                          <div className="mt-1 text-[11px] leading-tight font-semibold sm:text-[12px] md:text-[13px]">{f}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

