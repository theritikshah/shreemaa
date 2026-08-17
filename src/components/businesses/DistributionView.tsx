"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Store,
  Users,
  Warehouse,
  BarChart3,
  TrendingUp,
  Megaphone,
  Truck,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Counter } from "@/components/Counter";
import hero from "@/assets/infra-warehouse.jpg";
import accent from "@/assets/infra-warehouse-interior.jpg";

const stats = [
  { value: 90, suffix: "K+", label: "Retailers" },
  { value: 800, suffix: "+", label: "Distributors" },
  { value: 100, suffix: "+", label: "Manufacturers" },
];

const capabilities = [
  {
    icon: Store,
    title: "Retail network management",
    body: "Retailer onboarding, engagement and relationships across every tier of the market.",
  },
  {
    icon: Users,
    title: "Distributor partnerships",
    body: "Qualifying and activating the right distributor partners for each region and category.",
  },
  {
    icon: Warehouse,
    title: "Owned warehousing",
    body: "300,000+ sq ft of company-operated storage built for throughput and fast dispatch.",
  },
  {
    icon: Truck,
    title: "Field sales operations",
    body: "A trained ground force driving orders, shelf presence and on-the-counter execution.",
  },
  {
    icon: Megaphone,
    title: "Trade marketing",
    body: "In-store activations, scheme rollouts and visibility drives that move stock at the counter.",
  },
  {
    icon: BarChart3,
    title: "Secondary sales analytics",
    body: "Live visibility into what's selling, where and how fast, so decisions are never delayed.",
  },
];

export function DistributionView() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image src={hero} alt="" fill sizes="100vw" className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-brand/40" />
          <div className="absolute -top-32 -right-20 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-[0.18em] font-medium">
              <Network className="h-3 w-3" /> Distribution Network
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              India&apos;s most trusted{" "}
              <span className="italic font-display text-white/90">
                route to retail.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              90,000+ retailers, 800+ distributor partners and a trained field
              force, working as one engine to put brands on every shelf that
              matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition"
              >
                Talk to our distribution team{" "}
                <ArrowRight className="h-4 w-4" />
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

      {/* STATS STRIP */}
      <section className="bg-surface-2 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-brand-gradient">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-ink-soft leading-snug">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
                What we do
              </div>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                The full distribution stack,{" "}
                <span className="italic font-display">
                  operated in-house.
                </span>
              </h2>
            </div>
            <p className="lg:col-span-5 text-ink-soft leading-relaxed">
              Every capability is operated by specialist teams with decades of
              category experience. From warehouse to counter, we own the chain.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-3xl overflow-hidden">
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
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORK REACH */}
      <section className="py-28 bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
              Network reach
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              From metro to{" "}
              <span className="italic font-display text-white/90">
                micro-market.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Tier-1 to tier-3 coverage
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Metros to deep tier-3 towns. Our field force and distributor
                partners ensure brands stay on shelf, no matter how remote the
                market.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Owned + partner infrastructure
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                300,000+ sq ft of owned warehousing, complemented by partner
                facilities for fast, cost-efficient last-mile distribution
                across the country.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Sell-out and activation
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                We don&apos;t stop at sell-in. From in-store demos to device
                activations, we make sure stock actually moves off the shelf
                and into the hands of real consumers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE IMAGE */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-line bg-gradient-to-br from-surface-2 to-white p-2">
              <Image
                src={accent}
                alt="Owned warehouse interior"
                className="w-full h-[460px] object-cover rounded-[20px]"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Infrastructure
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Warehousing built{" "}
              <span className="italic font-display">for throughput.</span>
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              Our facilities are designed around the realities of Indian
              distribution: high SKU counts, seasonal spikes and the need to
              dispatch fast. Every warehouse is company-operated, giving us
              direct control over inventory accuracy, safety standards and
              turnaround times.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: Warehouse, label: "300K+ sq ft owned" },
                { icon: Truck, label: "Pan-India dispatch" },
                { icon: TrendingUp, label: "Seasonal scaling" },
                { icon: ShieldCheck, label: "Quality control" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-4"
                >
                  <f.icon className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
