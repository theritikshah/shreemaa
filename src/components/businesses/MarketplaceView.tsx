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
} from "lucide-react";
import { Counter } from "@/components/Counter";
import heroMarketplace from "@/assets/hero-marketplace.jpg";
import { IndiaFCMap } from "@/components/site/IndiaFCMap";

const marketplaces = [
  { name: "Amazon", note: "FBA + Seller Flex" },
  { name: "Flipkart", note: "FBF + Self-ship" },
  { name: "Blinkit", note: "Quick commerce" },
  { name: "JioMart", note: "Omni-channel" },
  { name: "Solv", note: "B2B commerce" },
  { name: "Swiggy", note: "Instamart" },
];

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
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image src={heroMarketplace} alt="" fill sizes="100vw" className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-brand/40" />
          <div className="absolute -top-32 -right-20 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-[0.18em] font-medium">
              <ShoppingBag className="h-3 w-3" /> Marketplace Operations
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              Win every aisle of India&apos;s <span className="italic font-display text-white/90">digital shelf.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              We operate as a trusted seller partner on India&apos;s largest marketplaces, owning catalog,
              ads, fulfillment and customer experience so brands can focus on the product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition"
              >
                Talk to our marketplace team <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/25 px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 transition"
              >
                See what we do
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE PARTNERS — typographic marquee-style band */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
          <div className="flex items-baseline justify-between gap-6 mb-8">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-soft font-semibold">
              Active on
            </div>
            <div className="text-xs text-ink-soft hidden md:block">Six marketplaces · one operating team</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {marketplaces.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative bg-white hover:bg-surface-2 transition-colors p-7 flex flex-col justify-center items-start min-h-[140px]"
              >
                <div className="text-2xl font-bold tracking-tight">{m.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#ef4444] [text-shadow:0_0_12px_rgba(239,68,68,0.55)]">{m.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE OPS COUNTER STRIP */}
      <section className="bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-brand-gradient">
              <Counter to={60} suffix="K+" />
            </div>
            <div className="mt-2 text-sm text-ink-soft leading-snug">Orders fulfilled<br />every month</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-brand-gradient">
              <Counter to={22} suffix="+" />
            </div>
            <div className="mt-2 text-sm text-ink-soft leading-snug">States with<br />fulfillment centers</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-brand-gradient">
              <Counter to={99} suffix=".2%" />
            </div>
            <div className="mt-2 text-sm text-ink-soft leading-snug">On-time delivery,<br />weekly average</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-brand-gradient">
              <Counter to={6} suffix="" />
            </div>
            <div className="mt-2 text-sm text-ink-soft leading-snug">Marketplaces<br />actively operated</div>
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
