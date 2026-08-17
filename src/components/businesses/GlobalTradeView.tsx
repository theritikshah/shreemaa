"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Smartphone,
  Headphones,
  Watch,
  PackageCheck,
  Ship,
  FileCheck2,
  Zap,
} from "lucide-react";
import hero from "@/assets/infra-electronics.jpg";

const categories = [
  { icon: Smartphone, label: "Smartphones", note: "Apple, Samsung, Xiaomi, OPPO, vivo, realme & more" },
  { icon: Headphones, label: "Audio & Wearables", note: "Earbuds, headphones, smartwatches & bands" },
  { icon: Watch, label: "Accessories", note: "Chargers, cases, cables & ecosystem products" },
  { icon: Zap, label: "Consumer Tech", note: "Tablets, laptops & connected devices" },
];

const steps = [
  {
    icon: PackageCheck,
    title: "Sourced & verified",
    body: "Stock picked from authorised channels. Every unit checked for authenticity and spec before it leaves.",
  },
  {
    icon: FileCheck2,
    title: "Documentation handled",
    body: "Export paperwork, compliance and customs clearance managed end-to-end.",
  },
  {
    icon: Ship,
    title: "Shipped & delivered",
    body: "Air and sea freight to key markets. Tracking, insurance and on-time handoff.",
  },
];

export function GlobalTradeView() {
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
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-brand/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-[0.18em] font-medium">
              <Globe2 className="h-3 w-3" /> Rio World · Global Trade
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Exporting smartphones{" "}
              <span className="italic font-display text-white/90">
                and electronics to the world.
              </span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl leading-relaxed">
              Rio World is SMG&apos;s export arm. We ship premium smartphones, gadgets
              and consumer electronics to buyers across Asia, the Middle East,
              Europe and beyond — competitive pricing, reliable fulfilment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/90 transition"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/25 px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 transition"
              >
                See what we export
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              What we export
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              The brands the world{" "}
              <span className="italic font-display">is buying.</span>
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              We focus on high-velocity categories with consistent global demand.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white border border-line rounded-2xl p-6 hover:bg-surface-2 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {c.label}
                </h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {c.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-ink text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[420px] w-[420px] rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">
              How it works
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              From order to{" "}
              <span className="italic font-display text-white/90">
                out for delivery.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] transition-colors"
              >
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
                  0{i + 1}
                </div>
                <div className="mt-5 h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
