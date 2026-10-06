"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  PackageCheck,
  ShieldCheck,
  MapPin,
  Sparkles,
  Database,
} from "lucide-react";
import { Counter } from "@/components/Counter";
import { HeroPortalGrid } from "@/components/home/hero-portal-grid/HeroPortalGrid";
import amazonAppLogo from "@/assets/marketplace-logos/amazon-app.svg";
import blinkitAppLogo from "@/assets/marketplace-logos/blinkit-app.png";
import flipkartAppLogo from "@/assets/marketplace-logos/flipkart-app.png";
import jiomartAppLogo from "@/assets/marketplace-logos/jiomart-app.svg";
import solvAppLogo from "@/assets/marketplace-logos/solv-app.png";
import swiggyAppLogo from "@/assets/marketplace-logos/swiggy-app.png";
import { IndiaFCMap } from "@/components/site/IndiaFCMap";
import { MarketplaceNetworkDiagram } from "@/components/businesses/MarketplaceNetworkDiagram";
import { ShelfSignalSection } from "@/components/businesses/ShelfSignalSection";

interface Marketplace {
  name: string;
  /** Square icon for the network cards. */
  appLogo: StaticImageData;
  /** The icon is a full-bleed tile: crop it to fill its slot, unpadded. */
  appLogoFill?: boolean;
  subtitle: string;
}

const leftMarketplaces: Marketplace[] = [
  { name: "Amazon", appLogo: amazonAppLogo, subtitle: "FBA & Seller Flex" },
  // Flipkart's icon is a full-bleed yellow tile, so it is cropped to fill its
  // slot rather than sitting inside the padded box the others use.
  { name: "Flipkart", appLogo: flipkartAppLogo, appLogoFill: true, subtitle: "FBF & Assured" },
  { name: "Blinkit", appLogo: blinkitAppLogo, subtitle: "Quick Commerce" },
];

const rightMarketplaces: Marketplace[] = [
  { name: "JioMart", appLogo: jiomartAppLogo, subtitle: "Omnichannel" },
  { name: "SOLV", appLogo: solvAppLogo, subtitle: "B2B Wholesale" },
  { name: "Swiggy", appLogo: swiggyAppLogo, subtitle: "Instamart Network" },
];

const allMarketplaces = [...leftMarketplaces, ...rightMarketplaces];

const journey = [
  { step: "01", title: "Onboard", body: "Brand audit, marketplace strategy and a GTM plan tailored to your category economics." },
  { step: "02", title: "Launch", body: "Catalog live, ads structured, inventory positioned in the right fulfillment centers." },
  { step: "03", title: "Scale", body: "Weekly growth reviews, share-of-shelf wins and a roadmap toward category leadership." },
];

const categories = [
  { title: "Smartphones & accessories", body: "Smartphones move fast. We pair launch planning, sharp pricing and strong availability to compete for every search and every sale." },
  { title: "Large appliances", body: "TVs, refrigerators, washing machines and ACs demand careful delivery and service coordination. We manage the marketplace work behind each sale." },
  { title: "Small appliances & personal tech", body: "Kitchen, audio, wearables, laptops and tablets. High volume SKUs that need pricing, stock and content watched daily." },
  { title: "Marketplace operations", body: "One team owns the details that decide growth: listings, ads, prices, stock and fulfilment." },
];

