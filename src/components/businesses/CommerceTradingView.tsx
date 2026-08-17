"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Boxes,
  LineChart,
  Handshake,
  Wallet,
  Radar,
  ShieldCheck,
  Zap,
  Globe2,
  TrendingUp,
} from "lucide-react";
import { Counter } from "@/components/Counter";
import hero from "@/assets/infra-electronics.jpg";
import tradingShowroom from "@/assets/trading-showroom.jpg";

const stats = [
  { value: 4000, prefix: "₹", suffix: "Cr+", label: "Annual trade volume" },
  { value: 100, suffix: "+", label: "Manufacturer partners" },
  { value: 1000, suffix: "+", label: "SKUs traded" },
];

const capabilities = [
  {
    icon: Smartphone,
    title: "Smartphone trading",
    body: "Deep relationships with every major OEM, and the volume to back it. Phones move through us at national scale.",
  },
  {
    icon: Boxes,
    title: "Consumer electronics",
    body: "Appliances, audio, wearables, accessories. Broad category coverage across the products Indian buyers actually shop for.",
  },
  {
    icon: Wallet,
    title: "Inventory financing",
    body: "Working capital firepower that lets us hold the right stock at the right time, without breaking the chain.",
  },
  {
    icon: Radar,
    title: "Demand sensing",
    body: "Live market signals across thousands of SKUs feed our buying and allocation calls every single day.",
  },
  {
    icon: LineChart,
    title: "Pricing & allocation",
    body: "Disciplined pricing strategy and channel allocation that protects margin without leaving share on the table.",
  },
  {
    icon: Handshake,
    title: "Manufacturer partnerships",
    body: "100+ Tier-1 brand relationships built over years of consistent, on-time, on-spec execution. We also deploy capital selectively into commodities including plastic granules, applying the same discipline to a smaller book.",
  },
];

export function CommerceTradingView() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-brand/40" />
          <div className="absolute -top-32 -right-20 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-[0.18em] font-medium">
              <Globe2 className="h-3 w-3" /> Commerce Trading
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              The engine behind India&apos;s{" "}
              <span className="italic font-display text-white/90">
                electronics trade.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Procurement, trading and allocation of smartphones and consumer
              electronics at enterprise scale, backed by 100+ manufacturer
              relationships and decades of category intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition"
              >
                Partner with our trading desk{" "}
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

      {/* STATS */}
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
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
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
                Scale, intelligence and capital,{" "}
                <span className="italic font-display">in one desk.</span>
              </h2>
            </div>
            <p className="lg:col-span-5 text-ink-soft leading-relaxed">
              Trading at this scale isn&apos;t about moving boxes. It&apos;s about knowing
              what to buy, when to buy it, where to send it and at what price.
              That&apos;s the work.
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

      {/* HOW WE OPERATE */}
      <section className="py-28 bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
              How we operate
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Built for the speed and scale of{" "}
              <span className="italic font-display text-white/90">
                India&apos;s electronics trade.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Allocation power on flagship SKUs
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                The smartphone and consumer electronics volume we move gives us
                first call on limited inventory, launch-day stock and the SKUs
                that sell out fastest.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Capital across the cycle
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Working capital depth to hold electronics stock through launches,
                seasonality and supply shocks — with selective deployment into
                commodities like plastic granules where we see clear upside.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Intelligence that compounds
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Years of trading data across thousands of electronics SKUs
                sharpen every buying, pricing and allocation decision. That same
                rigour informs our smaller commodity book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES + IMAGE */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-line bg-gradient-to-br from-surface-2 to-white p-2">
              <Image
                src={tradingShowroom}
                alt="Electronics showroom"
                className="w-full h-[460px] object-cover rounded-[20px]"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Categories
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Deep in the categories{" "}
              <span className="italic font-display">India is buying.</span>
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              We trade where the demand is — flagship smartphones, everyday
              appliances, audio gear and the accessories that complete the sale.
              Every SKU is managed by a team that tracks sell-through, margin and
              velocity in real time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: Smartphone, label: "Smartphones" },
                { icon: Boxes, label: "Consumer electronics" },
                { icon: Zap, label: "Accessories" },
                { icon: TrendingUp, label: "Selective commodities" },
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

      {/* TRUST STRIP */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-3xl border border-line bg-surface-2 p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold tracking-tight">
                  On-time, every time
                </h4>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  A track record built on consistency, not one-off wins.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white flex-shrink-0">
                <Handshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold tracking-tight">
                  Tier-1 brand trust
                </h4>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  Preferred partner status with leading global manufacturers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold tracking-tight">
                  Always-on ops
                </h4>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  A trading desk that doesn&apos;t sleep through a launch window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
