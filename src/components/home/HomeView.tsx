"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Package, Building2, Ship, Store } from "lucide-react";
import { ImpactSection } from "@/components/home/ImpactSection";
import { OurBusinessesSection } from "@/components/home/OurBusinessesSection";
import { ScaleOffersSection } from "@/components/home/ScaleOffersSection";
import { HeroPortalGrid } from "@/components/home/hero-portal-grid/HeroPortalGrid";
import warehouse from "@/assets/infra-warehouse.jpg";

const brands = ["Amazon", "Flipkart", "Samsung", "Xiaomi", "OPPO", "vivo", "realme", "Lenovo", "ASUS", "boAt", "Croma", "Reliance Digital"];

export function HomeView() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.4 });

  return (
    <>
      {/* HERO - editorial, cursor-spotlight */}
      <section
        ref={heroRef}
        onMouseMove={(e) => {
          const r = heroRef.current?.getBoundingClientRect();
          if (!r) return;
          setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="relative overflow-hidden bg-surface text-ink min-h-screen flex items-end pt-32 pb-16"
      >
        {/* Mirrored Three.js perspective grids: ceiling + floor. */}
        <HeroPortalGrid />

        {/* Cursor-follow spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, oklch(0.58 0.22 25 / 0.10), transparent 55%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[14vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.95] tracking-[-0.04em] font-display font-semibold max-w-[16ch]"
          >
            The launchpad
            <br />
            for <span className="font-serif-display italic text-brand">global brands</span>.
          </motion.h1>


          {/* Bottom row: subtitle + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-14 max-w-xl"
          >
            <p className="text-base md:text-lg text-ink-soft leading-relaxed">
              A global commerce network, helping the world&apos;s leading brands launch, scale and operate across e-commerce, retail, distribution and international trade.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/businesses/marketplace-operations"
                className="group inline-flex items-center gap-2 bg-ink text-white pl-5 pr-2 py-2 rounded-full text-sm font-medium hover:bg-ink/85 transition-colors"
              >
                Explore businesses
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink group-hover:bg-brand group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-ink/15 text-ink px-5 py-2 rounded-full text-sm font-medium hover:bg-ink hover:text-white transition-colors"
              >
                Partner with us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-14 bg-surface-2 border-y border-line overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-8">
          <p className="text-center text-[10px] uppercase tracking-[0.28em] text-ink-soft font-medium">
            Trusted by global brands & India&apos;s largest marketplaces
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-xl md:text-2xl font-display font-semibold text-ink/35 hover:text-ink/80 transition-colors">
                {b}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-2 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-2 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* IMPACT AT SCALE */}
      <ImpactSection />

      {/* WHO WE ARE - interactive eras */}
      <WhoWeAre />

      {/* OUR BUSINESSES */}
      <OurBusinessesSection />

      {/* WHY BRANDS CHOOSE SMG */}
      {/* <WhyBrandsSection /> */}

      {/* FULL-BLEED SCALE OFFERS */}
      <ScaleOffersSection />

      {/* INFRASTRUCTURE
      <section className="bg-surface-2 overflow-hidden">
        <div className="pt-28 md:pt-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Infrastructure</div>
              <h2 className="mt-3 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1]">
                The backbone<br />behind the brands.
              </h2>
            </div>
            <p className="lg:col-span-4 text-ink-soft text-[17px] leading-[1.65]">
              Warehouses, fulfillment centers and offices across the country — owned, operated and accountable.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-ink">
          <InfrastructureBanner />

          <div className="px-6 lg:px-10 pb-20 md:pb-24">
            <div className="mx-auto max-w-7xl border-t border-white/[0.14] grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
              {[
                { icon: Package, n: "70+", label: "Fulfillment centers", desc: "Positioned close to demand across 21 cities." },
                { icon: Building2, n: "9", label: "Global offices", desc: "Gurgaon HQ, with teams across five regions." },
                { icon: Ship, n: "5", label: "Trade regions", desc: "Sourcing and export lanes, port to shelf." },
                { icon: Store, n: "80K+", label: "Retailers served", desc: "From metros through to deep tier-3 towns." },
              ].map((s) => (
                <div key={s.label} className="bg-ink p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-[10px] border border-white/[0.22] text-brand-3">
                      <s.icon className="h-[22px] w-[22px]" />
                    </div>
                    <div className="font-display text-[30px] font-semibold tracking-[-0.03em] text-white">{s.n}</div>
                  </div>
                  <div className="mt-5 text-[10px] uppercase tracking-[0.2em] text-brand-3 font-semibold">{s.label}</div>
                  <div className="mt-2 max-w-[30ch] text-[13px] leading-[1.65] text-white/60">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

    </>
  );
}

const eras = [
  {
    year: "1997",
    tag: "Foundations",
    title: "A trading house is born.",
    body: "SMG begins in Bhopal, building the retailer and supplier relationships that still anchor the group today.",
    metric: "Year one",
  },
  {
    year: "2008",
    tag: "Distribution",
    title: "Scale across India.",
    body: "Distribution expands to 80,000+ retailers and 600+ partners, making SMG one of central India's most trusted networks.",
    metric: "80K+ retailers",
  },
  {
    year: "2017",
    tag: "Digital commerce",
    title: "Built for marketplaces.",
    body: "We move online, becoming a top operator on Amazon, Flipkart and the next generation of Indian marketplaces.",
    metric: "55K+ orders / mo",
  },
  {
    year: "2024",
    tag: "Global trade",
    title: "Across borders.",
    body: "Rio World and OYU Green extend the group into international trade and climate solutions for the next decade of growth.",
    metric: "Cross-border",
  },
];

const kineticWords = ["commerce.", "distribution.", "marketplaces.", "exports."];

const PARALLAX_DEPTH = 60;

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
    <div ref={frameRef} className="relative h-[520px] overflow-hidden">
      <div ref={imgRef} className="absolute -top-[25%] left-0 h-[150%] w-full will-change-transform">
        <Image src={warehouse} alt="Warehouse" fill sizes="100vw" className="object-cover" priority />
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
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function WhoWeAre() {
  const [active, setActive] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % kineticWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  const era = eras[active];

  return (
    <section className="relative overflow-hidden bg-ink text-white py-28 md:py-36">
      {/* ambient glows */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand/30 blur-[140px]" />
      <div className="absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full bg-brand-3/20 blur-[160px]" />
      {/* hairline grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.24em] text-brand font-semibold">Who we are</div>
            <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
              Three decades.
              <br />
              One network for{" "}
              <span className="relative inline-block align-baseline text-brand font-serif-display italic">
                <span className="invisible" aria-hidden="true">marketplaces.</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0"
                  >
                    {kineticWords[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
          <p className="md:max-w-xs text-white/65 leading-relaxed">
            From one distribution business in Bhopal to five businesses connecting brands and markets, SMG has grown with the way India buys and sells. Founded in 1997, the group now spans e-commerce, distribution, trading, exports and sustainability.
          </p>
        </div>

        {/* Interactive eras */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Era picker */}
          <div className="lg:col-span-5">
            <ul>
              {eras.map((e, i) => {
                const isActive = active === i;
                return (
                  <li key={e.year}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group w-full text-left py-5 flex items-center gap-6 transition-colors"
                    >
                      <span
                        className={`text-sm font-mono tabular-nums transition-colors ${isActive ? "text-brand" : "text-white/40 group-hover:text-white/70"
                          }`}
                      >
                        {e.year}
                      </span>
                      <span
                        className={`relative flex-1 text-2xl md:text-3xl font-display tracking-tight transition-all ${isActive ? "text-white translate-x-1" : "text-white/55 group-hover:text-white/85"
                          }`}
                      >
                        {e.tag}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={{ width: isActive ? 56 : 12, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-px bg-brand-gradient"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold border-b border-white/30 pb-1 hover:border-brand hover:text-brand transition-colors"
            >
              More about SMG <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Era detail card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 min-h-[360px] overflow-hidden">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={era.year}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Chapter {String(active + 1).padStart(2, "0")} · {era.year}
                  </div>
                  <h3 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                    {era.title}
                  </h3>
                  <p className="mt-6 text-white/75 text-lg leading-relaxed max-w-xl">
                    {era.body}
                  </p>
                  <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 text-sm">
                    <span className="text-brand font-semibold">{era.metric}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span className="text-white/60">{era.tag}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mini stats strip */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {[
                ["30 yrs", "In market"],
                ["5", "Businesses"],
                ["Pan-India", "Footprint"],
                ["Global", "Reach"],
              ].map(([n, l]) => (
                <div key={l} className="bg-ink p-5">
                  <div className="text-xl md:text-2xl font-display font-semibold tracking-tight">{n}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/50 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