export function MarketplaceView() {
  const heroRef = useRef<HTMLElement>(null);
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
        className="relative overflow-hidden bg-ink text-white min-h-screen flex items-end pt-32 pb-16"
      >
        {/* Mirrored Three.js perspective grids: ceiling + floor. */}
        <HeroPortalGrid theme="dark" />

        {/* Cursor-follow spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, oklch(0.58 0.22 25 / 0.18), transparent 55%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[12vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.95] tracking-[-0.04em] font-display font-semibold max-w-[16ch]"
          >
            Win every aisle
            <br />
            of India&apos;s <span className="font-serif-display italic text-accent">digital shelf</span>.
          </motion.h1>

          {/* Bottom row: subtitle + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-14 max-w-xl"
          >
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              We operate as a trusted seller partner on India&apos;s largest marketplaces, owning catalog, ads,
              fulfillment and customer experience so brands can focus on the product.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-white text-ink pl-5 pr-2 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Talk to our marketplace team
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white group-hover:bg-brand transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-ink transition-colors"
              >
                See what we do
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE DO: dot sphere wired to the eight in-house capabilities */}
      <ShelfSignalSection />

      {/* MARKETPLACE NETWORK + LIVE OPERATING NUMBERS */}
      <section className="overflow-hidden bg-ink py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/15 border border-brand/30 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Active on
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Six marketplaces <span className="text-white/40">·</span> one operating team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              One connected operation carrying every order from digital shelf to doorstep, across India&apos;s leading e-commerce networks.
            </p>
          </div>

          <MarketplaceNetworkDiagram marketplaces={allMarketplaces} />

          {/* MOBILE RESPONSIVE FALLBACK */}
          <div className="mt-10 space-y-6 md:hidden">
            {/* Mobile Central Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-xs font-medium text-white/80">
                <Sparkles className="h-4 w-4 text-accent shrink-0" />
                <span>Shri Maa Group Marketplace Operations</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/[0.06] p-2.5 border border-white/10">
                  <div className="text-[10px] text-white/50 font-medium">Monthly Orders</div>
                  <div className="text-lg font-bold text-accent">60K+</div>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-2.5 border border-white/10">
                  <div className="text-[10px] text-white/50 font-medium">On-Time Dispatch</div>
                  <div className="text-lg font-bold text-white">99.2%</div>
                </div>
              </div>
            </div>

            {/* Mobile Marketplace Logos Grid */}
            <div className="grid grid-cols-2 gap-3">
              {allMarketplaces.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <Image
                    src={m.appLogo}
                    alt={m.name}
                    className={`h-6 w-6 shrink-0 rounded-md ${m.appLogoFill ? "overflow-hidden object-cover" : "bg-white object-contain p-0.5"}`}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-white/50">{m.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* METRICS & CAPABILITIES */}
          <div className="mt-16 text-center">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={60} suffix="K+" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-white/60">Orders fulfilled<br />every month</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={22} suffix="+" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-white/60">States with<br />fulfillment centers</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={99} suffix=".2%" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-white/60">On-time delivery,<br />weekly average</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={6} suffix="" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-white/60">Marketplaces<br />actively operated</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["Catalog", "Ads", "Inventory", "Fulfillment", "Customer experience"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-white/80">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="py-28 bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">From onboarding to category leadership</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              A repeatable path to <span className="italic font-display text-white/90">category dominance.</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {journey.map((j, i) => (
              <div key={j.step} className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
                <div className="text-xs font-mono text-accent/80">{j.step}</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{j.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{j.body}</p>
                {i < journey.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 h-px w-6 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY EXPERTISE */}
      <section className="py-28 bg-surface text-ink relative overflow-hidden">
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Where we play</div>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
              We win where the competition is <span className="italic font-display">toughest.</span>
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed text-lg">
              Our playbook was built in some of the most competitive categories online. Search ranking, pricing discipline, and fulfillment that lands on time. That operational muscle is what we bring to the table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-3xl overflow-hidden">
            {categories.map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="bg-surface hover:bg-surface-2 transition-colors p-8 md:p-10 min-h-[260px] flex flex-col"
              >
                <h3 className="text-2xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-4 text-ink-soft leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FULFILLMENT FOOTPRINT
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Fulfillment footprint</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              22+ states. <span className="italic font-display">~80% of India&apos;s pincodes.</span>
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              We operate primarily on FBA and FBF, with APOBs registered across 22+ states so inventory
              sits as close to demand as the marketplaces will allow. When FC space tightens around
              peak events, our four Seller Flex sites keep inventory live without missing a beat.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: PackageCheck, label: "FBA + FBF first" },
                { icon: Sparkles, label: "4 Seller Flex sites" },
                { icon: MapPin, label: "APOBs in 22+ states" },
                { icon: ShieldCheck, label: "Peak-event buffer capacity" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
                  <f.icon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-line bg-gradient-to-br from-surface-2 to-white p-4">
              <IndiaFCMap />
            </div>
          </div>
        </div>
      </section>
      */}

    </>
  );
}
