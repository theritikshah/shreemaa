"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ShoppingBag, Truck, Cpu, Globe2, Leaf, MapPin, Building2 } from "lucide-react";
import { Counter } from "@/components/Counter";
import warehouse from "@/assets/infra-warehouse.jpg";
import fulfillment from "@/assets/infra-fulfillment.jpg";
import office from "@/assets/infra-office.jpg";
import port from "@/assets/infra-port.jpg";
import retail from "@/assets/infra-retail.jpg";

const brands = ["Amazon", "Flipkart", "Samsung", "Xiaomi", "OPPO", "vivo", "realme", "Lenovo", "ASUS", "boAt", "Croma", "Reliance Digital"];

const businesses = [
  { to: "/businesses/marketplace-operations", title: "Marketplace Operations", desc: "End-to-end seller services across Amazon, Flipkart and India's leading marketplaces.", icon: ShoppingBag, kpi: "55,000+ orders / month" },
  { to: "/businesses/distribution-network", title: "Distribution Network", desc: "Delivering brands to 80,000+ retailers through 600+ distribution partners.", icon: Truck, kpi: "80% pincode coverage" },
  { to: "/businesses/commerce-trading", title: "Commerce Trading", desc: "Large-scale procurement and trading of smartphones and consumer electronics.", icon: Cpu, kpi: "100+ manufacturers" },
  { to: "/businesses/global-trade", title: "Global Trade · Rio World", desc: "Trusted cross-border partnerships powering exports and international commerce.", icon: Globe2, kpi: "Cross-border" },
  { href: "https://www.oyugreen.com", title: "Sustainability · OYU Green", desc: "Carbon markets and climate solutions for the next decade of growth.", icon: Leaf, kpi: "Climate forward" },
];

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
        {/* Cursor-follow spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, oklch(0.58 0.22 25 / 0.10), transparent 55%)`,
          }}
        />
        {/* Hairline grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.17 0.01 60 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.17 0.01 60 / 0.06) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
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
              <span key={i} className="text-xl md:text-2xl font-serif-display italic text-ink/35 hover:text-ink/80 transition-colors">
                {b}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-2 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-2 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* IMPACT AT SCALE */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Impact at scale</div>
              <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-2xl">
                Numbers that define <span className="text-brand-gradient">India-wide reach.</span>
              </h2>
            </div>
            <p className="md:max-w-sm text-ink-soft leading-relaxed">
              For nearly three decades, SMG has built one of the country&apos;s most powerful commerce networks, spanning marketplaces, retail, distribution, trade and exports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-3xl overflow-hidden border border-line">
            {[
              { n: 100, suf: "M+", label: "Consumers reached" },
              { n: 80000, suf: "+", label: "Retailers in network" },
              { n: 100, suf: "+", label: "Manufacturers" },
              { n: 600, suf: "+", label: "Distribution partners" },
              { n: 4000, suf: "+ Cr", label: "Annual revenue (₹)" },
              { n: 150, suf: "K+ sq ft", label: "Infrastructure" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-10 hover:bg-surface-2 transition-colors group">
                <div className="text-5xl md:text-6xl font-bold font-display tracking-tight whitespace-nowrap">
                  <Counter to={s.n} suffix={s.suf} />
                </div>
                <div className="mt-3 text-sm text-ink-soft uppercase tracking-wider">{s.label}</div>
                <div className="mt-6 h-0.5 w-10 bg-brand-gradient group-hover:w-24 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE - interactive eras */}
      <WhoWeAre />

      {/* OUR BUSINESSES */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Our businesses</div>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
              Five businesses. One commerce engine.
            </h2>
            <p className="mt-5 text-lg text-ink-soft leading-relaxed">
              From marketplace operations to global trade, every business is built to give partner brands deeper reach, faster scale and stronger execution in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b, i) => {
              const Icon = b.icon;
              const isLarge = i === 0;
              const cardClass = `group relative overflow-hidden rounded-3xl border border-line bg-white p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 ${
                isLarge ? "md:col-span-2 lg:row-span-2 lg:col-span-1" : ""
              }`;
              const cardContent = (
                <>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(225,27,34,0.08),transparent_60%)]" />
                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight">{b.title}</h3>
                    <p className="mt-3 text-ink-soft leading-relaxed">{b.desc}</p>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-brand font-semibold">{b.kpi}</span>
                      <ArrowUpRight className="h-5 w-5 text-ink/40 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </div>
                </>
              );
              const key = b.to || b.href;
              if (b.href) {
                return (
                  <a key={key} href={b.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                    {cardContent}
                  </a>
                );
              }
              return (
                <Link key={key} href={b.to!} className={cardClass}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY BRANDS CHOOSE SMG */}
      <section className="py-28 md:py-36 bg-surface-2">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Why brands choose SMG</div>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">Built for serious scale.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-3xl overflow-hidden border border-line">
            {[
              ["Nationwide Reach", "Active presence across India with 80% pincode coverage and 15+ fulfillment centers."],
              ["Marketplace Expertise", "Deep operational fluency with Amazon, Flipkart and emerging marketplaces."],
              ["Distribution Leadership", "Three decades of relationships with 80,000+ retailers and 600+ distributors."],
              ["Infrastructure at Scale", "150K+ sq ft of owned warehousing and operational facilities."],
              ["Capital Strength", "₹4,000+ crore revenue base supporting working capital for partner brands."],
              ["Long-Term Partnerships", "Multi-decade relationships with India's most demanding manufacturers."],
            ].map(([t, d]) => (
              <div key={t} className="bg-white p-8 hover:bg-surface-2 transition-colors group">
                <div className="h-1 w-8 bg-brand-gradient mb-5 group-hover:w-16 transition-all duration-500" />
                <h3 className="text-xl font-bold tracking-tight">{t}</h3>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Infrastructure</div>
              <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
                Owned. Operated.<br />Built for India.
              </h2>
            </div>
            <p className="lg:col-span-5 text-ink-soft text-lg leading-relaxed self-end">
              Warehouses, fulfillment centers and offices across the country. The physical backbone behind every brand we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 relative rounded-3xl overflow-hidden group h-96">
              <Image src={warehouse} alt="Warehouse" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">Distribution hub</div>
                <div className="text-2xl font-bold mt-1">National warehousing footprint</div>
              </div>
            </div>
            <div className="md:col-span-5 relative rounded-3xl overflow-hidden group h-96">
              <Image src={fulfillment} alt="Fulfillment center" fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">Fulfillment</div>
                <div className="text-2xl font-bold mt-1">70+ centers</div>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-3xl overflow-hidden group h-72">
              <Image src={office} alt="Office" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">Headquarters</div>
                <div className="text-xl font-bold mt-1">Mumbai · India</div>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-3xl overflow-hidden group h-72">
              <Image src={port} alt="Port" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">Global trade</div>
                <div className="text-xl font-bold mt-1">Cross-border logistics</div>
              </div>
            </div>
            <div className="md:col-span-4 relative rounded-3xl overflow-hidden group h-72">
              <Image src={retail} alt="Retail" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70">Retail</div>
                <div className="text-xl font-bold mt-1">80,000+ stores reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient animate-gradient p-12 md:p-20 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.3),transparent_60%)]" />
            <div className="relative max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Ready to launch or scale in India?
              </h2>
              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl">
                Let&apos;s discuss how SMG&apos;s commerce network can accelerate your brand&apos;s growth across the country.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                  Start the conversation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
                  About SMG
                </Link>
              </div>
            </div>
            <Building2 className="absolute -right-12 -bottom-12 h-72 w-72 text-white/10" />
            <MapPin className="absolute right-32 top-12 h-12 w-12 text-white/20 animate-float-slow" />
          </div>
        </div>
      </section>
    </>
  );
}

const eras = [
  {
    year: "1996",
    tag: "Foundations",
    title: "A trading house is born.",
    body: "SMG begins as a regional distributor in Bhopal, building the relationships and rigor that still anchor the group today.",
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
            Since 1996, SMG has helped leading brands launch, scale and operate across India. Today the group spans e-commerce, distribution, trading, exports and sustainability.
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
                        className={`text-sm font-mono tabular-nums transition-colors ${
                          isActive ? "text-brand" : "text-white/40 group-hover:text-white/70"
                        }`}
                      >
                        {e.year}
                      </span>
                      <span
                        className={`relative flex-1 text-2xl md:text-3xl font-display tracking-tight transition-all ${
                          isActive ? "text-white translate-x-1" : "text-white/55 group-hover:text-white/85"
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
