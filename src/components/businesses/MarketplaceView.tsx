"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  PackageCheck,
  LineChart,
  Megaphone,
  Layers,
  Headphones,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Boxes,
  Sparkles,
  Database,
  RefreshCw,
} from "lucide-react";
import { Counter } from "@/components/Counter";
import { CommandHeroExperience } from "@/components/command-hero/CommandHeroExperience";
import { HeroCopy } from "@/components/command-hero/HeroCopy";
import { MARKETPLACE_COPY } from "@/components/command-hero/config";
import amazonLogo from "@/assets/marketplace-logos/amazon-horizontal.svg";
import blinkitLogo from "@/assets/marketplace-logos/blinkit-horizontal.png";
import flipkartLogo from "@/assets/marketplace-logos/flipkart-horizontal.png";
import jiomartLogo from "@/assets/marketplace-logos/jiomart-horizontal.svg";
import solvLogo from "@/assets/marketplace-logos/solv-horizontal.svg";
import swiggyLogo from "@/assets/marketplace-logos/swiggy-horizontal.png";

import amazonAppLogo from "@/assets/marketplace-logos/amazon-app.svg";
import blinkitAppLogo from "@/assets/marketplace-logos/blinkit-app.png";
import flipkartAppLogo from "@/assets/marketplace-logos/flipkart-app.svg";
import jiomartAppLogo from "@/assets/marketplace-logos/jiomart-app.svg";
import solvAppLogo from "@/assets/marketplace-logos/solv-app.png";
import swiggyAppLogo from "@/assets/marketplace-logos/swiggy-app.png";
import { IndiaFCMap } from "@/components/site/IndiaFCMap";

const leftMarketplaces = [
  { name: "Amazon", logo: amazonLogo, appLogo: amazonAppLogo, subtitle: "FBA & Seller Flex" },
  { name: "Flipkart", logo: flipkartLogo, appLogo: flipkartAppLogo, subtitle: "FBF & Assured" },
  { name: "Blinkit", logo: blinkitLogo, appLogo: blinkitAppLogo, subtitle: "Quick Commerce" },
];

const rightMarketplaces = [
  { name: "JioMart", logo: jiomartLogo, appLogo: jiomartAppLogo, subtitle: "Omnichannel" },
  { name: "SOLV", logo: solvLogo, appLogo: solvAppLogo, subtitle: "B2B Wholesale" },
  { name: "Swiggy", logo: swiggyLogo, appLogo: swiggyAppLogo, subtitle: "Instamart Network" },
];

const allMarketplaces = [...leftMarketplaces, ...rightMarketplaces];

const capabilities = [
  { icon: Layers, title: "Catalog & content", body: "Listing setup, A+ content, storefronts, image production and SEO across every marketplace." },
  { icon: Megaphone, title: "Performance marketing", body: "Full-funnel sponsored ads, DSP, coupons and deal planning tuned to category economics." },
  { icon: LineChart, title: "Growth strategy", body: "Pricing, assortment, share-of-shelf and competitive intelligence reviews every week." },
  { icon: Boxes, title: "Inventory planning", body: "Demand forecasting and replenishment across FBA, FBF and Seller Flex networks." },
  { icon: Truck, title: "Multi-state fulfillment", body: "APOBs across 22+ states covering ~80% of India's pincodes with same-day dispatch SLAs." },
  { icon: Headphones, title: "Customer experience", body: "Trained CX team handling pre-sale, post-sale and escalation queues 12 hours a day." },
  { icon: RotateCcw, title: "Returns & RTO", body: "Reverse logistics, refurb and re-sell flows that protect margin and rating." },
  { icon: ShieldCheck, title: "Marketplace compliance", body: "Account health, GST, tax invoicing and policy adherence across every registration." },
];

const journey = [
  { step: "01", title: "Onboard", body: "Brand audit, marketplace strategy and a GTM plan tailored to your category economics." },
  { step: "02", title: "Launch", body: "Catalog live, ads structured, inventory positioned in the right fulfillment centers." },
  { step: "03", title: "Scale", body: "Weekly growth reviews, share-of-shelf wins and a roadmap toward category leadership." },
];

const categories = [
  { title: "Smartphones & accessories", body: "Tight brand relationships and sharp pricing keep us near the top of search on every marketplace." },
  { title: "Large appliances", body: "TVs, refrigerators, washing machines, ACs. Heavy boxes, installation, and white glove handled end to end." },
  { title: "Small appliances & personal tech", body: "Kitchen, audio, wearables, laptops and tablets. High volume SKUs that need pricing, stock and content watched daily." },
  { title: "Marketplace operations", body: "Catalog, ads, inventory, and fulfillment. The full stack run under one roof so nothing falls between the cracks." },
];

export function MarketplaceView() {
  return (
    <>
      {/* HERO: particles → rings → "Every marketplace, on command." */}
      <CommandHeroExperience
        copy={MARKETPLACE_COPY}
        hero={
          <HeroCopy
            eyebrow={
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur">
                <ShoppingBag className="h-3 w-3" /> Marketplace Operations
              </div>
            }
            title={
              <>
                Win every aisle of India&apos;s <span className="font-display italic text-white/90">digital shelf.</span>
              </>
            }
            description={
              <>
                We operate as a trusted seller partner on India&apos;s largest marketplaces, owning catalog, ads,
                fulfillment and customer experience so brands can focus on the product.
              </>
            }
            actions={
              <>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white/90"
                >
                  Talk to our marketplace team <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  See what we do
                </a>
              </>
            }
          />
        }
      />

      {/* MARKETPLACE NETWORK + LIVE OPERATING NUMBERS */}
      <section className="overflow-hidden border-b border-line bg-[#FAFBFD] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Active on
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Six marketplaces <span className="text-ink-soft">·</span> one operating team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
              One connected operation carrying every order from digital shelf to doorstep, across India&apos;s leading e-commerce networks.
            </p>
          </div>

          {/* DESKTOP NODE GRAPH DIAGRAM: MARKETPLACES (LEFT) -> DEMAND -> SHRI MAA HUB (CENTER) -> FULFILLMENT -> 22-STATE FCs (RIGHT) */}
          <div className="relative mx-auto mt-12 hidden min-h-[520px] max-w-6xl md:block">
            {/* SVG Connecting Path Tree */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1000 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="glow-line-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="glow-line-right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* 6 Left Marketplace Paths -> Demand Junction (260, 240) */}
              <path d="M 140 40 C 200 40, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 140 115 C 200 115, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 140 190 C 200 190, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 140 265 C 200 265, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 140 340 C 200 340, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 140 415 C 200 415, 200 240, 260 240" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />

              {/* Demand Junction (295, 240) -> Center Card Left Edge (355, 240) */}
              <path d="M 295 240 L 355 240" stroke="url(#glow-line-left)" strokeWidth="2.5" />

              {/* Center Card Right Edge (645, 240) -> Fulfillment Junction (705, 240) */}
              <path d="M 645 240 L 705 240" stroke="url(#glow-line-right)" strokeWidth="2.5" />

              {/* Fulfillment Junction (740, 240) -> 3 Right Fulfillment Nodes */}
              <path d="M 740 240 C 800 240, 800 80, 840 80" stroke="#CBD5E1" strokeWidth="1.75" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 740 240 L 840 240" stroke="#CBD5E1" strokeWidth="1.75" />
              <path d="M 740 240 C 800 240, 800 400, 840 400" stroke="#CBD5E1" strokeWidth="1.75" strokeDasharray="4 4" className="animate-pulse" />
            </svg>

            {/* LEFT NODES: ALL 6 ACTIVE MARKETPLACES */}
            <div className="absolute left-[20px] top-[15px] z-10 space-y-3.5 w-[145px]">
              {allMarketplaces.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, x: 3 }}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white p-2 shadow-[0_6px_20px_-4px_rgba(15,23,42,0.06)] transition-all hover:border-brand/40 hover:shadow-md cursor-pointer"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 p-1">
                    <Image src={m.appLogo} alt={m.name} className="h-5 w-5 object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate">{m.name}</div>
                    <div className="text-[9px] font-medium text-slate-400 truncate">{m.subtitle}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* LEFT JUNCTION: DEMAND BADGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute left-[235px] top-[220px] z-20 flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-700"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Demand</span>
            </motion.div>

            {/* CENTER FLOATING CARD: SHRI MAA GROUP MARKETPLACE OPERATIONS HUB */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="absolute left-[355px] top-[30px] z-20 w-[290px] rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-5 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.12)]"
            >
              {/* TOP OPERATIONAL CONTROL HEADER */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2.5 text-xs text-slate-700 shadow-2xs">
                <Sparkles className="h-4 w-4 text-brand shrink-0 animate-spin-slow" />
                <span className="truncate font-medium text-slate-700">
                  Shri Maa <span className="font-semibold text-ink">Operations Desk</span>
                </span>
              </div>

              {/* SHRI MAA GROUP CORE CAPABILITIES */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-slate-100/70 px-3 py-2.5 text-[11px] font-medium text-slate-700 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand shrink-0" />
                    <span>Catalog & A+ Content</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Live SEO</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-100/70 px-3 py-2.5 text-[11px] font-medium text-slate-700 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-brand shrink-0" />
                    <span>Performance Ads & DSP</span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Full-Funnel</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-100/70 px-3 py-2.5 text-[11px] font-medium text-slate-700 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-brand shrink-0" />
                    <span>Demand & Inventory</span>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">22 States</span>
                </div>
              </div>

              {/* RADAR WAVE & FULFILLMENT ENGINE GRAPHIC */}
              <div className="relative mt-6 flex h-28 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-slate-100/80 to-transparent p-2">
                <div className="absolute bottom-2 h-32 w-32 rounded-full border border-brand/20 bg-brand/5 animate-ping opacity-30" />
                <div className="absolute bottom-2 h-20 w-20 rounded-full border border-slate-300/80 bg-white/70 backdrop-blur" />
                <div className="absolute bottom-2 h-12 w-12 rounded-full border border-brand/40 bg-brand/10" />

                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-xl ring-4 ring-white">
                  <Truck className="h-5 w-5 text-brand" />
                </div>
              </div>
            </motion.div>

            {/* RIGHT JUNCTION: FULFILLMENT BADGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute right-[225px] top-[220px] z-20 flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl border border-slate-700"
            >
              <RefreshCw className="h-3 w-3 text-brand animate-spin-slow" />
              <span>Fulfillment</span>
            </motion.div>

            {/* RIGHT NODES: MULTI-STATE FULFILLMENT NETWORK */}
            <div className="absolute right-[20px] top-[55px] z-10 space-y-[90px] w-[150px]">
              {[
                { title: "FBA & FBF FCs", sub: "Prime & Assured", icon: PackageCheck },
                { title: "4x Seller Flex", sub: "Peak-event buffer", icon: Sparkles },
                { title: "22-State APOBs", sub: "~80% Pincode SLA", icon: MapPin },
              ].map((fn, i) => (
                <motion.div
                  key={fn.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, x: -3 }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-[0_8px_25px_-6px_rgba(15,23,42,0.08)] transition-all hover:border-brand/40 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 border border-brand/20 p-1.5 text-brand shadow-2xs">
                    <fn.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">{fn.title}</div>
                    <div className="text-[10px] font-medium text-slate-400">{fn.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MOBILE RESPONSIVE FALLBACK */}
          <div className="mt-10 space-y-6 md:hidden">
            {/* Mobile Central Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                <Sparkles className="h-4 w-4 text-brand shrink-0" />
                <span>Shri Maa Group Marketplace Operations</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Monthly Orders</div>
                  <div className="text-lg font-bold text-brand">60K+</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">On-Time Dispatch</div>
                  <div className="text-lg font-bold text-slate-900">99.2%</div>
                </div>
              </div>
            </div>

            {/* Mobile Marketplace Logos Grid */}
            <div className="grid grid-cols-2 gap-3">
              {allMarketplaces.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                >
                  <Image src={m.appLogo} alt={m.name} className="h-6 w-6 object-contain" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* METRICS & CAPABILITIES */}
          <div className="mt-16 text-center">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={60} suffix="K+" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">Orders fulfilled<br />every month</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={22} suffix="+" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">States with<br />fulfillment centers</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={99} suffix=".2%" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">On-time delivery,<br />weekly average</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <div className="text-3xl font-bold tracking-tight text-brand-gradient lg:text-4xl"><Counter to={6} suffix="" /></div>
                <div className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">Marketplaces<br />actively operated</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["Catalog", "Ads", "Inventory", "Fulfillment", "Customer experience"].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* BOTTOM BRAND LOGO STRIP */}
          <div className="mt-16 pt-10 border-t border-slate-200/80 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Operating natively on India&apos;s premier digital commerce networks
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {allMarketplaces.map((m) => (
                <Image
                  key={m.name}
                  src={m.logo}
                  alt={`${m.name} logo`}
                  className="h-7 w-auto max-w-[110px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID — refined with mixed sizing inspired by vuna */}
      <section id="capabilities" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">What we do</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                The full marketplace stack, <span className="italic font-display">operated in-house.</span>
              </h2>
            </div>
            <p className="lg:col-span-5 text-ink-soft leading-relaxed">
              From the first listing to the millionth order, every function sits under one roof. No agencies,
              no handoffs, no finger pointing when something needs to move.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-3xl overflow-hidden">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                className="group relative bg-white p-7 hover:bg-surface-2 transition-colors min-h-[220px] flex flex-col"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
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
                <div className="text-xs font-mono text-brand/80">{j.step}</div>
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
      <section className="py-28 bg-ink text-white relative overflow-hidden">
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Where we play</div>
            <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
              We win where the competition is <span className="italic font-display text-white/80">toughest.</span>
            </h2>
            <p className="mt-5 text-white/70 leading-relaxed text-lg">
              Our playbook was built in some of the most competitive categories online. Search ranking, pricing discipline, and fulfillment that lands on time. That operational muscle is what we bring to the table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
            {categories.map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="bg-ink hover:bg-white/[0.04] transition-colors p-8 md:p-10 min-h-[260px] flex flex-col"
              >
                <h3 className="text-2xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-4 text-white/70 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FULFILLMENT FOOTPRINT */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Fulfillment footprint</div>
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
                  <f.icon className="h-4 w-4 text-brand" />
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

    </>
  );
}
